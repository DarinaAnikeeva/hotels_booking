

function loadProfile() {
    fetch(API + "/auth/me", {
        headers: { "Content-Type": "application/json" },
        credentials: 'include'
    })
        .then(r => {
            if (!r.ok) throw new Error();
            return r.json();
        })
        .then(u => {
            const emailEls = ["userEmail", "profileEmail"];
            emailEls.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = u.email || "—";
            });

            const name = (u.firstname && u.lastname)
                ? `${u.firstname} ${u.lastname}`
                : "Пользователь";
            const nameEls = ["userName", "name"];
            nameEls.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = name;
            });

            const idEl = document.getElementById("userId");
            if (idEl) idEl.textContent = u.id || "—";

            const avatarEl = document.getElementById("userAvatar");
            if (avatarEl) {
                avatarEl.textContent = (u.email || "U")[0].toUpperCase();
            }
        })
        .catch(err => {
            show("Не удалось загрузить профиль");
            setTimeout(() => location.href = "/login", 1000);
        });
}

window.loadProfile = loadProfile;