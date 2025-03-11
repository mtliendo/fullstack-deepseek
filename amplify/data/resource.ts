import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
import { bedrockToDeepSeek } from '../functions/bedrockToDeepSeek/resource'

const schema = a.schema({
	bedrockToDeepSeek: a
		.query()
		.arguments({ text: a.string() })
		.returns(a.string())
		.handler(a.handler.function(bedrockToDeepSeek))
		.authorization((allow) => [allow.guest(), allow.publicApiKey()]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
	name: 'bedrockToDeepSeekAPI',
	schema,
	authorizationModes: {
		defaultAuthorizationMode: 'iam',
		apiKeyAuthorizationMode: {
			expiresInDays: 14,
		},
	},
})
