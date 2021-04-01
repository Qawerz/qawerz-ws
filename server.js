require('dotenv').config()
const WebSocket = require('ws')
const express = require('express')
const fileupload = require('express-fileupload');
const http = require('http')
const serveIndex = require('serve-index')

const PORT = process.env.PORT || 3000


const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

app.use(fileupload());
app.use('/', express.static('static'))

app.use(
    '/static',
    express.static('static'),
    serveIndex('static', {icons: true}),
  )

wss.on('connection', ws =>{   
    ws.on('message', message =>{
        if (message === 'exit'){
            ws.close();
        } else {
            wss.clients.forEach(client =>{
                if (client.readyState === WebSocket.OPEN){
                    client.send(message)
                }
            })  
        }
        
    })
    ws.send('Добро пожаловать в чат.')
})

app.get('/', (req, res) => {
    res.sendFile(__dirname +'/index.html')
})

app.get('/upload', (req, res) => {
    res.sendFile(__dirname + '/upload.html')
})

app.post('/upload', function(req, res) {
    req.files.file.mv('static/uploads/' + req.files.file.name);
    res.setHeader('content-type', 'text/html;charset=utf-8');
    res.write(`
    <h1>Файл ${req.files.file.name} успешо загружен!</h1>
    <br>
    <h3>Вставьте это в чат - "/img ${req.files.file.name}"</h3>
    <h2><button onclick="window.close();">Можете закрыть окно</button></h2>
    `)
    console.log(req.files.file); // the uploaded file object
  });

server.listen(process.env.PORT, () => {
    console.log(`Server started on port ${server.address().port}`);
})

