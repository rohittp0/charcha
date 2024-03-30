import re

import httpx
import ollama

from config import Config


class Model:
    model_name = None
    base_prompt = None

    cleaner_regex = re.compile(rf"([*]*\w+[*]*:)|(system[\s\n]*)", re.IGNORECASE)

    def __new__(cls, *args, **kwargs):
        if cls.base_prompt is None:
            cls.base_prompt = Config().base_prompt

        if cls.model_name is None:
            cls.model_name = Config().model

        return super().__new__(cls)

    def __init__(self, name: str, personality: str):
        system_message = Model.base_prompt.format(name=name, personality=personality)

        self.system_message = [{"role": "system", "content": system_message}]
        self.name = name

    def chat_all(self, messages):
        messages = self.system_message + list(map(self.format_message, messages))

        try:
            response = ollama.chat(model=Model.model_name, messages=messages)
        except httpx.ConnectError:
            print("Error: unable to connect to Ollama API")
            exit(1)

        response = response["message"]["content"]
        response = Model.cleaner_regex.sub("", response).strip()

        if response == "":
            return None

        return {"role": self.name, "content": response}

    def is_not_me(self, message):
        return message["role"] != self.name

    def format_message(self, message):
        if self.is_not_me(message):
            return {"role": "user", "content": message['content']}

        return {"role": "assistant", "content": message["content"]}
