import { useSelector } from 'react-redux'
import Dashboard from '../components/UI/Dashboard'
import { newsType } from '../components/NewsForm'
import NewsItem from '../components/NewsItem/NewsItem'
import { Container, Grid, Typography } from '@mui/material'

type RootState = {
	news: {
		newsList: newsType[]
	}
}

const News = () => {
	const { newsList } = useSelector((state: RootState) => state.news)

	return (
		<Dashboard pageTitle='Новости'>
			<Container maxWidth='md'>
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
				)}
			</Container>
		</Dashboard>
	)
}

export default News
