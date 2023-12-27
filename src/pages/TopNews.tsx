import { CircularProgress, Container, Grid, Typography } from '@mui/material'
import Dashboard from '../components/UI/Dashboard'
import NewsItem from '../components/NewsItem/NewsItem'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { AppDispatch, fetchNews } from '../slices/newsSlice'
import { RootState } from '../types'

const TopNews = () => {
	const { newsList, status, error } = useSelector(
		(state: RootState) => state.news
	)
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		if (status === 'idle') {
			dispatch(fetchNews())
		}
	}, [status, dispatch])
	const topNewsList = newsList.filter(news => news.isTop)

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
								{' '}
								{topNewsList.length ? (
									<Grid container spacing={4}>
										{topNewsList.map((news, index) => (
											<NewsItem key={index} data={news} />
										))}
									</Grid>
								) : (
									<Typography variant='h4' align='center' color='primary'>
										Создайте Топ новость!
									</Typography>
								)}{' '}
							</>
						)}
					</>
				)}
			</Container>
		</Dashboard>
	)
}

export default TopNews
