from pydantic import BaseSettings

class TwitterSettings(BaseSettings):
    consumer_key: str = ''
    consumer_secret: str = ''
    access_token: str = ''
    access_token_secret: str = ''

class Settings(BaseSettings):
    sql_connection_string: str = "sqlite:///./backend/database/TWI.db"
    rapidapi_key: str = ""
    app_host: str = "127.0.0.1"
    app_port: int = 8000
    twitter_app_auth: TwitterSettings = TwitterSettings()

settings = Settings()