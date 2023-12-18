import { BrowserRouter, Route, Routes } from 'react-router-dom'
import News from './pages/News'
import TopNews from './pages/TopNews'
import PageNotFound from './pages/PageNotFound'

const App = () => {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route index element={<News />} />
					<Route path='/top-news' element={<TopNews />} />
					<Route path='*' element={<PageNotFound />} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
