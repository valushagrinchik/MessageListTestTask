import React from 'react'
import {
    useGetMessagesQuery,
    useWsMessageEventsListener
} from '../hooks/messages.queries'
import { useQueryClient } from '@tanstack/react-query'

export const MessagesList = () => {
    useGetMessagesQuery()
    useWsMessageEventsListener()
    const queryClient = useQueryClient()
    const data = queryClient.getQueryData(['messages'])
    return (
        <>
            {(data || []).map((message, index) => (
                <p key={index}>{message}</p>
            ))}
        </>
    )
}
