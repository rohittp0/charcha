import json

import httpx
import ollama

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
        print("\r")

    except httpx.ConnectError:
        print("Error: unable to connect to Ollama API")
        exit(1)

    return [Model(model["name"], model["personality"]) for model in config.agents]


def main():
    models = init_models()

    with open("chat.json", "w") as file:
        messages = [{"role": "User", "content": input("What do you want to talk about?\n")}]

        file.write(f"[{json.dumps(messages[0])},")
        print("\n==+ Chat Room +==\n")

        while True:
            try:
                for model in models:
                    response = model.chat_all(messages)

                    if response is None:
                        continue

                    print(get_formatted(response), end="")
                    file.write(f"{json.dumps(response)},")

                    messages.append(response)

                messages = messages[-10:]
            except KeyboardInterrupt:
                break

        file.write("]")


if __name__ == "__main__":
    main()
