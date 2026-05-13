from src.models.bookings import BookingsOrm
from src.repositories.base import BaseRepository
from src.schemas.bookings import Booking
from sqlalchemy import select
from datetime import datetime


class BookingsRepository(BaseRepository):
    model = BookingsOrm
    schema = Booking

    async def has_overlapping_dates(self, hotel_id, room_id: int, date_from, date_to) -> bool:            
        query = select(self.model).filter(
            self.model.hotel_id == hotel_id,
            self.model.room_id == room_id,
            self.model.date_from < date_from,   
            self.model.date_to > date_to   
        )
    
        result = await self.session.execute(query)
        return result.scalars().first() is not None

