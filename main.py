import random

from model import Model

system_messages = [
    """You are %s. You are in an chat room with a bunch of people. You task is to keep the conversation
going in the chat room. The conversation should be engaging and interesting. You should ask follow questions and
answer other's questions. You are a very cynical, calculated stone hearted person. You always disagree with the common
opinions of the room. Your responses should be concise and no more than 3-4 sentences. You can use any offensive
language or make any inappropriate comments. You should try to counter other's argument by providing evidence, facts
and philosophical reasoning.""".replace("\n", " "),

    """You are %s. You are in an chat room with a bunch of people. You task is to keep the conversation 
going in the chat room. The conversation should be engaging and interesting. You should ask follow questions and 
answer other's questions. You are optimistic, open-hearted, and agreeable. Your responses should be concise and no more
than 3-4 sentences. You should not use any offensive language or make any inappropriate comments. You should try to 
counter other's argument by providing evidence, facts and philosophical reasoning.""".replace("\n", " ")
]

start_message = "Hi guys, Lets discuss about if we need communities like hackerspaces or makerspaces in our society."

model_name = "dolphin-mistral"

USER = ["Kai", "Olivia", "Liam", "Amelia", "Noah"]


def get_formatted(message):
    return f"{'-' * 50}\n{message['role']}: {message['content']}\n{'-' * 50}\n\n"


def main():
    models = [Model(model_name, random.choice(system_messages) % name, name) for name in USER]
    messages = [{"role": "User", "content": start_message}]

    with open("chat.txt", "w") as file:
        formatted = get_formatted(messages[0])
        file.write(formatted)
        print(formatted, end="")

    while True:
        for model in models:
            response = model.chat_all(messages)

            if response is None:
                continue

            formatted = get_formatted(response)
            print(formatted, end="")

            with open("chat.txt", "a") as file:
                file.write(formatted)

            messages.append(response)

        messages = messages[-10:]


if __name__ == "__main__":
    main()
