import { useState, useEffect } from 'react'
import { Message } from '../components/StreamingChat'
import StreamingChat from '../components/StreamingChat'
import { events, EventsChannel, generateClient } from '@aws-amplify/api'
import { Schema } from '../../amplify/data/resource'

function stripMarkdownFence(text: string) {
	return text.replace(/^\s*```(?:markdown|md)\n?([\s\S]*?)\n?```$/, '$1')
}

const client = generateClient<Schema>()

function DeepSeekStreaming() {
	const [messages, setMessages] = useState<Message[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [streamingContent, setStreamingContent] = useState('')
	const [isStreamingComplete, setIsStreamingComplete] = useState(false)

	useEffect(() => {
		let channel: EventsChannel
		const setupSubscription = async () => {
			channel = await events.connect('deepseek/')

			channel.subscribe({
				next: (data) => {
					console.log('Data: ', data)
					setStreamingContent(
						(prev) => prev + stripMarkdownFence(data.event.chunk)
					)
					// Check if this is the last chunk (you might need to adjust this based on your actual event data)
					if (data.event.isComplete) {
						setIsStreamingComplete(true)
						setIsLoading(false)
					}
				},
				error: (err) => {
					console.error(err)
					setIsLoading(false)
				},
			})
		}

		setupSubscription()

		return () => channel?.close()
	}, [])

	const handleSendMessage = async (content: string) => {
		// Reset states for new message
		setStreamingContent('')
		setIsStreamingComplete(false)
		setIsLoading(true)

		// Add user message
		const userMessage: Message = {
			id: Date.now().toString(),
			content,
			sender: 'user',
			timestamp: new Date(),
		}
		setMessages((prev) => [...prev, userMessage])

		try {
			await client.queries.bedrockToDeepSeekStream({
				text: content,
			})
		} catch (error) {
			console.error('Error sending message:', error)
			setIsLoading(false)
		}
	}

	// Effect to handle streaming completion
	useEffect(() => {
		if (isStreamingComplete && streamingContent) {
			setMessages((prev) => [
				...prev,
				{
					id: Date.now().toString(),
					content: streamingContent,
					sender: 'ai',
					timestamp: new Date(),
				},
			])
			setStreamingContent('')
		}
	}, [isStreamingComplete, streamingContent])

	return (
		<div className="min-h-screen bg-base-200">
			<div className="container mx-auto max-w-4xl p-4">
				<StreamingChat
					messages={messages}
					onSendMessage={handleSendMessage}
					isLoading={isLoading}
					streamingContent={streamingContent}
					title="Chat with DeepSeek AI (Streaming)"
				/>
			</div>
		</div>
	)
}

export default DeepSeekStreaming
