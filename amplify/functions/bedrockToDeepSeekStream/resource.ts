import { defineFunction } from '@aws-amplify/backend'

export const bedrockToDeepSeekStream = defineFunction({
	name: 'bedrock-to-deepseek-stream',
	resourceGroupName: 'data',
	entry: './main.ts',
	timeoutSeconds: 29,
	runtime: 22,
	environment: {
		MODEL_ID: 'us.deepseek.r1-v1:0',
	},
})
