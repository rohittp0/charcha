from typing import List, TypedDict

import toml


class Agent(TypedDict):
    name: str
    personality: str


class Config:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(Config, cls).__new__(cls)
            cls._instance._config = toml.load("config.toml")
        return cls._instance

    @staticmethod
    def validate_config(config):
        if "system" not in config:
            raise ValueError("Config must have a 'system' key.")

        for key in ["model", "max_messages", "base_prompt"]:
            if key not in config["system"]:
                raise ValueError(f"Config must have a '{key}' key in 'system'.")

        if "agents" not in config:
            raise ValueError("Config must have an 'agents' key.")

        if len(config["agents"]) == 0:
            raise ValueError("Config must have at least one agent.")

        for i, agent in enumerate(config["agents"]):
            if {"name", "personality"} != set(agent.keys()):
                raise ValueError(f"Agent {i} must have 'name' and 'personality' only.")

    @property
    def model(self) -> str:
        return self._config["system"]["model"]

    @property
    def max_messages(self) -> int:
        return self._config["system"]["max_messages"]

    @property
    def base_prompt(self) -> str:
        return self._config["system"]["base_prompt"]

    @property
    def agents(self) -> List[Agent]:
        return self._config["agents"]

    @property
    def chat_json(self) -> str:
        return self._config["system"].get("chat_json", "output/chat.json")

    @property
    def chat_html(self) -> str:
        return self._config["system"].get("chat_html", "output/chat.html")
