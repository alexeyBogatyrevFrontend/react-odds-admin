import { Container, Grid, Typography } from '@mui/material'
import Dashboard from '../components/UI/Dashboard'
import NewsItem from '../components/NewsItem'
import { useSelector } from 'react-redux'
import { newsType } from '../components/NewsForm'

type RootState = {
	topNews: {
		topNewsList: newsType[]
	}
}

const TopNews = () => {
	const { topNewsList } = useSelector((state: RootState) => state.topNews)

	return (
		<Dashboard pageTitle='Топ новости'>
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
