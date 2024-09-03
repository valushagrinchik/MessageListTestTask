import { BaseEventManager } from './baseEventManager.js'
import { WebSocket } from 'ws'

export class WSEventManager extends BaseEventManager {
    wsClient
    constructor() {
        super()
        this.wsClient = new WebSocket(
            `ws://${process.env.HOST}:${process.env.WS_PORT}`
        )
    }

    emit(event, data) {
        super.emit(event, data)
        this.wsClient.send(JSON.stringify({ event, data }))
    }
}
