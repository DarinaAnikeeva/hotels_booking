from typing import Annotated
import jwt
from fastapi import Query, Depends, HTTPException
from pydantic import BaseModel
from starlette.requests import Request

from src.database import async_session_maker
from src.services.auth import AuthService
from src.utils.db_manager import DBManager


class PaginationPage(BaseModel):
    page: Annotated[int, Query(1, ge=1)]
    per_page: Annotated[int | None, Query(None, ge=1, lt=30)]

PaginationDep = Annotated[PaginationPage, Depends()]



def get_user_token(request: Request):
    token = request.cookies.get('access_token', None)
    if not token:
        raise HTTPException(status_code=401, detail='Вы не аутентифицированы')
    return token

def get_current_user_id(token: str = Depends(get_user_token)):
    try:
        data = AuthService().decode_token(token)
        return data['user_id']
    except jwt.exceptions.InvalidAlgorithmError:
        raise HTTPException(status_code=401, detail='Нельзя менять токен')


UserIdDep = Annotated[int, Depends(get_current_user_id)]


async def get_db():
    async with DBManager(session_factory=async_session_maker) as db:
        yield db

DBDep = Annotated[DBManager, Depends(get_db)]
