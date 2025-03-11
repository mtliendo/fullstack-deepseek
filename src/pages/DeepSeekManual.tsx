import { useState } from 'react'
import Chat, { Message } from '../components/Chat'

function DeepSeekManual() {
	const [messages, setMessages] = useState<Message[]>([])
	const [isLoading, setIsLoading] = useState(false)

	const handleSendMessage = async (content: string) => {
		// Add user message
		const userMessage: Message = {
			id: Date.now().toString(),
			content,
			sender: 'user',
			timestamp: new Date(),
		}
		setMessages((prev) => [...prev, userMessage])
		setIsLoading(true)

		// Mock AI response (simulate API call)
		setTimeout(() => {
			const aiMessage: Message = {
				id: (Date.now() + 1).toString(),
				content: `This is a mock response to: "${content}"`,
				sender: 'ai',
				timestamp: new Date(),
			}
			setMessages((prev) => [...prev, aiMessage])
			setIsLoading(false)
		}, 1000)
	}

	return (
		<div className="min-h-screen bg-base-200">
			<div className="container mx-auto max-w-4xl p-4">
				<Chat
					messages={messages}
					onSendMessage={handleSendMessage}
					isLoading={isLoading}
					title="Chat with DeepSeek AI"
				/>
			</div>
		</div>
	)
}

export default DeepSeekManual
