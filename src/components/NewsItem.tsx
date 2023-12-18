import { FC, useState, ChangeEvent } from 'react'
import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Grid,
	Typography,
	TextField,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { deleteNews, editNews } from '../slices/newsSlice'
import { newsType } from './NewsForm'
import { deleteTopNews, editTopNews } from '../slices/topNewsSlice'

type NewsItemProps = {
	data: newsType
}

const NewsItem: FC<NewsItemProps> = ({ data }) => {
	const dispatch = useDispatch()
	const [editMode, setEditMode] = useState(false)
	const [editedData, setEditedData] = useState({ ...data })

	const deleteHandler = () => {
		if (data.isTop) {
			dispatch(deleteTopNews(data.id))
		} else {
			dispatch(deleteNews(data.id))
		}
	}

	const editHandler = () => {
		setEditMode(true)
	}

	const saveHandler = () => {
		if (data.isTop) {
			dispatch(editTopNews(editedData))
		} else {
			dispatch(editNews(editedData))
		}
		setEditMode(false)
	}

	const cancelHandler = () => {
		setEditedData({ ...data })
		setEditMode(false)
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setEditedData(prev => ({ ...prev, [name]: value }))
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
					{editMode ? (
						<>
							<TextField
								fullWidth
								label='Заголовок'
								variant='outlined'
								margin='normal'
								name='title'
								value={editedData.title}
								onChange={handleChange}
							/>
							<TextField
								fullWidth
								label='Описание'
								variant='outlined'
								multiline
								rows={4}
								margin='normal'
								name='description'
								value={editedData.description}
								onChange={handleChange}
							/>
						</>
					) : (
						<>
							<Typography gutterBottom variant='h5' component='h2'>
								{data.title}
							</Typography>
							<Typography>{data.description}</Typography>
						</>
					)}
				</CardContent>
				<CardActions>
					{editMode ? (
						<>
							<Button size='small' color='success' onClick={saveHandler}>
								Сохранить
							</Button>
							<Button size='small' color='error' onClick={cancelHandler}>
								Отменить
							</Button>
						</>
					) : (
						<>
							<Button size='small' color='success' onClick={editHandler}>
								Редактировать
							</Button>
							<Button size='small' color='error' onClick={deleteHandler}>
								Удалить
							</Button>
						</>
					)}
				</CardActions>
			</Card>
		</Grid>
	)
}

export default NewsItem
