import json

MSG_TEMPLATE = """
<div class="msg {position}-msg">
    <div class="msg-bubble">
        <div class="msg-info">
            <div class="msg-info-name">{role}</div>
        </div>
        <div class="msg-text">
            {content}
        </div>
    </div>
</div>
"""

POSITIONS = ["right", "left"]


def create_ui(chat_json: str, chat_html: str):
    chat = json.load(open(chat_json, "rb"))
    template_html = open("template/chat.html", "r").read()

    messages = [MSG_TEMPLATE.format(**message, position=POSITIONS[i % 2]) for i, message in enumerate(chat)]
    messages = "".join(messages)

    with open(chat_html, "w") as file:
        file.write(template_html.replace("{{chat_content}}", messages))
