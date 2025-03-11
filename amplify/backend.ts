import { bedrockToDeepSeekSync } from './functions/bedrockToDeepSeekSync/resource'
import { bedrockToDeepSeekStream } from './functions/bedrockToDeepSeekStream/resource'
import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import {
	AppSyncAuthorizationType,
	ChannelNamespace,
	EventApi,
} from 'aws-cdk-lib/aws-appsync'

const backend = defineBackend({
	auth,
	data,
	bedrockToDeepSeekSync,
	bedrockToDeepSeekStream,
})

backend.bedrockToDeepSeekSync.resources.lambda.addToRolePolicy(
	new PolicyStatement({
		actions: ['bedrock:InvokeModel'],
		resources: [
			`arn:aws:bedrock:us-east-1:${backend.stack.account}:inference-profile/us.deepseek.r1-v1:0`,
			'arn:aws:bedrock:us-east-1::foundation-model/deepseek.r1-v1:0',
			'arn:aws:bedrock:us-east-2::foundation-model/deepseek.r1-v1:0',
			'arn:aws:bedrock:us-west-2::foundation-model/deepseek.r1-v1:0',
		],
	})
)

backend.bedrockToDeepSeekStream.resources.lambda.addToRolePolicy(
	new PolicyStatement({
		actions: ['bedrock:InvokeModelWithResponseStream'],
		resources: [
			`arn:aws:bedrock:us-east-1:${backend.stack.account}:inference-profile/us.deepseek.r1-v1:0`,
			'arn:aws:bedrock:us-east-1::foundation-model/deepseek.r1-v1:0',
			'arn:aws:bedrock:us-east-2::foundation-model/deepseek.r1-v1:0',
			'arn:aws:bedrock:us-west-2::foundation-model/deepseek.r1-v1:0',
		],
	})
)

const eventAPI = new EventApi(backend.stack, 'EventAPI', {
	apiName: 'DeepSeekStreamingEventAPI',
	authorizationConfig: {
		defaultPublishAuthModeTypes: [AppSyncAuthorizationType.IAM],
		defaultSubscribeAuthModeTypes: [AppSyncAuthorizationType.USER_POOL],
		authProviders: [
			{ authorizationType: AppSyncAuthorizationType.IAM },
			{
				authorizationType: AppSyncAuthorizationType.USER_POOL,
				cognitoConfig: {
					userPool: backend.auth.resources.userPool,
				},
			},
		],
	},
})

eventAPI.grantPublish(backend.bedrockToDeepSeekStream.resources.lambda)
new ChannelNamespace(backend.stack, 'DeepSeekStreamingNamespace', {
	api: eventAPI,
	channelNamespaceName: 'deepseek',
})

backend.bedrockToDeepSeekStream.addEnvironment(
	'EVENT_API_URL',
	`https://${eventAPI.httpDns}/event`
)

backend.bedrockToDeepSeekStream.addEnvironment(
	'EVENT_API_REGION',
	backend.stack.region
)
backend.bedrockToDeepSeekStream.addEnvironment(
	'EVENT_API_NAMESPACE',
	'deepseek'
)

backend.addOutput({
	custom: {
		events: {
			url: `https://${eventAPI.httpDns}/event`,
			aws_region: backend.stack.region,
			default_authorization_type: AppSyncAuthorizationType.USER_POOL,
		},
	},
})
