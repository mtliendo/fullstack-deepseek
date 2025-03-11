import { Link } from 'react-router'
import ThemeController from './ThemeController'
function Navbar() {
	return (
		<div className="navbar bg-base-200 shadow-sm w-full">
			<div className="navbar-start">
				<Link to="/" className="btn btn-ghost text-xl">
					Fullstack DeepSeek
				</Link>
			</div>

			<div className="navbar-end">
				<div className="flex flex-row gap-2">
					<a className="btn btn-primary">Login</a>
					<ThemeController />
				</div>
			</div>
		</div>
	)
}

export default Navbar
