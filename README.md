# Botometer Client

Simple Web App serving as a client for the Botometer API.

## SETUP:
pip install -r backend/requirements.txt

After that you need to fill out needed information in backend/config.py
(You need apply for Twitter Developer account and subscribe to Botometer on RapidAPI to get the api key)

## RUN:
python -m backend.main

(or: uvicorn backend.main:app --reload)
