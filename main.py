import json
from pathlib import Path

import httpx
import ollama

from config import Config
from model import Model
from ui import create_ui


def get_formatted(message):
    return f"{'-' * 50}\n{message['role']}: {message['content']}\n{'-' * 50}\n\n"


def init_files():
    config = Config()

    Path(config.chat_json).parent.mkdir(parents=True, exist_ok=True)
    Path(config.chat_json).touch()

    Path(config.chat_html).parent.mkdir(parents=True, exist_ok=True)
    Path(config.chat_html).touch()


def init_models():
    config = Config()

    try:
        for progress in ollama.pull(config.model, stream=True):
            percent = progress.get("completed", 0) / progress.get("total", 1) * 100
            print(f"\rOllama Pull: {progress['status']} - {percent} %", end="")
        print("\r")

    except httpx.ConnectError:
        print("Error: unable to connect to Ollama API")
        exit(1)

    return [Model(model["name"], model["personality"]) for model in config.agents]


def main():
    init_files()

    models = init_models()
    config = Config()

    with open(config.chat_json, "w") as file:
        messages = [{"role": "User", "content": input("What do you want to talk about?\n")}]

        file.write(f"[{json.dumps(messages[0])}")
        print("\n==+ Chat Room +==\n")

        while True:
            try:
                for model in models:
                    response = model.chat_all(messages)

                    if response is None:
                        continue

                    print(get_formatted(response), end="")
                    file.write(f",{json.dumps(response)}")

                    messages.append(response)

                messages = messages[-config.max_messages:]
            except KeyboardInterrupt:
                break

        file.write("]")

    create_ui(config.chat_json, config.chat_html)
    print(f"Chat saved at {config.chat_json} and {config.chat_html}")


if __name__ == "__main__":
    main()
