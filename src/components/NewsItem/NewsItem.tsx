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
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, deleteNews, editNews } from '../../slices/newsSlice'

import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import ReactQuill from 'react-quill'

import styles from './NewsItem.module.css'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { formats, modules } from '../../editorConfig'
import { RootState, newsType } from '../../types'

type NewsItemProps = {
	data: newsType
	topNews: boolean
}

const NewsItem: FC<NewsItemProps> = ({ data, topNews }) => {
	const { pageNews, pageTopNews, newsPerPage, topNewsPerPage } = useSelector(
		(state: RootState) => state.news
	)
	const dispatch = useDispatch<AppDispatch>()

	const [editMode, setEditMode] = useState(false)
	const [editedData, setEditedData] = useState({
		...data,
		date: new Date(data.date!),
	})
	const [editedImage, setEditedImage] = useState<File | null>(null)

	const formattedDate = data.date
		? dayjs(data.date).format('MMMM DD, YYYY HH:mm')
		: 'Дата не была установлена'

	const currentPage = topNews ? pageTopNews : pageNews
	const pageSize = topNews ? topNewsPerPage : newsPerPage

	const handleClose = () => {
		setEditedData({ ...data, date: new Date(data.date!) })
		setEditMode(false)
	}

	const deleteHandler = async () => {
		if (data._id) {
			dispatch(
				deleteNews({
					newsId: data._id,
					topNews,
					currentPage,
					pageSize,
				})
			)
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

	const saveHandler = async () => {
		dispatch(
			editNews({
				editedData,
				topNews,
				currentPage,
				pageSize,
			})
		)
	}

	function arrayBufferToBase64(buffer: ArrayBuffer): string {
		const binaryArray = new Uint8Array(buffer)
		const base64 = binaryArray.reduce(
			(acc, byte) => acc + String.fromCharCode(byte),
			''
		)
		return btoa(base64)
	}

	// @ts-expect-error I use here Buffer not file
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
							{data.h1}
						</Typography>
						{/* <Typography>{data.description}</Typography> */}
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
								label='h1'
								variant='outlined'
								margin='normal'
								name='h1'
								value={editedData.h1}
								onChange={handleChange}
							/>
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
								// @ts-expect-error something wrong with dayjs
								value={dayjs(editedData.date)}
								onChange={(value: Date | null) =>
									setEditedData(prev => ({
										...prev,
										date: dayjs(value).toDate(),
									}))
								}
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
