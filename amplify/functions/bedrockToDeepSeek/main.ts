import { Context } from '@aws-appsync/utils'
import { Schema } from '../../data/resource'
import { env } from '$amplify/env/bedrock-to-deepseek'
import {
	BedrockRuntimeClient,
	ContentBlock,
	ConversationRole,
	ConverseCommand,
} from '@aws-sdk/client-bedrock-runtime'
const client = new BedrockRuntimeClient()

export const handler = async (
	context: Context<Schema['bedrockToDeepSeek']['args']>
): Promise<Schema['bedrockToDeepSeek']['returnType']> => {
	console.log('context', context)
	const systemTraits = `You're a helpful assistant that can answer questions and help with tasks.`

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

		if (response.output?.message?.content) {
			const msg = response.output.message.content[0].text ?? ''

			return msg
		}
	} catch (error) {
		console.error('Error:', error)
	}
	return ''
}
