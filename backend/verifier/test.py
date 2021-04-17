import botometer
import json

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

# Check a single account by screen name
result = bom.check_account('@jacobcollier')

print(result)
cap = result['cap']['english']
print(cap)
raw_scores = result['raw_scores']['english']
print(raw_scores['astroturf'])
print(raw_scores['fake_follower'])
print(raw_scores['financial'])
print(raw_scores['other'])
print(raw_scores['overall'])
print(raw_scores['self_declared'])
print(raw_scores['spammer'])
print(raw_scores['screen_name'])
print(json.dumps(result))