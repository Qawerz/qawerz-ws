function notifyMe() {
    var notification = new Notification('Сколько ТЫЖ программистов нужно чтобы вкрутить лампочку?', {
        body: 'Только ты!',
        dir: 'auto',
        icon: 'icon.jpg'
    });
}

function notifySet() {
    if (!("Notification" in window))
        alert("Ваш браузер не поддерживает уведомления.");
    else if (Notification.permission === "granted")
        setTimeout(notifyMe, 2000);
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function(permission) {
            if (!('permission' in Notification))
                Notification.permission = permission;
            if (permission === "granted")
                setTimeout(notifyMe, 2000);
        });
    }
}