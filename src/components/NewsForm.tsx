// NewsForm.tsx
import { useState, FormEvent, FC } from 'react'
import {
	TextField,
	Button,
	Typography,
	Container,
	Box,
	FormControl,
	Input,
	FormHelperText,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { addNews } from '../slices/newsSlice'
import { v4 as uuidv4 } from 'uuid'

export type newsType = {
	id: string
	title: string
	description: string
	image: File | null
}

const initialState = {
	id: '',
	title: '',
	description: '',
	image: null,
}

const NewsForm: FC = () => {
	const [data, setData] = useState<newsType>(initialState)

	const [titleError, setTitleError] = useState<boolean>(false)
	const [descriptionError, setDescriptionError] = useState<boolean>(false)
	const [imageError, setImageError] = useState<boolean>(false)

	const dispatch = useDispatch()

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (
			!data.title.length ||
			!data.description.length ||
			!data.image?.name.length
		) {
			if (!data.title.length) setTitleError(true)
			if (!data.description.length) setDescriptionError(true)
			if (!data.image?.name.length) setImageError(true)
			return
		}

		setTitleError(false)
		setDescriptionError(false)
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

		// Dispatch the action with a serializable payload
		dispatch(addNews({ ...data, id, image: imageURL }))

		// Reset form state
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
							setDescriptionError(false) // Reset error state on change
						}}
						error={descriptionError}
						helperText={descriptionError ? 'Заполните описание' : ''}
					/>
					<FormControl
						margin='normal'
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'start',
							flexDirection: 'row',
						}}
					>
						<FormControl fullWidth error={imageError}>
							<Input
								id='image-input'
								type='file'
								onChange={e =>
									setData(prev => ({
										...prev,
										image: e.target.files ? e.target.files[0] : null,
									}))
								}
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
