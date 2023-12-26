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
	FormControlLabel,
	Switch,
	FormControl,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { deleteNews, editNews } from '../../slices/newsSlice'
import { formats, modules, newsType } from '../NewsForm'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import ReactQuill from 'react-quill'

import styles from './NewsItem.module.css'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'

type NewsItemProps = {
	data: newsType
}

const NewsItem: FC<NewsItemProps> = ({ data }) => {
	const dispatch = useDispatch()

	const [editMode, setEditMode] = useState(false)
	const [editedData, setEditedData] = useState({ ...data })
	const [editedImage, setEditedImage] = useState<File | null>(null)

	const formattedDate = dayjs(new Date(data.date)).format('MMMM DD, YYYY HH:mm')

	const handleClose = () => {
		setEditedData({ ...data })
		setEditMode(false)
	}

	const deleteHandler = async () => {
		if (data._id) {
			dispatch(deleteNews(data._id))
		}
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

	const handleChangeIsTop = () => {
		setEditedData(prev => ({ ...prev, isTop: !prev.isTop }))
	}

	const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
		setEditedData(prev => ({
			...prev,
			image: e.target.files ? e.target.files[0] : null,
		}))
		setEditedImage(e.target.files ? e.target.files[0] : null)
	}

	// const saveHandler = async () => {
	// 	const imageToUpdate = editedImage instanceof File ? editedImage : null

	// 	const newsToUpdate = {
	// 		...editedData,
	// 		image: imageToUpdate,
	// 	}

	// 	dispatch(editNews(newsToUpdate))
	// }
	const saveHandler = async () => {
		const formData = new FormData()

		formData.append('id', editedData.id)
		formData.append('_id', editedData._id)
		formData.append('title', editedData.title)
		formData.append('description', editedData.description)
		formData.append('textEditor', editedData.textEditor)
		formData.append('isTop', editedData.isTop)
		formData.append('date', editedData.date)

		if (editedImage) {
			formData.append('image', editedImage)
		}

		dispatch(editNews(formData))
	}

	function arrayBufferToBase64(buffer: ArrayBuffer): string {
		const binaryArray = new Uint8Array(buffer)
		const base64 = binaryArray.reduce(
			(acc, byte) => acc + String.fromCharCode(byte),
			''
		)
		return btoa(base64)
	}

	const base64Encoded = data.image ? arrayBufferToBase64(data.image.data) : ''

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
					{data.image && typeof data.image === 'object' && (
						<CardMedia
							component='div'
							sx={{
								pt: '56.25%',
								position: 'relative',
							}}
							image={`data:image/jpeg;base64,${base64Encoded}`}
						>
							<span className={styles.date}>{formattedDate}</span>
						</CardMedia>
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
						<div style={{ width: '33%' }}>
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
							<DateTimePicker
								label='Дата'
								value={dayjs(editedData.date)}
								onChange={(value: Date) =>
									setEditedData(prev => ({ ...prev, date: dayjs(value) }))
								}
								fullWidth
								variant='inline'
								sx={{ margin: '16px 0' }}
							/>
							<FormControlLabel
								style={{ margin: '16px 0' }}
								control={
									<Switch
										checked={editedData.isTop}
										onChange={handleChangeIsTop}
									/>
								}
								label={
									<Typography variant='body2' sx={{ lineHeight: '16px' }}>
										{editedData.isTop
											? 'Убрать эту новость из топ'
											: 'Добавить эту новость в топ'}
									</Typography>
								}
							/>
						</div>
						<div style={{ width: '70%' }}>
							<FormControl margin='normal'>
								<input
									id='image-input-edit'
									type='file'
									accept='image/*,.png,.jpg,.jpeg,.webp,.gif'
									onChange={handleChangeImage}
									style={{ display: 'none' }}
								/>
								<label htmlFor='image-input-edit'>
									<Button component='span' variant='outlined' color='primary'>
										{editedImage ? editedImage.name : 'Загрузить картинку'}
									</Button>
								</label>
							</FormControl>
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
