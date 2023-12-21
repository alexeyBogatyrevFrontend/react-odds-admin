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
	Modal,
	Box,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { deleteNews, editNews } from '../../slices/newsSlice'
import { formats, modules, newsType } from '../NewsForm'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import ReactQuill from 'react-quill'

import styles from './NewsItem.module.css'

type NewsItemProps = {
	data: newsType
}

const NewsItem: FC<NewsItemProps> = ({ data }) => {
	const dispatch = useDispatch()
	const [editMode, setEditMode] = useState(false)
	const [editedData, setEditedData] = useState({ ...data })

	const handleClose = () => {
		setEditedData({ ...data })
		setEditMode(false)
	}

	const deleteHandler = () => {
		dispatch(deleteNews(data.id))
	}

	const editHandler = () => {
		setEditMode(true)
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setEditedData(prev => ({ ...prev, [name]: value }))
	}

	const handleChangeTextEditor = (content: string) => {
		setEditedData(prev => ({ ...prev, textEditor: content }))
	}

	const saveHandler = () => {
		dispatch(editNews(editedData))
		setEditMode(false)
	}

	return (
		<>
			<Grid item xs={12} sm={6} md={4}>
				<Card
					sx={{
						minWidth: 265,
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						position: 'relative',
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
					{data.isTop && (
						<div className={styles.fire} title='Это топ новость'>
							<LocalFireDepartmentIcon sx={{ color: '#ff0000' }} />
						</div>
					)}
					<CardContent sx={{ flexGrow: 1 }}>
						<Typography gutterBottom variant='h5' component='h2'>
							{data.title}
						</Typography>
						<Typography>{data.description}</Typography>
					</CardContent>
					<CardActions>
						<Button size='small' color='success' onClick={editHandler}>
							Редактировать
						</Button>
						<Button size='small' color='error' onClick={deleteHandler}>
							Удалить
						</Button>
					</CardActions>
				</Card>
			</Grid>

			{/* Modal for editing */}
			<Modal open={editMode} onClose={handleClose}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 800,
						bgcolor: 'background.paper',
						boxShadow: 24,
						p: 4,
						borderRadius: 4,
						display: 'flex',
						flexDirection: 'column',
						maxHeight: '90%',
						overflowY: 'auto',
					}}
				>
					<Typography variant='h6' gutterBottom>
						Редактирование
					</Typography>
					<div style={{ display: 'flex', gap: 30 }}>
						<div style={{ width: '30%' }}>
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
						</div>
						<div style={{ width: '70%' }}>
							<ReactQuill
								theme='snow'
								modules={modules}
								formats={formats}
								value={editedData.textEditor}
								onChange={handleChangeTextEditor}
								placeholder='Контент для страницы'
							/>
						</div>
					</div>
					<Box mt={2} display='flex' justifyContent='space-between'>
						<Button variant='contained' color='success' onClick={saveHandler}>
							Сохранить
						</Button>
						<Button variant='contained' color='error' onClick={handleClose}>
							Отменить
						</Button>
					</Box>
				</Box>
			</Modal>
		</>
	)
}

export default NewsItem