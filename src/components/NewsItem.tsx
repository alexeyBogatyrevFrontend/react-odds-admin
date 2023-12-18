import { FC } from 'react'
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
import { newsType } from './NewsForm'
import { deleteTopNews } from '../slices/topNewsSlice'

type NewsItemProps = {
	data: newsType
}

const NewsItem: FC<NewsItemProps> = ({ data }) => {
	const dispatch = useDispatch()

	const deleteHandler = () => {
		if (data.isTop) {
			dispatch(deleteTopNews(data.id))
		} else {
			dispatch(deleteNews(data.id))
		}
	}

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
				{data.image && (
					<CardMedia
						component='div'
						sx={{
							// 16:9
							pt: '56.25%',
						}}
						image={
							data.image instanceof File
								? URL.createObjectURL(data.image)
								: data.image
						}
					/>
				)}
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
					<Button size='small' color='error' onClick={deleteHandler}>
						Delete
					</Button>
				</CardActions>
			</Card>
		</Grid>
	)
}

export default NewsItem
