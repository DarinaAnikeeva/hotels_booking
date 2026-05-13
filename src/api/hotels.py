from fastapi_cache.decorator import cache
from fastapi import APIRouter, Body

from src.api.dependencies import DBDep
from src.schemas.hotels import Hotel, HotelPATCH
from fastapi.openapi.models import Example

router = APIRouter(prefix='/api/hotels', tags=['Отели'])

@router.get("", summary='Получить отели')
@cache(expire=10)
async def get_hotels(db: DBDep):
    return await db.hotels.get_all()


@router.get('/{hotel_id}', summary='Получить один отель')
async def get_hotel(hotel_id: int, db: DBDep):
    return await db.hotels.get_one_or_none(id=hotel_id)


@router.delete('/{hotel_id}', summary='Удалить отель')
async def delete_hotel(hotel_id: int, db: DBDep):
    await db.hotels.delete(id=hotel_id)
    await db.commit()
    return {'status': 'OK'}


@router.post('', summary='Создать отель')
async def create_hotel(db: DBDep, hotel_data: Hotel = Body(openapi_examples={
    "1": Example(summary= "Сибирь", value = {
        'title': '',
        'location': ''
}),
})):
    hotel = await db.hotels.add(hotel_data)
    await db.commit()
    return {'status' : 'OK', 'data' : hotel}


@router.put('/{hotel_id}', summary='Полностью изменить отель')
async def update_hotel(
        hotel_id: int,
        hotel_data: Hotel,
        db: DBDep
):
    await db.hotels.edit(hotel_data, id=hotel_id)
    await db.commit()
    return {'status': 'OK'}


@router.patch('/{hotel_id}', summary='Частичное изменение данных отеля')
async def partial_update_hotel(
        hotel_id: int,
        hotel_data: HotelPATCH,
        db: DBDep
):
    await db.hotels.edit(hotel_data, execude_unset=True, id=hotel_id)
    await db.commit()
    return {'status': 'OK'}