import { Container, Grid, Typography } from '@mui/material'
import Dashboard from '../components/UI/Dashboard'
import NewsItem from '../components/NewsItem/NewsItem'
import { useSelector } from 'react-redux'
import { newsType } from '../components/NewsForm'

// type RootState = {
// 	topNews: {
// 		topNewsList: newsType[]
// 	}
// }
type RootState = {
	news: {
		newsList: newsType[]
	}
}

const TopNews = () => {
	const { newsList } = useSelector((state: RootState) => state.news)

	const topNewsList = newsList.filter(news => news.isTop)

	return (
		<Dashboard pageTitle='Новости'>
			<Container maxWidth='md'>
				{topNewsList.length ? (
					<Grid container spacing={4}>
						{topNewsList.map((news, index) => (
							<NewsItem key={index} data={news} />
						))}
					</Grid>
				) : (
					<Typography variant='h4' align='center' color='primary'>
						Создайте топ новость!
					</Typography>
				)}
			</Container>
		</Dashboard>
	)
}

export default TopNews
