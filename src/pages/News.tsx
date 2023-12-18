import { useSelector } from 'react-redux'
import Dashboard from '../components/UI/Dashboard'
import { newsType } from '../components/NewsForm'
import NewsItem from '../components/NewsItem'
import Title from '../components/UI/Title'
import { Container, Grid } from '@mui/material'

type RootState = {
	news: {
		newsList: newsType[]
	}
}

const News = () => {
	const { newsList } = useSelector((state: RootState) => state.news)

	return (
		<Dashboard pageTitle='Новости'>
			<Container sx={{ py: 8 }} maxWidth='md'>
				<Grid container spacing={4}>
					{newsList.length ? (
						newsList.map((news, index) => <NewsItem key={index} data={news} />)
					) : (
						<Title>Создайте новость!</Title>
					)}
				</Grid>
			</Container>
		</Dashboard>
	)
}

export default News
