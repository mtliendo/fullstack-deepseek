import { Link } from 'react-router'
import ThemeController from './ThemeController'
import { useAuthenticator } from '@aws-amplify/ui-react'
function Navbar() {
	const { user, signOut } = useAuthenticator((context) => [
		context.user,
		context.signOut,
	])
	return (
		<div className="navbar bg-base-200 shadow-sm w-full">
			<div className="navbar-start">
				<Link to="/" className="btn btn-ghost text-xl">
					Fullstack DeepSeek
				</Link>
			</div>

			<div className="navbar-end">
				<div className="flex flex-row gap-2">
					{user ? (
						<button className="btn btn-primary" onClick={signOut}>
							Logout
						</button>
					) : (
						<a className="btn btn-primary">Login</a>
					)}
					<ThemeController />
				</div>
			</div>
		</div>
	)
}

export default Navbar
