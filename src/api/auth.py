from fastapi import HTTPException

from fastapi import APIRouter, Response

from src.api.dependencies import UserIdDep, DBDep
from src.schemas.users import UserRequestAdd, UserAdd
from src.services.auth import AuthService

router = APIRouter(prefix='/auth', tags=['Автотризация и аутентификация'])


@router.post('/register')
async def register(
        data: UserRequestAdd,
        db: DBDep
):
    hashed_password = AuthService().hash_password(data.password)
    new_user_data = UserAdd(firstname=data.firstname,
                            lastname=data.lastname,
                            email=data.email,
                            hashed_password=hashed_password)
    await db.users.add(new_user_data)
    await db.commit()
    return {'status': 'ok'}

@router.post('/login')
async def login(
        data: UserRequestAdd,
        response: Response,
        db: DBDep
):
    user = await db.users.get_user_with_hashed_password(email=data.email)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email")
    if not AuthService().verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    access_token = AuthService().create_access_token({'user_id': user.id})
    response.set_cookie('access_token', access_token)
    return {'status': access_token}

@router.get('/me')
async def get_me(
        user_id: UserIdDep,
        db: DBDep
):
    return await db.users.get_one_or_none(id=user_id)



@router.delete('/logout')
async def logout(
        response: Response
):
    response.delete_cookie("access_token")
    return {'status': 'ok'}