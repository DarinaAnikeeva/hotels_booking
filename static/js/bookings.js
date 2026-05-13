

let currentBooking = { roomId: null, hotelId: null, price: 0 };

function openBookingModal(roomId, roomName, price, hotelId) {
    currentBooking = { roomId, hotelId, price };

    document.getElementById('roomId').value = roomId;
    document.getElementById('roomName').value = roomName;
    document.getElementById('roomPrice').value = `${price} ₽`;

    const today = new Date().toISOString().split('T')[0];
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');

    dateFrom.min = today;
    dateFrom.value = '';
    dateTo.value = '';
    dateTo.min = today;

    document.getElementById('totalPrice').value = '';

    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    dateFrom.onchange = function () {
        if (this.value) {
            const from = new Date(this.value);

            const nextDay = new Date(from);
            nextDay.setDate(nextDay.getDate() + 1);
            dateTo.min = nextDay.toISOString().split('T')[0];

            const maxDate = new Date(from);
            maxDate.setDate(maxDate.getDate() + 30);
            dateTo.max = maxDate.toISOString().split('T')[0];

            dateTo.value = '';
            document.getElementById('totalPrice').value = '';

            calculateTotal();
        }
    };

    dateTo.onchange = () => calculateTotal();
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function calculateTotal() {
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;

    if (dateFrom && dateTo) {
        const from = new Date(dateFrom);
        const to = new Date(dateTo);
        const nights = Math.ceil((to - from) / (1000 * 60 * 60 * 24));

        if (nights > 0) {
            const total = nights * currentBooking.price;
            document.getElementById('totalPrice').value = `${total} ₽`;
            return total;
        }
    }
    document.getElementById('totalPrice').value = '';
    return 0;
}

function initBookingModal() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.onsubmit = async (e) => {
            e.preventDefault();

            const dateFrom = document.getElementById('dateFrom').value;
            const dateTo = document.getElementById('dateTo').value;
            const total = calculateTotal();

            if (!dateFrom || !dateTo || total === 0) {
                show("Пожалуйста, заполните все даты", "error");
                return;
            }

            const auth = await checkAuth();
            if (!auth) {
                closeBookingModal();
                return;
            }

            try {
                const res = await fetch(API + "/bookings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                    body: JSON.stringify({
                        room_id: currentBooking.roomId,
                        hotel_id: currentBooking.hotelId,
                        date_from: dateFrom,
                        date_to: dateTo,
                    })
                });

                const rawText = await res.text();
                let data = {};
                try {
                    data = JSON.parse(rawText);
                } catch {
                    data = { detail: "Ошибка сервера. Попробуйте позже." };
                }


                closeBookingModal();

                if (res.ok) {
                    show("Бронирование успешно!", "success");
                    setTimeout(() => location.href = "/bookings", 1000);
                } else {
                    show(data.detail || "Ошибка бронирования", "error");
                }
            } catch (err) {
                show("Ошибка соединения с сервером");
            }
        };
    }

    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.onclick = (e) => { if (e.target === modal) closeBookingModal(); };
    }

    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.onclick = closeBookingModal;
    }

    document.onkeydown = (e) => { if (e.key === 'Escape') closeBookingModal(); };
}
async function bookRoom(roomId, price, hotelId, roomName = "Номер") {
    const auth = await checkAuth();
    if (!auth) return;
    openBookingModal(roomId, roomName, price, hotelId);
}

function loadBookingsPage() {
    const hotelsCache = {};

    fetch(API + "/hotels")
        .then(r => r.json())
        .then(hotels => {
            hotels.forEach(hotel => { hotelsCache[hotel.id] = hotel; });
        })
        .catch((err) => {

        })
        .finally(() => {
            loadBookings(hotelsCache);
        });
}

function loadBookings(hotelsCache) {
    const container = document.getElementById("bookingsList");
    if (!container) return;

    container.innerHTML = '<p class="empty-state">Загрузка бронирований...</p>';

    fetch(API + "/bookings/me", {
        headers: { "Content-Type": "application/json" },
        credentials: 'include'
    })
        .then(r => {
            if (!r.ok) throw new Error();
            return r.json();
        })
        .then(list => {
            if (!list || list.length === 0) {
                container.innerHTML = `
                <p class="empty-state">У вас пока нет бронирований</p>
                <a href='/' class='btn btn-primary' style='margin-top: 1rem; display: inline-block;'>Найти отель</a>
            `;
                return;
            }

            container.innerHTML = list.map(b => {
                const hotel = hotelsCache[b.hotel_id] || {};
                const hotelName = hotel.title || hotel.name || `Отель #${b.hotel_id}`;
                const hotelLocation = hotel.location || hotel.address || '';

                const dateFrom = new Date(b.date_from).toLocaleDateString('ru-RU');
                const dateTo = new Date(b.date_to).toLocaleDateString('ru-RU');

                return `
                <div class="booking-card">
                    <div class="booking-header">
                        <h3>${hotelName}</h3>
                        <span class="booking-status status-confirmed">Подтверждено</span>
                    </div>
                    <p class="location">📍 ${hotelLocation}</p>
                    <div class="booking-details">
                        <div class="booking-detail-item">
                            <span class="label">Номер</span>
                            <span class="value">#${b.room_id}</span>
                        </div>
                        <div class="booking-detail-item">
                            <span class="label">Заезд</span>
                            <span class="value">${dateFrom}</span>
                        </div>
                        <div class="booking-detail-item">
                            <span class="label">Выезд</span>
                            <span class="value">${dateTo}</span>
                        </div>
                        <div class="booking-detail-item">
                            <span class="label">Итого</span>
                            <span class="value">${b.price} ₽</span>
                        </div>
                    </div>
                    <div class="booking-actions">
                        <button class="btn btn-danger" onclick="cancelBooking(${b.id})">Отменить</button>
                    </div>
                </div>
            `;
            }).join("");
        })
        .catch(err => {
            container.innerHTML = `
            <p class="empty-state">Не удалось загрузить бронирования</p>
            <a href='/login' class='btn btn-primary' style='margin-top: 1rem;'>Войти</a>
        `;
        });
}

function cancelBooking(id) {
    if (!confirm("Вы уверены, что хотите отменить бронирование?")) return;

    fetch(API + `/bookings/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: 'include'
    })
        .then(r => {
            if (r.ok) {
                show("Бронирование отменено", "success");
                setTimeout(() => location.reload(), 800);
            } else {
                show("Не удалось отменить бронирование");
            }
        })
        .catch(() => show("Ошибка соединения"));
}

window.cancelBooking = cancelBooking;
window.loadBookingsPage = loadBookingsPage;
window.initBookingModal = initBookingModal;