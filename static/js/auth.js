const API = "http://localhost:8000/api";


async function checkAuth() {
    try {
        const res = await fetch(API + "/auth/me", {
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
        });
        if (!res.ok) throw new Error();
        return true;
    } catch {
        show("Требуется авторизация");
        setTimeout(() => location.href = "/login", 1000);
        return false;
    }
}

function initLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.onsubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(API + "/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                    email: e.target.email.value,
                    password: e.target.password.value
                })
            });
            const data = await res.json();

            if (res.ok) {
                location.href = "/";
            } else {
                show(data.detail || "Ошибка входа");
            }
        } catch (err) {
            show("Ошибка соединения с сервером");
        }
    };
}

function initRegisterForm() {
    const regForm = document.getElementById("registerForm");
    if (!regForm) return;

    regForm.onsubmit = async (e) => {
        e.preventDefault();

        if (e.target.password.value !== e.target.passwordConfirm.value) {
            return show("Пароли не совпадают");
        }

        try {
            const res = await fetch(API + "/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstname: e.target.firstName.value,
                    lastname: e.target.lastName.value,
                    email: e.target.email.value,
                    password: e.target.password.value
                })
            });

            if (res.ok) {
                show("Успешно! Теперь войдите.", "success");
                setTimeout(() => location.href = "/login", 1200);
            } else {
                const data = await res.json();
                show(data.detail || "Ошибка регистрации");
            }
        } catch (err) {
            show("Ошибка соединения с сервером");
        }
    };
}

window.initLoginForm = initLoginForm;
window.initRegisterForm = initRegisterForm;