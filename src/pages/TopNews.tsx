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
import { AppDispatch, fetchTopNews } from '../slices/newsSlice'
import { RootState } from '../types'
import { sortNewsByDate } from '../utils/sortNewsByDate'

const TopNews = () => {
	const { newsList, status, error } = useSelector(
		(state: RootState) => state.news
	)
	const dispatch = useDispatch<AppDispatch>()
	const [sortOrder, setSortOrder] = useState('newest')

	useEffect(() => {
		// if (status === 'idle') {
		// 	dispatch(fetchTopNews())
		// }
		dispatch(fetchTopNews())
	}, [])

	// const topNewsList = newsList.filter(news => news.isTop)

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
								{newsList.length ? (
									<Grid container spacing={4}>
										{newsList
											.slice()
											.sort((a, b) => sortNewsByDate(a, b, sortOrder))
											.map((news, index) => (
												<NewsItem key={index} data={news} />
											))}
									</Grid>
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
