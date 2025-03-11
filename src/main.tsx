// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import Home from './pages/Home.tsx'
import Navbar from './components/Navbar.tsx'
import Footer from './components/Footer.tsx'
import DeepSeekSync from './pages/DeepSeekSync.tsx'
import DeepSeekStreaming from './pages/DeepSeekStreaming.tsx'
import { ConfigureAmplify } from './components/ConfigureAmplify.tsx'
import Protect from './components/Protect.tsx'
import { Authenticator } from '@aws-amplify/ui-react'

createRoot(document.getElementById('root')!).render(
	<>
		<ConfigureAmplify />
		<Authenticator.Provider>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route
						path="/deepseek-sync"
						element={<Protect component={<DeepSeekSync />} />}
					/>
					<Route
						path="/deepseek-streaming"
						element={<Protect component={<DeepSeekStreaming />} />}
					/>
				</Routes>
				<Footer />
			</BrowserRouter>
		</Authenticator.Provider>
	</>
)
