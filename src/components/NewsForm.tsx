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
// import { v4 as uuidv4 } from 'uuid'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, addNews } from '../slices/newsSlice'
import { formats, modules } from '../editorConfig'
import { RootState, newsType } from '../types'

const initialState = {
	h1: '',
	title: '',
	description: '',
	textEditor: '',
	isTop: false,
	date: new Date(),
	image: null,
}

const NewsForm: FC = () => {
	const { status } = useSelector((state: RootState) => state.news)
	const dispatch = useDispatch<AppDispatch>()

	const [data, setData] = useState<newsType>(initialState)

	const [h1Error, setH1Error] = useState<boolean>(false)
	const [titleError, setTitleError] = useState<boolean>(false)
	const [descriptionError, setDescriptionError] = useState<boolean>(false)
	const [textEditorError, setTextEditorError] = useState<boolean>(false)
	const [imageError, setImageError] = useState<boolean>(false)

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (
			!data.h1.length ||
			!data.title.length ||
			!data.description.length ||
			!data.textEditor.length ||
			!data.image?.name.length
		) {
			if (!data.h1.length) setH1Error(true)
			if (!data.title.length) setTitleError(true)
			if (!data.description.length) setDescriptionError(true)
			if (!data.textEditor.length) setTextEditorError(true)
			if (!data.image?.name.length) setImageError(true)
			return
		}

		setH1Error(false)
		setTitleError(false)
		setDescriptionError(false)
		setTextEditorError(false)
		setImageError(false)

		// const id = uuidv4().toString()

		const news = {
			...data,
			// id,
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
							label='h1'
							variant='outlined'
							margin='normal'
							value={data.h1}
							onChange={e => {
								setData(prev => ({ ...prev, h1: e.target.value }))
								setH1Error(false)
							}}
							error={h1Error}
							helperText={h1Error ? 'Заполните h1' : ''}
						/>
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
								// @ts-expect-error something wrong with dayjs
								value={dayjs(data.date)}
								onChange={(value: Date | null) => {
									if (value) {
										setData(prev => ({ ...prev, date: dayjs(value).toDate() }))
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
