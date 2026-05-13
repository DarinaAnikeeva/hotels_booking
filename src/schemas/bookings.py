from datetime import date

from pydantic import BaseModel


class BookingPOSTRequest(BaseModel):
    hotel_id: int
    room_id: int
    date_from: date
    date_to: date

class BookingPOST(BookingPOSTRequest):
    user_id: int
    price: int

class Booking(BookingPOST):
    id: int