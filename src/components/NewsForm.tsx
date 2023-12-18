// NewsForm.tsx
import { useState, FormEvent, FC, ChangeEvent } from 'react'
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

const NewsForm: FC = () => {
	const [title, setTitle] = useState<string>('')
	const [description, setDescription] = useState<string>('')
	const [image, setImage] = useState<File | null>(null)
	const [titleError, setTitleError] = useState<boolean>(false)
	const [descriptionError, setDescriptionError] = useState<boolean>(false)
	const [imageError, setImageError] = useState<boolean>(false)

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFile = e.target.files[0]

			// Check if the selected file type is allowed
			const allowedTypes = [
				'image/png',
				'image/jpeg',
				'image/jpg',
				'image/webp',
				'image/gif',
			]
			if (!allowedTypes.includes(selectedFile.type)) {
				setImageError(true)
				return
			}

			setImage(selectedFile)
			setImageError(false)
		}
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		// Check for empty fields
		if (!title.length || !description.length || !image?.name.length) {
			if (!title.length) setTitleError(true)
			if (!description.length) setDescriptionError(true)
			if (!image?.name.length) setImageError(true)

			return
		}

		// Reset error states
		setTitleError(false)
		setDescriptionError(false)
		setImageError(false)

		// Perform your submission logic here
		console.log('Title:', title)
		console.log('Description:', description)
		console.log('Image:', image)

		// Reset form fields
		setTitle('')
		setDescription('')
		setImage(null)
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
						value={title}
						onChange={e => {
							setTitle(e.target.value)
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
						value={description}
						onChange={e => {
							setDescription(e.target.value)
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
								onChange={handleFileChange}
								style={{ display: 'none' }}
							/>
							<label htmlFor='image-input'>
								<Button component='span' variant='outlined' color='primary'>
									{image ? image.name : 'Загрузить картинку'}
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
