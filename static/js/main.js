
document.addEventListener("DOMContentLoaded", () => {
    initNav();

    if (location.pathname === "/" || location.pathname === "/index.html") {
        loadHotels();
    }

    if (location.pathname.startsWith("/hotel/")) {
        loadHotelDetail();
    }

    if (location.pathname === "/bookings") {
        loadBookingsPage();
    }

    if (location.pathname === "/profile") {
        loadProfile();
    }

    if (typeof initLoginForm === "function") initLoginForm();
    if (typeof initRegisterForm === "function") initRegisterForm();


    if (typeof initBookingModal === "function") initBookingModal();
});

function initNav() {
    const navLinks = document.getElementById("navLinks");
    if (!navLinks) return;

    const isAuth = document.cookie.includes("access_token");
    navLinks.innerHTML = isAuth
        ? `<a href="/">Отели</a>
           <a href="/bookings">Бронирования</a>
           <a href="/profile">Профиль</a>
           <a href="#" id="logoutBtn">Выйти</a>`
        : `<a href="/login">Вход</a>
           <a href="/register">Регистрация</a>`;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.onclick = async (e) => {
            e.preventDefault();
            await fetch(API + "/auth/logout", {
                method: "DELETE",
                credentials: "include"
            });
            location.href = "/login";
        };
    }
}

