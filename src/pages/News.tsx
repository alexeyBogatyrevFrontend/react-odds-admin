import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dashboard from '../components/UI/Dashboard'
import NewsItem from '../components/NewsItem/NewsItem'
import {
	CircularProgress,
	Container,
	Grid,
	Typography,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
} from '@mui/material'
import { AppDispatch, fetchNews } from '../slices/newsSlice'
import { RootState } from '../types'
import { sortNewsByDate } from '../utils/sortNewsByDate'
import PaginationComponent from '../components/UI/PaginationComponent'

const News = () => {
	const { newsList, status, error, totalPages } = useSelector(
		(state: RootState) => state.news
	)
	const dispatch = useDispatch<AppDispatch>()

	const [sortOrder, setSortOrder] = useState('newest')
	const [currentPage, setCurrentPage] = useState(1)
	const newsPerPage = 6

	// const indexOfLastNews = currentPage * newsPerPage
	// const indexOfFirstNews = indexOfLastNews - newsPerPage
	// const currentNews = newsList.slice(indexOfFirstNews, indexOfLastNews)

	useEffect(() => {
		// if (status === 'idle') {
		// 	dispatch(fetchNews({ page: currentPage, pageSize: newsPerPage }))
		// }
		dispatch(fetchNews({ page: currentPage, pageSize: newsPerPage }))
	}, [])

	const paginate = (pageNumber: number) => {
		setCurrentPage(pageNumber)
		dispatch(fetchNews({ page: pageNumber, pageSize: newsPerPage }))
	}

	return (
		<Dashboard pageTitle='Новости'>
			<Container maxWidth='md'>
				{status === 'failed' ? (
					<p>Error: {error}</p>
				) : (
					<>
						{status === 'loading' ? (
							<CircularProgress
								sx={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
								}}
							/>
						) : (
							<>
								{newsList.length ? (
									<>
										<FormControl margin='normal'>
											<InputLabel id='sortOrderLabel' sx={{ top: '-10px' }}>
												Сортировка
											</InputLabel>
											<Select
												labelId='sortOrderLabel'
												id='sortOrder'
												value={sortOrder}
												onChange={e => setSortOrder(e.target.value)}
											>
												<MenuItem value='newest'>Сначала новые</MenuItem>
												<MenuItem value='oldest'>Сначала старые</MenuItem>
											</Select>
										</FormControl>
										<Grid container spacing={4}>
											{newsList
												.slice()
												.sort((a, b) => sortNewsByDate(a, b, sortOrder))
												.map((news, index) => (
													<NewsItem key={index} data={news} />
												))}
										</Grid>

										<PaginationComponent
											newsPerPage={newsPerPage}
											totalNews={newsList.length}
											totalPages={totalPages}
											paginate={paginate}
											currentPage={currentPage}
										/>
									</>
								) : (
									<Typography variant='h4' align='center' color='primary'>
										Создайте новость!
									</Typography>
								)}
							</>
						)}
					</>
				)}
			</Container>
		</Dashboard>
	)
}

export default News
