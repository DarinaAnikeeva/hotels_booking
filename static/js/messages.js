

const ERROR_TRANSLATIONS = {
    "field required": "Обязательное поле",
    "value is not a valid integer": "Должно быть числом",
    "value is not a valid date": "Некорректная дата",
    "ensure this value has at least": "Минимальная длина",
    "ensure this value has at most": "Максимальная длина",
    "type_error": "Ошибка типа",
    "value_error": "Ошибка значения",
    "Incorrect email": "Неверный email",
    "Incorrect password": "Неверный пароль"
};

function translateError(msg) {
    if (!msg) return "Произошла ошибка";
    for (const [en, ru] of Object.entries(ERROR_TRANSLATIONS)) {
        if (msg.toLowerCase().includes(en.toLowerCase())) return ru;
    }
    return msg;
}

function show(msg, type = "error") {
    const el = document.getElementById("alert");
    if (!el) { alert(msg || "Произошла ошибка"); return; }

    let message = msg;
    if (Array.isArray(msg)) {
        message = msg.map(err => {
            const text = typeof err === 'object' && err !== null ? err.msg || err.detail || JSON.stringify(err) : err;
            return translateError(text);
        }).join(", ");
    } else if (typeof msg === 'object' && msg?.detail) {
        message = Array.isArray(msg.detail)
            ? msg.detail.map(e => translateError(e.msg || JSON.stringify(e))).join(", ")
            : translateError(msg.detail);
    } else if (typeof msg === 'object') {
        message = translateError(msg.message || JSON.stringify(msg));
    } else {
        message = translateError(msg);
    }

    if (!message || message === "undefined" || message === "null") {
        message = type === "success" ? "Операция выполнена" : "Произошла ошибка";
    }

    el.textContent = message;
    el.className = `alert alert-${type} show`;
    setTimeout(() => el.classList.remove("show"), 5000);
}