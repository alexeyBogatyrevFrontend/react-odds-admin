// NewsForm.tsx
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
} from '@mui/material'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // Import the styles
import { useDispatch } from 'react-redux'
import { addNews } from '../slices/newsSlice'
import { v4 as uuidv4 } from 'uuid'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'

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

const NewsForm: FC = () => {
	const [data, setData] = useState<newsType>(initialState)

	const [titleError, setTitleError] = useState<boolean>(false)
	const [descriptionError, setDescriptionError] = useState<boolean>(false)
	const [textEditorError, setTextEditorError] = useState<boolean>(false)
	const [imageError, setImageError] = useState<boolean>(false)

	const dispatch = useDispatch()

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

		// Convert File to data URL
		const image = data.image
		let imageURL = null

		if (image) {
			imageURL = await new Promise<string | null>(resolve => {
				const reader = new FileReader()
				reader.onload = event => resolve(event.target?.result as string)
				reader.readAsDataURL(image)
			})
		}

		const id = uuidv4().toString()

		dispatch(
			addNews({
				...data,
				id,
				date: dayjs(data.date).toISOString(),
				image: imageURL,
			})
		)

		setData(initialState)
	}

	return (
		<Container maxWidth='sm'>
			<Box mt={3}>
				<Typography variant='h4' align='center' color='primary' gutterBottom>
					Создание новости
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label='Заголовок'
						variant='outlined'
						margin='normal'
						value={data.title}
						onChange={e => {
							setData(prev => ({ ...prev, title: e.target.value }))
							setTitleError(false) // Reset error state on change
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
							{textEditorError ? 'Заполните контент для страницы новости' : ''}
						</FormHelperText>
					</FormControl>
					<FormControl
						margin='normal'
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'start',
							flexDirection: 'row',
						}}
					>
						<FormControlLabel
							control={
								<Switch
									checked={data.isTop}
									onChange={() =>
										setData(prev => ({ ...prev, isTop: !prev.isTop }))
									}
								/>
							}
							label='Это топ новость?'
						/>
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
			</Box>
		</Container>
	)
}

export default NewsForm
