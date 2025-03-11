import { Link } from 'react-router'

function Home() {
	return (
		<>
			<div className="hero bg-base-200 min-h-screen">
				<div className="hero-content text-center">
					<div className="max-w-md">
						<h1 className="text-5xl font-bold">Fullstack DeepSeek</h1>
						<p className="py-6">
							Fullstack DeepSeek application built with React, and AWS Amplify.
						</p>
						<div className="flex flex-col gap-4">
							<Link to="/deepseek-sync" className="btn btn-primary">
								Get Started with DeepSeek Sync
							</Link>
							<Link to="/deepseek-streaming" className="btn btn-secondary">
								Get Started with DeepSeek Streaming
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Home
