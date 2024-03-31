import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth
import json


def add_moderator_claim(service_account_json, moderator_json_file):
    moderator_json_file = os.path.join("moderators", moderator_json_file)

    if not os.path.isfile(moderator_json_file):
        print(f"File '{moderator_json_file}' not found or is not a file.")
        exit(1)

    # Load moderator details from the provided file
    with open(moderator_json_file, 'rb') as f:
        moderator_data = json.load(f)

    # Initialize Firebase Admin SDK
    cred = credentials.Certificate(json.loads(service_account_json))
    firebase_admin.initialize_app(cred)

    email = moderator_data['email']
    name = moderator_data['name']

    # Set custom user claims
    try:
        user = auth.get_user_by_email(email)
    except auth.UserNotFoundError:
        print(f"Unable to make **{name}** moderator, user with Email `{email}` not found.")
        exit(1)

    auth.set_custom_user_claims(user.uid, {'moderator': True})

    print(f"**{name}** has been successfully added as a moderator.\n\n---\n**User**: `{email}`")


if __name__ == '__main__':
    # Fetching environment variables
    service_account = os.environ.get('FIREBASE_SERVICE_ACCOUNT_JSON')
    moderator_file = os.environ.get('MODERATOR_FILE')

    if not service_account or not moderator_file:
        print("Environment variables 'FIREBASE_SERVICE_ACCOUNT_JSON' or 'MODERATOR_FILE' are not set.")
        exit(1)

    moderator_file = f"{moderator_file}.json"
    add_moderator_claim(service_account, moderator_file)
