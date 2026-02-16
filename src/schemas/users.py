from pydantic import BaseModel, Field, EmailStr


class User(BaseModel):
    id: int
    email: EmailStr
    firstname: str
    lastname: str

class UserAdd(BaseModel):
    email: EmailStr
    firstname: str
    lastname: str
    hashed_password: str

class UserRequestAdd(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    password:str = Field(max_length=72)


class UserWithHashedPassword(User):
    hashed_password: str