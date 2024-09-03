import { MessageStorageEvents } from './events.js'
export class MessageStorage {
    messages = []
    length = 0
    eventManager
    constructor(length, eventManager = new EventManager()) {
        this.messages = []
        this.length = length
        this.eventManager = eventManager
    }

    addMessage(newMessage) {
        if (this.messages.length + 1 > this.length) {
            const oldMessage = this.messages.shift()
            this.eventManager.emit(MessageStorageEvents.REMOVED, oldMessage)
        }
        this.messages.push(newMessage)
        this.eventManager.emit(MessageStorageEvents.ADDED, newMessage)
    }

    getMessages() {
        return this.messages
    }
}
