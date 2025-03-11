import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
import { bedrockToDeepSeekSync } from '../functions/bedrockToDeepSeekSync/resource'
import { bedrockToDeepSeekStream } from '../functions/bedrockToDeepSeekStream/resource'
const schema = a.schema({
	bedrockToDeepSeekSync: a
		.query()
		.arguments({ text: a.string() })
		.returns(a.string())
		.handler(a.handler.function(bedrockToDeepSeekSync))
		.authorization((allow) => [allow.authenticated()]),
	bedrockToDeepSeekStream: a
		.query()
		.arguments({ text: a.string() })
		.handler(a.handler.function(bedrockToDeepSeekStream).async())
		.authorization((allow) => [allow.authenticated()]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
	name: 'bedrockToDeepSeekAPI',
	schema,
	authorizationModes: {
		defaultAuthorizationMode: 'userPool',
		apiKeyAuthorizationMode: {
			expiresInDays: 14,
		},
	},
})
