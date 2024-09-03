import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useGetMessagesQuery = () => {
    return useQuery({
        queryKey: ['messages'],
        queryFn: () =>
            fetch(import.meta.env.VITE_API_URL + `/messages`).then((res) => {
                return res.json()
            })
    })
}

export const useAddMessageMutation = () => {
    return useMutation({
        mutationFn: (input) =>
            fetch(import.meta.env.VITE_API_URL + `/messages`, {
                method: 'POST',
                body: input
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch')
                }
                return res.text()
            }),
        onSuccess: async () => {}
    })
}

export const useWsMessageEventsListener = () => {
    const queryClient = useQueryClient()

    useEffect(() => {
        const socket = new WebSocket(import.meta.env.VITE_WS_URL)

        socket.addEventListener('message', (event) => {
            event.data.text().then((text) => {
                console.log('Message from server ', text)
                const data = queryClient.getQueryData(['messages'])

                const json = JSON.parse(text)
                switch (json.event) {
                    case 'ADDED': {
                        data.push(json.data)
                        queryClient.setQueryData(['messages'], data)
                        return
                    }
                    case 'REMOVED': {
                        data.shift()
                        queryClient.setQueryData(['messages'], data)
                        return
                    }
                    default: {
                        console.log('unknown event')
                    }
                }
            })
        })

        return () => socket.close()
    }, [])
}
