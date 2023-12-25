import { useDispatch, useSelector } from 'react-redux'
import Dashboard from '../components/UI/Dashboard'
import { newsType } from '../components/NewsForm'
import NewsItem from '../components/NewsItem/NewsItem'
import { CircularProgress, Container, Grid, Typography } from '@mui/material'
import { useEffect } from 'react'
import { fetchNews } from '../slices/newsSlice'

type RootState = {
	news: {
		newsList: newsType[]
		status: string
		error: string
	}
}

const News = () => {
	const { newsList, status, error } = useSelector(
		(state: RootState) => state.news
	)
	const dispatch = useDispatch()

	useEffect(() => {
		if (status === 'idle') {
			dispatch(fetchNews())
		}
	}, [status, dispatch])

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
								{' '}
								{newsList.length ? (
									<Grid container spacing={4}>
										{newsList.map((news, index) => (
											<NewsItem key={index} data={news} />
										))}
									</Grid>
								) : (
									<Typography variant='h4' align='center' color='primary'>
										Создайте новость!
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

export default News
