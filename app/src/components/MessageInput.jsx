import React, { useState } from 'react'
import { useAddMessageMutation } from '../hooks/messages.queries'

export const MessageInput = () => {
    const [message, setMessage] = useState('')

    const sendMessage = async (event) => {
        if (event.key === 'Enter') {
            await sendMessageRequest(message)
            setMessage('')
        }
    }

    const { mutateAsync: sendMessageRequest } = useAddMessageMutation()

    return (
        <input
            type="text"
            onChange={(event) => setMessage(event.target.value)}
            onKeyPress={sendMessage}
            value={message}
        />
    )
}
