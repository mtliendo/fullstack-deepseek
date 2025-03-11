import { Authenticator } from '@aws-amplify/ui-react'

function Protect({ component }: { component: React.ReactNode }) {
	//center the component
	return (
		<div className="mt-16 ">
			<Authenticator>{component}</Authenticator>
		</div>
	)
}

export default Protect
