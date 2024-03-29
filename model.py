import re

import ollama


class Model:
    def __init__(self, model_name, system_message, name=None):
        self.model_name = model_name
        self.name = name or model_name
        self.system_message = [{"role": "system", "content": system_message}]
        self.cleaner_regex = re.compile(rf"[:@\s]*{self.name}[:@\s]*", re.IGNORECASE)

    def chat_all(self, messages):
        messages = self.system_message + list(map(self.format_message, messages))
        response = ollama.chat(model=self.model_name, messages=messages)

        response = response["message"]["content"]
        response = self.cleaner_regex.sub("", response)

        return {"role": self.name, "content": response}

    def is_not_me(self, message):
        return message["role"] != self.name

    def format_message(self, message):
        if self.is_not_me(message):
            return {"role": "user", "content": f"{message['role']}: {message['content']}"}

        return {"role": "assistant", "content": message["content"]}
