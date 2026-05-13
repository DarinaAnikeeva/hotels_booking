from fastapi import APIRouter, Body
from fastapi.openapi.models import Example

from src.api.dependencies import DBDep
from src.database import async_session_maker
from src.repositories.rooms import RoomsRepository
from src.schemas.rooms import RoomPOST, RoomPATCH

router = APIRouter(prefix='/api/hotels', tags=['Номера'])

@router.get('/{hotel_id}/rooms', summary='Получить все номера отеля')
async def get_rooms(
        hotel_id: int,
        db: DBDep
):
    return await db.rooms.get_with_filters(hotel_id=hotel_id)

@router.get('/{hotel_id}/rooms/{room_id}', summary='Получить номер отеля')
async def get_room(
        room_id: int,
        db: DBDep
):
    return await db.rooms.get_one_or_none(id=room_id)


@router.post('/{hotel_id}/rooms', summary='Добавить номер')
async def create_rooms(
        db: DBDep,
        room_data: RoomPOST = Body(openapi_examples={
    "1": Example(summary= "Номер 1", value = {
        'hotel_id': '1',
        'title': 'Люкс номер',
        'price': '100000',
        'quantity': '5',
        }),
    "3": Example(summary= "Номер 2", value = {
        'hotel_id': '1',
        'title': 'Халупка',
        'price': '500',
        'quantity': '2',
        })
})):
    await db.rooms.add(room_data)
    await db.commit()
    return {'status': 'ok'}


@router.put('/{hotel_id}/rooms/{room_id}', summary='Полностью изменить номер')
async def update_room(
        room_id: int,
        room_data: RoomPOST,
        db: DBDep
):
    await db.rooms.edit(room_data, id=room_id)
    await db.commit()
    return {'status': 'OK'}


@router.patch('/{hotel_id}/rooms/{room_id}', summary='Частичное изменение данных номера')
async def partial_update_room(
        room_id: int,
        room_data: RoomPATCH,
        db: DBDep
):
    await db.rooms.edit(room_data, execude_unset=True, id=room_id)
    await db.commit()
    return {'status': 'OK'}


@router.delete('/{hotel_id}/rooms/{room_id}', summary='Удалить номер')
async def delete_room(room_id: int):
    async with async_session_maker() as session:
        await RoomsRepository(session).delete(id=room_id)
        await session.commit()
    return {'status': 'OK'}