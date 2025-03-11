import { useState, FormEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

export interface Message {
	id: string
	content: string
	sender: 'user' | 'ai'
	timestamp: Date
}

interface StreamingChatProps {
	messages: Message[]
	onSendMessage: (message: string) => Promise<void>
	isLoading: boolean
	streamingContent: string
	title?: string
}

function StreamingChat({
	messages,
	onSendMessage,
	isLoading,
	streamingContent,
	title = 'Chat',
}: StreamingChatProps) {
	const [inputMessage, setInputMessage] = useState('')

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		if (!inputMessage.trim()) return

		await onSendMessage(inputMessage)
		setInputMessage('')
	}

	// Combine regular messages with streaming content if present
	const displayMessages = [...messages]
	if (streamingContent) {
		displayMessages.push({
			id: 'streaming',
			content: streamingContent,
			sender: 'ai',
			timestamp: new Date(),
		})
	}

	return (
		<div className="card bg-base-100 shadow-xl">
			<div className="card-body">
				<h2 className="card-title mb-4">{title}</h2>

				{/* Messages container */}
				<div className="h-[60vh] overflow-y-auto mb-4 space-y-4">
					{displayMessages.map((message) => (
						<div
							key={message.id}
							className={`chat ${
								message.sender === 'user' ? 'chat-end' : 'chat-start'
							}`}
						>
							<div className="chat-header">
								{message.sender === 'user' ? 'You' : 'DeepSeek AI'}
							</div>
							<div
								className={`chat-bubble ${
									message.sender === 'user'
										? 'chat-bubble-primary'
										: 'chat-bubble-secondary'
								}`}
							>
								<ReactMarkdown rehypePlugins={[rehypeHighlight]}>
									{message.content}
								</ReactMarkdown>
							</div>
							<div className="chat-footer opacity-50">
								{message.timestamp.toLocaleTimeString()}
							</div>
						</div>
					))}
					{isLoading && !streamingContent && (
						<div className="chat chat-start">
							<div className="chat-bubble chat-bubble-secondary">
								<span className="loading loading-dots loading-sm"></span>
							</div>
						</div>
					)}
				</div>

				{/* Input form */}
				<form onSubmit={handleSubmit} className="flex gap-2">
					<input
						type="text"
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						placeholder="Type your message here..."
						className="input input-bordered flex-1"
						disabled={isLoading}
					/>
					<button
						type="submit"
						className="btn btn-primary"
						disabled={isLoading || !inputMessage.trim()}
					>
						Send
					</button>
				</form>
			</div>
		</div>
	)
}

export default StreamingChat
