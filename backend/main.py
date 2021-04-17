from fastapi import Depends, FastAPI, APIRouter, HTTPException, Request, Response
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from pydantic import BaseModel

import uuid

from shutil import copyfile

from typing import List

from sqlalchemy.orm import Session

from .database import crud, models, schemas
from .database.database import SessionLocal, engine

from .routers import accounts, views

def create_app():

    models.Base.metadata.create_all(bind=engine)

    app = FastAPI(title="Weryfikacja kont twittera",version="0.0.1")
    app.mount("/css", StaticFiles(directory="frontend/css"), name="css")
    app.mount("/js", StaticFiles(directory="frontend/js"), name="js")
    app.include_router(accounts.router)
    app.include_router(views.router)

    @app.middleware("http")
    async def db_session_middleware(request: Request, call_next):
        response = Response("Internal server error", status_code=500)
        try:
            request.state.db = SessionLocal()
            response = await call_next(request)
        finally:
            request.state.db.close()
        return response

    @app.on_event("startup")
    async def startup():
        pass

    @app.on_event("shutdown")
    async def shutdown():
        pass
    
    return app
    
app = create_app()
