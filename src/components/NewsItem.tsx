import { FC } from 'react'
import { newsType } from './NewsForm'
import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Grid,
	Typography,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { deleteNews } from '../slices/newsSlice'

type NewsItemProps = {
	data: newsType
}

const NewsItem: FC<NewsItemProps> = ({ data }) => {
	const dispatch = useDispatch()

	return (
		<Grid item xs={12} sm={6} md={4}>
			<Card
				sx={{
					minWidth: 265,
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<CardMedia
					component='div'
					sx={{
						// 16:9
						pt: '56.25%',
					}}
					image={data.image}
				/>
				<CardContent sx={{ flexGrow: 1 }}>
					<Typography gutterBottom variant='h5' component='h2'>
						{data.title}
					</Typography>
					<Typography>{data.description}</Typography>
				</CardContent>
				<CardActions>
					<Button size='small' color='success'>
						Edit
					</Button>
					<Button
						size='small'
						color='error'
						onClick={() => dispatch(deleteNews(data.id))}
					>
						Delete
					</Button>
				</CardActions>
			</Card>
		</Grid>
	)
}

export default NewsItem
