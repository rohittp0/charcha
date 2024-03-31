import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth
import json


def add_moderator_claim(service_account_json, moderator_json_file):
    # Initialize Firebase Admin SDK
    cred = credentials.Certificate(json.loads(service_account_json))
    firebase_admin.initialize_app(cred)

    # Load moderator details from the provided file
    with open(moderator_json_file, 'rb') as f:
        moderator_data = json.load(f)

    uid = moderator_data['uid']
    name = moderator_data['name']

    # Set custom user claims
    auth.set_custom_user_claims(uid, {'moderator': True})

    print(f"**{name}** has been successfully added as a moderator.\n\n---\n**UID**: {uid}")


if __name__ == '__main__':
    # Fetching environment variables
    service_account = os.environ.get('FIREBASE_SERVICE_ACCOUNT_JSON')
    moderator_file = os.environ.get('MODERATOR_FILE')

    if not service_account or not moderator_file:
        print("Environment variables 'FIREBASE_SERVICE_ACCOUNT_JSON' or 'MODERATOR_FILE' are not set.")
        exit(1)

    moderator_file = f"moderators/{moderator_file}.json"
    add_moderator_claim(service_account, moderator_file)
