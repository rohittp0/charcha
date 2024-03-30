from typing import List

import firebase_admin
import httpx
import ollama
from firebase_admin import credentials, firestore

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


def chat_on_topic(topic: firestore.firestore.DocumentSnapshot, models: List[Model]):
    messages = [{"role": "User", "content": topic.get("prompt")}]
    chats_collection = topic.reference.collection("chats")

    print(f"Starting chat on topic: {topic.get('prompt')}")
    print("==+ Chat Room +==\n")

    max_messages = Config().max_messages

    for _ in range(max_messages):
        for model in models:
            response = model.chat_all(messages)

            if response is None:
                continue

            chats_collection.add({**response, "timestamp": firestore.firestore.SERVER_TIMESTAMP})
            messages.append(response)

            print(get_formatted(response), end="")

        messages = messages[-max_messages:]
    topic.reference.update({"completed": True})


def main():
    # Use a service account.
    cred = credentials.Certificate('serviceAccount.json')

    app = firebase_admin.initialize_app(cred)
    db = firestore.client(app)

    models = init_models()

    topics = db.collection("topics").where("completed", "==", False).stream()

    for topic in topics:
        try:
            chat_on_topic(topic, models)
        except Exception as e:
            print(f"Error: {e}")
            topic.reference.update({"completed": True, "error": str(e)})


if __name__ == "__main__":
    main()
