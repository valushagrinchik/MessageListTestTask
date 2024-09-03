import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { MessagesList } from './components/MessagesList'
import { MessageInput } from './components/MessageInput'

export const queryClient = new QueryClient()

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <MessagesList />
            <MessageInput />
        </QueryClientProvider>
    )
}

export default App
