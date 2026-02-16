from pydantic import BaseModel, Field

class HotelAdd(BaseModel):
    title: str
    location: str

class Hotel(HotelAdd):
    id: int


class HotelsGET(BaseModel):
    id: int | None = Field(None),
    title: str | None = Field(None, description='название отеля'),
    location: str | None = Field(None),
    page: int | None = Field(None, gt=1),
    per_page: int | None = Field(None, gt=1, lt=30)


class HotelPATCH(BaseModel):
    title: str | None = Field(None)
    location: str | None = Field(None)