import {
	CircularProgress,
	Container,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from '@mui/material'
import Dashboard from '../components/UI/Dashboard'
import NewsItem from '../components/NewsItem/NewsItem'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import {
	AppDispatch,
	setPageTopNews,
	setTopNewsPerPage,
} from '../slices/newsSlice'
import { RootState } from '../types'
import { sortNewsByDate } from '../utils/sortNewsByDate'
import PaginationComponent from '../components/UI/PaginationComponent'
import { paginateNews } from '../utils/paginationUtils'

const TopNews = () => {
	const { newsList, status, error, totalPages, pageTopNews, topNewsPerPage } =
		useSelector((state: RootState) => state.news)
	const dispatch = useDispatch<AppDispatch>()
	const [sortOrder, setSortOrder] = useState('newest')

	useEffect(() => {
		paginateNews(dispatch, pageTopNews, topNewsPerPage, true)
	}, [pageTopNews, topNewsPerPage, dispatch])

	const paginate = (pageNumber: number) => {
		dispatch(setPageTopNews(pageNumber))
	}

	const loadNewsPerPage = (countNews: number) => {
		dispatch(setTopNewsPerPage(countNews))
	}

	return (
		<Dashboard pageTitle='Топ Новости'>
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
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
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
											<FormControl margin='normal' sx={{ width: '170px' }}>
												<InputLabel id='sortOrderLabel' sx={{ top: '-10px' }}>
													Новостей на странице
												</InputLabel>
												<Select
													labelId='newsPerPage'
													id='newsPerPage'
													value={topNewsPerPage}
													onChange={e => loadNewsPerPage(+e.target.value)}
												>
													<MenuItem value='3'>3</MenuItem>
													<MenuItem value='6'>6</MenuItem>
													<MenuItem value='9'>9</MenuItem>
												</Select>
											</FormControl>
										</div>
										<Grid container spacing={4}>
											{newsList
												.slice()
												.sort((a, b) => sortNewsByDate(a, b, sortOrder))
												.map((news, index) => (
													<NewsItem key={index} data={news} />
												))}
										</Grid>
										<PaginationComponent
											newsPerPage={topNewsPerPage}
											totalNews={newsList.length}
											totalPages={totalPages}
											paginate={paginate}
											currentPage={pageTopNews}
										/>
									</>
								) : (
									<Typography variant='h4' align='center' color='primary'>
										Создайте Топ новость!
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

export default TopNews
