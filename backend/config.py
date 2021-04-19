from pydantic import BaseSettings

class TwitterSettings(BaseSettings):
    consumer_key: str = 'mFsFjY2TIehNblYqeiv9XH5sR'
    consumer_secret: str = '5JyK3kjzwjuIS9ZGQ9uiBySJMULNDhjvcmKyMjBLLWRVqielWT'
    access_token: str = '1262265835504230400-f8Zmdljn358ACJORTc1KC2ccqWT1AU'
    access_token_secret: str = 'yE3vZCkdF2QGWqzWByALcgFawiR4TnBUbFYxFrxo6BL5W'

class Settings(BaseSettings):
    sql_connection_string: str = "sqlite:///./backend/database/TWI.db"
    rapidapi_key: str = "d734e91293mshe56e194e43ce8f4p169581jsna5ce09b0ee70"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    twitter_app_auth: TwitterSettings = TwitterSettings()

settings = Settings()