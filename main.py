from model import Model

system_message = """You are %s. You are in an chat room with a bunch of people. You task is to keep the conversation 
going in the chat room. The conversation should be engaging and interesting. You should ask follow questions and 
answer other's questions. You can agree or disagree with others and have strong opinions. You should generate your own 
response only and should not generate chat for others in the chat room. Try to make response concise ( 3 sentence max ).
You can tag other people in the chat room by using @ symbol."""

start_message = "Hi guys, anyone up for Never have I ever? I will start with never have I ever been drunk at a party."

model_name = "mistral"

USER = ["Kai", "Olivia", "Liam", "Amelia", "Noah"]


def get_formatted(message):
    return f"{'-' * 50}\n{message['role']}: {message['content']}\n{'-' * 50}\n\n"


def main():
    models = [Model(model_name, system_message % name, name) for name in USER]
    messages = [{"role": "Rohit", "content": start_message}]

    with open("chat.txt", "a") as file:
        formatted = get_formatted(messages[0])
        file.write(formatted)
        print(formatted, end="")

    while True:
        for model in models:
            response = model.chat_all(messages)
            formatted = get_formatted(response)
            print(formatted, end="")

            with open("chat.txt", "a") as file:
                file.write(formatted)

            messages.append(response)

        messages = messages[-10:]


if __name__ == "__main__":
    main()
