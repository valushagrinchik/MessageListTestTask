import dotenv from 'dotenv'
dotenv.config()

import { createServer } from 'node:http'
import { MessageStorage } from './message/storage/messageStorage.js'
import { WSEventManager } from './message/storage/eventManager/wsEventManager.js'
import { WebSocketServer } from 'ws'

const hostname = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

const wsEventManager = new WSEventManager()
const messageStorage = new MessageStorage(9, wsEventManager)

function processPost(req, callback) {
    let body = []
    let data

    req.on('data', (chunk) => {
        body.push(chunk)
    })
    req.on('end', () => {
        data = Buffer.concat(body).toString()
        callback(data)
    })
}

const server = createServer((req, res) => {
    if (req.url == '/messages' && req.method == 'GET') {
        const messages = messageStorage.getMessages()

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
        res.end(JSON.stringify(messages))
        return
    }

    if (req.url == '/messages' && req.method == 'POST') {
        processPost(req, function (body) {
            messageStorage.addMessage(body)

            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            })
            res.end('OK')
        })
        return
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not found')
})

export const wss = new WebSocketServer({
    port: process.env.WS_PORT,
    clientTracking: true
})

wss.on('connection', function connection(ws) {
    console.log(wss.clients, wss.clients.size, 'clients')
    // console.log(`WS running at http://${hostname}:4000/`, wss.clients);
    ws.on('error', console.error)

    ws.on('message', function message(data) {
        console.log('received: %s', data)
        wss.clients.forEach((client) => client.send(data))
    })
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})

export default server
