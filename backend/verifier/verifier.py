import botometer
import asyncio
import json

from ..database import crud, models, schemas
from ..database.database import SessionLocal, engine

rapidapi_key = "d734e91293mshe56e194e43ce8f4p169581jsna5ce09b0ee70"
twitter_app_auth = {
    'consumer_key': 'mFsFjY2TIehNblYqeiv9XH5sR',
    'consumer_secret': '5JyK3kjzwjuIS9ZGQ9uiBySJMULNDhjvcmKyMjBLLWRVqielWT',
    'access_token': '1262265835504230400-f8Zmdljn358ACJORTc1KC2ccqWT1AU',
    'access_token_secret': 'yE3vZCkdF2QGWqzWByALcgFawiR4TnBUbFYxFrxo6BL5W',
  }
bom = botometer.Botometer(wait_on_ratelimit=True,
                          rapidapi_key=rapidapi_key,
                          **twitter_app_auth)

def verify_account(username, verification_id):
    db = SessionLocal()
    try:
        result = bom.check_account(f'@{username}')

        account_verification = crud.get_verification(db, verification_id=verification_id)
        if account_verification:
            cap = result['cap']['english']
            raw_scores = result['raw_scores']['english']
            user = result['user']

            account_verification.astroturf = raw_scores['astroturf'] >= cap
            account_verification.fake_follower = raw_scores['fake_follower'] >= cap
            account_verification.financial = raw_scores['financial'] >= cap
            account_verification.other = raw_scores['other'] >= cap
            account_verification.overall = raw_scores['overall'] >= cap
            account_verification.self_declared = raw_scores['self_declared'] >= cap
            account_verification.spammer = raw_scores['spammer'] >= cap
            account_verification.language = user['majority_lang']
            account_verification.screen_name = user['user_data']['screen_name']
            account_verification.id_str = user['user_data']['id_str']
            account_verification.verification_result_json = json.dumps(result)

            verification_id = crud.update_account_verification(db, verification=account_verification)

            account = crud.get_account(db, account_id=account_verification.account_id)
            if account:
                account.verified = True
                account.valid = not account_verification.overall
                crud.update_account(db, account=account)
    except botometer.NoTimelineError:
        account_verification = crud.get_verification(db, verification_id=verification_id)
        if account_verification:
            account_verification.no_timeline = True
            verification_id = crud.update_account_verification(db, verification=account_verification)

            account = crud.get_account(db, account_id=account_verification.account_id)
            if account:
                account.verified = True
                account.valid = False
                crud.update_account(db, account=account)
    finally:
        db.close()

def verify_accounts(verification_ids):
    db = SessionLocal()
    try:
        usernames = []
        for verification_id in verification_ids:
            account_verification = crud.get_verification(db, verification_id=verification_id)
            account = crud.get_account(db, account_id=account_verification.account_id)
            usernames.append(f'@{account.username}')

        for screen_name, result in bom.check_accounts_in(usernames):
            account = crud.get_account_by_accountname(db, username=screen_name)
            if account:
                account.verified = True
                account.valid = not account_verification.overall
                crud.update_account(db, account=account)

                for verification_id in verification_ids:
                    account_verification = crud.get_verification(db, verification_id=verification_id)
                    if account_verification and account.id is account_verification.account_id:
                        cap = result['cap']['english']
                        raw_scores = result['raw_scores']['english']
                        user = result['user']

                        account_verification.astroturf = raw_scores['astroturf'] >= cap
                        account_verification.fake_follower = raw_scores['fake_follower'] >= cap
                        account_verification.financial = raw_scores['financial'] >= cap
                        account_verification.other = raw_scores['other'] >= cap
                        account_verification.overall = raw_scores['overall'] >= cap
                        account_verification.self_declared = raw_scores['self_declared'] >= cap
                        account_verification.spammer = raw_scores['spammer'] >= cap
                        account_verification.language = user['majority_lang']
                        account_verification.screen_name = user['user_data']['screen_name']
                        account_verification.id_str = user['user_data']['id_str']
                        account_verification.verification_result_json = json.dumps(result)

                        verification_id = crud.update_account_verification(db, verification=account_verification)
                        break
    finally:
        db.close()

