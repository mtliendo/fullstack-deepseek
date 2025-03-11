import { Context } from '@aws-appsync/utils'
import { Schema } from '../../data/resource'
import { env } from '$amplify/env/bedrock-to-deepseek-stream'
import { events } from 'aws-amplify/data'
import { Amplify } from 'aws-amplify'
import {
	BedrockRuntimeClient,
	ContentBlock,
	ConversationRole,
	ConverseStreamCommand,
} from '@aws-sdk/client-bedrock-runtime'
const client = new BedrockRuntimeClient()

Amplify.configure(
	{
		API: {
			Events: {
				endpoint: env.EVENT_API_URL,
				region: env.EVENT_API_REGION,
				defaultAuthMode: 'iam',
			},
		},
	},
	{
		Auth: {
			credentialsProvider: {
				getCredentialsAndIdentityId: async () => ({
					credentials: {
						accessKeyId: env.AWS_ACCESS_KEY_ID,
						secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
						sessionToken: env.AWS_SESSION_TOKEN,
					},
				}),
				clearCredentialsAndIdentityId: () => {},
			},
		},
	}
)

export const handler = async (
	context: Context<Schema['bedrockToDeepSeekStream']['args']>
): Promise<Schema['bedrockToDeepSeekStream']['returnType']> => {
	console.log('context', context)
	const systemTraits = `You're a helpful assistant that can answer questions and help with general tasks. Always return your responses as a string of structured markdown.`

	try {
		const command = new ConverseStreamCommand({
			modelId: env.MODEL_ID,
			system: [{ text: systemTraits }],
			messages: [
				{
					role: 'user' as ConversationRole,
					content: [
						{
							text: context.arguments.text,
						} as ContentBlock.TextMember,
					],
				},
			],
		})

		const response = await client.send(command)

		if (response.stream) {
			for await (const chunk of response.stream) {
				console.log('chunk', chunk)
				if (chunk.contentBlockDelta?.delta?.text) {
					try {
						await events.post(
							`${env.EVENT_API_NAMESPACE}`,
							{
								chunk: chunk.contentBlockDelta.delta.text,
							},
							{ authMode: 'iam' }
						)
					} catch (error) {
						console.error('Error trying to post to event API:', error)
					}
				}
			}

			return { success: true }
		}
	} catch (error) {
		console.error('Error sending request to Bedrock:', error)
	}
	return { success: false }
}
