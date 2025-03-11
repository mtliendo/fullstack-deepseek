import { Context } from '@aws-appsync/utils'
import { Schema } from '../../data/resource'
import { env } from '$amplify/env/bedrock-to-deepseek-sync'
import {
	BedrockRuntimeClient,
	ContentBlock,
	ConversationRole,
	ConverseCommand,
} from '@aws-sdk/client-bedrock-runtime'
const client = new BedrockRuntimeClient()

export const handler = async (
	context: Context<Schema['bedrockToDeepSeekSync']['args']>
): Promise<Schema['bedrockToDeepSeekSync']['returnType']> => {
	console.log('context', context)
	const systemTraits = `You're a helpful assistant that can answer questions and help with general tasks. Always return your responses as a string of structured markdown.`

	try {
		const command = new ConverseCommand({
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

		if (response.output?.message?.content?.[0]?.text) {
			return response.output.message.content[0].text
		}
	} catch (error) {
		console.error('Error:', error)
	}
	return null
}
