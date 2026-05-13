from fastapi import APIRouter, HTTPException, status

from src.api.dependencies import DBDep, UserIdDep
from src.schemas.bookings import BookingPOST, BookingPOSTRequest

router = APIRouter(prefix='/api/bookings', tags=['Бронирование'])


@router.get('', summary='Получить все бронирования')
async def get_bookings(db: DBDep):
    return await db.bookings.get_all()

@router.get('/me', summary='Получить мои бронирования')
async def get_user_bookings(user_id: UserIdDep, db: DBDep):
    return await db.bookings.get_with_filters(user_id=user_id)


@router.post('', summary='Добавление брони')
async def create_booking(user_id: UserIdDep, booking_data: BookingPOSTRequest, db: DBDep):
    days = (booking_data.date_to - booking_data.date_from).days
    if days < 1 or days > 30:
        raise HTTPException(status_code=400, detail="Бронирование возможно на срок от 1 до 30 дней")

    overlap = await db.bookings.has_overlapping_dates(
        hotel_id=booking_data.hotel_id,
        room_id=booking_data.room_id,
        date_to=booking_data.date_from,  
        date_from=booking_data.date_to     
    )
    if overlap:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Номер уже забронирован на выбранные даты. Попробуйте другие."
        )

    room = await db.rooms.get_one_or_none(id=booking_data.room_id)
    room_price = room.price
    _booking_data = BookingPOST(
        user_id=user_id,
        price=room_price*days,
        **booking_data.model_dump()
    )
    await db.bookings.add(_booking_data)
    await db.commit()
    return {'status': 'success', 'data': _booking_data}


@router.get('/{booking_id}', summary='Получить конкретное бронирование')
async def get_booking(booking_id: int, user_id: UserIdDep, db: DBDep):
    booking = await db.bookings.get_one_or_none(id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    return booking

@router.delete('/{booking_id}', summary='Удалить бронирование')
async def delete_booking(booking_id: int, user_id: UserIdDep, db: DBDep):
    booking = await db.bookings.get_one_or_none(id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    await db.bookings.delete(id=booking_id)
    await db.commit()

    return {"status": "success", "message": "Booking deleted"}

