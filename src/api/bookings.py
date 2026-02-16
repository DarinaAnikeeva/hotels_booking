from fastapi import APIRouter

from src.api.dependencies import DBDep, UserIdDep
from src.schemas.bookings import BookingPOST, BookingPOSTRequest

router = APIRouter(prefix='/bookings', tags=['Бронирование'])


@router.get('', summary='Получить все бронирования')
async def get_bookings(db: DBDep):
    return await db.bookings.get_all()

@router.get('/me', summary='Получить мои бронирования')
async def get_user_bookings(user_id: UserIdDep, db: DBDep):
    return await db.bookings.get_with_filters(user_id=user_id)


@router.post('', summary='Добавление брони')
async def create_booking(user_id: UserIdDep, booking_data: BookingPOSTRequest, db: DBDep):
    room = await db.rooms.get_one_or_none(id=booking_data.room_id)
    room_price = room.price
    _booking_data = BookingPOST(
        user_id=user_id,
        price=room_price,
        **booking_data.model_dump()
    )
    await db.bookings.add(_booking_data)
    await db.commit()
    return {'status': 'success', 'data': _booking_data}

