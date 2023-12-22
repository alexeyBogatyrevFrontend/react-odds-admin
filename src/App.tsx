import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import News from './pages/News'
import TopNews from './pages/TopNews'
import PageNotFound from './pages/PageNotFound'
import CreateNews from './pages/CreateNews'

const App = () => {
	return (
		<>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<BrowserRouter>
					<Routes>
						<Route index element={<CreateNews />} />
						<Route path='/news' element={<News />} />
						<Route path='/top-news' element={<TopNews />} />
						<Route path='*' element={<PageNotFound />} />
					</Routes>
				</BrowserRouter>
			</LocalizationProvider>
		</>
	)
}

export default App
