

function loadHotels() {
    const container = document.getElementById("hotelsList");
    if (!container) return;

    container.innerHTML = '<p class="empty-state">Загрузка отелей...</p>';

    fetch(API + "/hotels")
        .then(r => {
            if (!r.ok) throw new Error("Ошибка загрузки");
            return r.json();
        })
        .then(list => {
            if (!list || list.length === 0) {
                container.innerHTML = '<p class="empty-state">Нет доступных отелей</p>';
                return;
            }
            container.innerHTML = list.map(h => `
                <div class="hotel-card">
                    <h3>${h.title || h.name || "Отель"}</h3>
                    <p class="location">📍 ${h.location || h.address || "Адрес не указан"}</p>
                    <a href="/hotel/${h.id}" class="btn btn-primary">Подробнее</a>
                </div>
            `).join("");
        })
        .catch(err => {
            container.innerHTML = '<p class="empty-state">Не удалось загрузить отели</p>';
        });
}

function loadHotelDetail() {
    const id = location.pathname.split("/").pop();
    if (!id) return;

    fetch(API + `/hotels/${id}`)
        .then(r => r.json())
        .then(h => {
            const nameEl = document.getElementById("hotelName");
            const addrEl = document.getElementById("hotelAddress");
            if (nameEl) nameEl.textContent = h.title || h.name || "Отель";
            if (addrEl) addrEl.textContent = "📍 " + (h.location || h.address || "");
        })
        .catch(err => {
            document.getElementById("hotelName").textContent = "Ошибка загрузки";
        });

    fetch(API + `/hotels/${id}/rooms`)
        .then(r => r.json())
        .then(rooms => {
            const container = document.getElementById("roomsList");
            if (!container) return;

            if (!rooms || rooms.length === 0) {
                container.innerHTML = '<p class="empty-state">Нет доступных номеров</p>';
                return;
            }

            container.innerHTML = rooms.map(r => `
                <div class="room-card">
                    <div>
                        <h4>${r.title || r.name || "Номер"}</h4>
                        <p class="room-price">${r.price} ₽ / ночь</p>
                        ${r.description ? `<p class="room-features">${r.description}</p>` : ''}
                    </div>
                    <button class="btn btn-primary" onclick="bookRoom(${r.id}, ${r.price}, '${id}', '${(r.title || r.name || "Номер").replace(/'/g, "\\'")}')">
                        Забронировать
                    </button>
                </div>
            `).join("");
        })
        .catch(err => {
            document.getElementById("roomsList").innerHTML = '<p class="empty-state">Не удалось загрузить номера</p>';
        });
}

window.loadHotels = loadHotels;
window.loadHotelDetail = loadHotelDetail;