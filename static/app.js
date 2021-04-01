const status = document.getElementById('status');
const message = document.getElementById('messages')
const form = document.getElementById('form')
const input = document.getElementById('input')

const inp_file = document.getElementById('inp_file')

const nick_form = document.getElementById('nick_form')
const nick_input = document.getElementById('nick_input')


const ws = new WebSocket('ws://localhost:3000')

var user = ''

function setStatus(value){
    status.innerHTML = value
}

function printMessage(value){
    const li = document.createElement('li')

    li.innerHTML = value
    messages.appendChild(li)
}

form.addEventListener('submit', event =>{
    event.preventDefault()
    var arg = []
    console.log(arg);
    arg = input.value.split(' ')
    console.log(arg);

    for (var i = 0; i < arg.length; i++){
        if (arg[i] === undefined) {
            delete arg[i]
        }
    }

    if(arg.length > 1 & arg[0] === '/img'){
            console.log(arg[0]);
            ws.send(`[${user}]<img src="./uploads/${arg[1]}">`)
            input.value = ''
    } else{
        ws.send(`[${user}] ${input.value}`)
        input.value = '' 
    }

    
})

nick_form.addEventListener('submit', event =>{
    event.preventDefault()

    user = nick_input.value;

    nick_form.classList.add('hidden')
    wsopen();
})


function wsopen() {
    form.classList.remove('hidden')
    notifySet()

    console.log(ws);
    setStatus('ONLINE')
    status.classList.add('lime')
    status.classList.remove('red')
    status.classList.remove('blue')
    // printMessage(`Добро пожжаловать, ${user}`)
    ws.send(`Подключился пользователь ${user}`)

    ws.onclose = () => {
        setStatus('DISCONECTED')
        status.classList.add('blue')
        status.classList.remove('red')
        status.classList.remove('lime')
    }

    ws.onmessage = response => {
        printMessage(response.data)
        notifyMe(response.data)
    }

}

inp_file.addEventListener('click', () =>{
    window.open('/upload', 'example', 'width=600,height=400');  
})


window.onunload = () => ws.send(`Пользователь ${user} покинул чат.`)


//notification

function notifyMe(body) {
    var notification = new Notification('WebSocets', {
        body: body,
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