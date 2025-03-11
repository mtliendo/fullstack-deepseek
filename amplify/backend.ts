import { bedrockToDeepSeek } from './functions/bedrockToDeepSeek/resource'
import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
	auth,
	data,
	bedrockToDeepSeek,
})

backend.bedrockToDeepSeek.resources.lambda.addToRolePolicy(
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
