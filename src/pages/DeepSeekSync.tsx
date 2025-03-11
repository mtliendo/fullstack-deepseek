import { useState } from 'react'
import Chat, { Message } from '../components/Chat'
import { generateClient } from '@aws-amplify/api'
import { Schema } from '../../amplify/data/resource'

function stripMarkdownFence(text: string) {
	return text.replace(/^\s*```(?:markdown|md)\n?([\s\S]*?)\n?```$/, '$1')
}

const client = generateClient<Schema>()

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

		const response = await client.queries.bedrockToDeepSeekSync({
			text: content,
		})
		console.log('response', response)
		const strippedResponse = stripMarkdownFence(response.data!)
		console.log('strippedResponse', strippedResponse)
		setIsLoading(false)
		setMessages((prev) => [
			...prev,
			{
				id: Date.now().toString(),
				content: strippedResponse,
				sender: 'ai',
				timestamp: new Date(),
			},
		])
	}

	return (
		<div className="min-h-screen bg-base-200">
			<div className="container mx-auto max-w-4xl p-4">
				<Chat
					messages={messages}
					onSendMessage={handleSendMessage}
					isLoading={isLoading}
					title="Chat with DeepSeek AI (Sync)"
				/>
			</div>
		</div>
	)
}

export default DeepSeekManual
