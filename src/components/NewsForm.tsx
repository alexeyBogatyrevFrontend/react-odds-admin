import { useState, FormEvent, FC } from 'react'
import {
	TextField,
	Button,
	Typography,
	Container,
	Box,
	FormControl,
	FormHelperText,
	Switch,
	FormControlLabel,
	CircularProgress,
} from '@mui/material'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { v4 as uuidv4 } from 'uuid'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'

import { useDispatch, useSelector } from 'react-redux'
import { addNews, fetchNews } from '../slices/newsSlice'
import { addNewsBD } from '../utils/bdFunc'

export const modules = {
	toolbar: [
		[{ header: '1' }, { header: '2' }, { font: [] }],
		[{ size: [] }],
		['bold', 'italic', 'underline', 'strike', 'blockquote'],
		[
			{ list: 'ordered' },
			{ list: 'bullet' },
			{ indent: '-1' },
			{ indent: '+1' },
		],
		['link', 'image', 'video'],
		['clean'],
	],
}

export const formats = [
	'header',
	'font',
	'size',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'list',
	'bullet',
	'indent',
	'link',
	'image',
	'video',
]

export type newsType = {
	_id?: string
	id: string
	title: string
	description: string
	textEditor: string
	isTop: boolean
	date: Date
	image: File | null
}

const initialState = {
	id: '',
	title: '',
	description: '',
	textEditor: '',
	isTop: false,
	date: new Date(),
	image: null,
}

type RootState = {
	news: {
		newsList: newsType[]
		status: string
		error: string
	}
}

const NewsForm: FC = () => {
	const { status } = useSelector((state: RootState) => state.news)
	const dispatch = useDispatch()

	const [data, setData] = useState<newsType>(initialState)

	const [titleError, setTitleError] = useState<boolean>(false)
	const [descriptionError, setDescriptionError] = useState<boolean>(false)
	const [textEditorError, setTextEditorError] = useState<boolean>(false)
	const [imageError, setImageError] = useState<boolean>(false)

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (
			!data.title.length ||
			!data.description.length ||
			!data.textEditor.length ||
			!data.image?.name.length
		) {
			if (!data.title.length) setTitleError(true)
			if (!data.description.length) setDescriptionError(true)
			if (!data.textEditor.length) setTextEditorError(true)
			if (!data.image?.name.length) setImageError(true)
			return
		}

		setTitleError(false)
		setDescriptionError(false)
		setTextEditorError(false)
		setImageError(false)

		const id = uuidv4().toString()

		const news = {
			...data,
			id,
		}

		dispatch(addNews(news))

		setData(initialState)
	}

	return (
		<Container maxWidth='sm'>
			<Box mt={3}>
				<Typography variant='h4' align='center' color='primary' gutterBottom>
					Создание новости
				</Typography>
				{status === 'loading' ? (
					<CircularProgress
						sx={{ position: 'absolute', top: '50%', left: '50%' }}
					/>
				) : (
					<form onSubmit={handleSubmit}>
						<TextField
							fullWidth
							label='Заголовок'
							variant='outlined'
							margin='normal'
							value={data.title}
							onChange={e => {
								setData(prev => ({ ...prev, title: e.target.value }))
								setTitleError(false)
							}}
							error={titleError}
							helperText={titleError ? 'Заполните заголовок' : ''}
						/>
						<TextField
							fullWidth
							label='Описание'
							variant='outlined'
							multiline
							rows={4}
							margin='normal'
							value={data.description}
							onChange={e => {
								setData(prev => ({ ...prev, description: e.target.value }))
								setDescriptionError(false)
							}}
							error={descriptionError}
							helperText={descriptionError ? 'Заполните описание' : ''}
						/>
						<FormControl
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								flexDirection: 'row',
							}}
						>
							<DateTimePicker
								sx={{ margin: '16px 0' }}
								label='Дата'
								fullWidth
								value={dayjs(data.date)}
								onChange={(value: Date | null) => {
									if (value) {
										setData(prev => ({ ...prev, date: dayjs(value) }))
									}
								}}
							/>
							<FormControlLabel
								style={{ flexDirection: 'row-reverse' }}
								label={
									<Typography variant='body2' sx={{ lineHeight: '16px' }}>
										{data.isTop ? 'Топ новость' : 'Обычная новость'}
									</Typography>
								}
								control={
									<Switch
										checked={data.isTop}
										onChange={() =>
											setData(prev => ({ ...prev, isTop: !prev.isTop }))
										}
									/>
								}
							/>
						</FormControl>

						<ReactQuill
							theme='snow'
							modules={modules}
							formats={formats}
							value={data.textEditor}
							onChange={content => {
								setData(prev => ({ ...prev, textEditor: content }))
								setTextEditorError(false)
							}}
							placeholder='Контент для страницы'
						/>
						<FormControl error={textEditorError}>
							<FormHelperText>
								{textEditorError
									? 'Заполните контент для страницы новости'
									: ''}
							</FormHelperText>
						</FormControl>
						<FormControl
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'start',
								flexDirection: 'row',
							}}
						>
							<FormControl error={imageError}>
								<input
									id='image-input'
									type='file'
									accept='image/*,.png,.jpg,.jpeg,.webp,.gif'
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										setData(prev => ({
											...prev,
											image: e.target.files ? e.target.files[0] : null,
										}))
										setImageError(false)
									}}
									style={{ display: 'none' }}
								/>
								<label htmlFor='image-input'>
									<Button component='span' variant='outlined' color='primary'>
										{data.image ? data.image.name : 'Загрузить картинку'}
									</Button>
								</label>
								<FormHelperText>
									{imageError ? 'Выберите картинку' : ''}
								</FormHelperText>
							</FormControl>

							<Button type='submit' variant='contained' color='primary'>
								Создать
							</Button>
						</FormControl>
					</form>
				)}
			</Box>
		</Container>
	)
}

export default NewsForm
