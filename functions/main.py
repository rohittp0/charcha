from queue import Queue
from typing import List
import threading

import firebase_admin
import httpx
import ollama
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1 import DocumentSnapshot, SERVER_TIMESTAMP, FieldFilter, And

from config import Config
from model import Model


def get_formatted(message):
    return f"{'-' * 50}\n{message['role']}: {message['content']}\n{'-' * 50}\n\n"


def init_models():
    config = Config()

    try:
        for progress in ollama.pull(config.model, stream=True):
            percent = progress.get("completed", 0) / progress.get("total", 1) * 100
            print(f"\rOllama Pull: {progress['status']} - {percent} %", end="")
        print("\r", '' * 100)

    except httpx.ConnectError:
        print("Error: unable to connect to Ollama API")
        exit(1)

    return [Model(model["name"], model["personality"]) for model in config.agents]


def chat_on_topic(topic: DocumentSnapshot, models: List[Model]):
    chats_collection = topic.reference.collection("chats")
    user = {"role": "User", "content": topic.get("prompt")}

    print(f"Starting chat on topic: {user['content']}")
    print("==+ Chat Room +==\n")

    max_messages = Config().max_messages
    messages = []

    for _ in range(max_messages):
        for model in models:
            response = model.chat_all([user, *messages])

            if response is None:
                continue

            chats_collection.add({**response, "timestamp": SERVER_TIMESTAMP})
            messages.append(response)

            print(get_formatted(response), end="")

        messages = messages[-max_messages:]
    topic.reference.update({"completed": True})


def chat_worker(topic_queue: Queue, models: List[Model]):
    print("Chat worker started")

    while True:
        topic = topic_queue.get(block=True).reference.get()

        try:
            if topic.get("completed") or topic.get("active"):
                return print(f"Skipping as topic: {topic.get('prompt')} already completed or active")

            topic.reference.update({"active": True})
            chat_on_topic(topic, models)
        except Exception as e:
            print(f"Error: {e}")
            topic.reference.update({"completed": True, "error": str(e)})
        except KeyboardInterrupt:
            topic.reference.update({"active": False})
            topic_queue.task_done()
            break
        finally:
            topic.reference.update({"active": False})
            topic_queue.task_done()


def main():
    cred = credentials.Certificate(Config().service_account_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    models = init_models()
    topic_queue = Queue()

    worker_thread = threading.Thread(target=chat_worker, args=(topic_queue, models), daemon=True)
    worker_thread.start()

    def on_snapshot(_, changes, __):
        print(len(changes), "new topics found, adding to queue...")

        for change in changes:
            topic_queue.put(change.document)

    compound_filter = And([
        FieldFilter("completed", "==", False),
        FieldFilter("active", "==", False)
    ])

    topics_query = db.collection("topics").where(filter=compound_filter)
    topics_query.on_snapshot(on_snapshot)

    print("Listening for new topics...")

    worker_thread.join()


if __name__ == "__main__":
    main()
