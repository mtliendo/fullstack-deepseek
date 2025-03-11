import { Authenticator } from '@aws-amplify/ui-react'

function Protect({ component }: { component: React.ReactNode }) {
	//center the component
	return <Authenticator className="mt-16">{component}</Authenticator>
}

export default Protect
