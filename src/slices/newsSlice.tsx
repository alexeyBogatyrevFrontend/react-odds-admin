import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import store from '../store'
import { newsType } from '../types'

type NewsState = {
	newsList: newsType[]
	status: 'idle' | 'loading' | 'succeeded' | 'failed'
	error: string | null
}

const initialState: NewsState = {
	newsList: [],
	status: 'idle',
	error: null,
}

export const fetchNews = createAsyncThunk<newsType[], void>(
	'news/fetchNews',
	async () => {
		const response = await axios.get('http://localhost:3001/news/all')
		return response.data
	}
)

export const addNews = createAsyncThunk<newsType[], newsType>(
	'news/addNews',
	async (dataNews: newsType) => {
		const formData = new FormData()

		// formData.append('id', dataNews.id)
		formData.append('title', dataNews.title)
		formData.append('description', dataNews.description)
		formData.append('textEditor', dataNews.textEditor)
		formData.append('isTop', String(dataNews.isTop))
		formData.append(
			'date',
			dataNews.date instanceof Date ? dataNews.date.toISOString() : ''
		)
		if (dataNews.image) {
			formData.append('image', dataNews.image, dataNews.image.name)
		}

		const response = await axios.post(
			'http://localhost:3001/news/add',
			formData
		)
		return response.data
	}
)

export const deleteNews = createAsyncThunk<newsType[], string>(
	'news/deleteNews',
	async (newsId: string) => {
		const response = await axios.delete(
			`http://localhost:3001/news/delete/${newsId}`
		)
		return response.data
	}
)

export const editNews = createAsyncThunk<newsType[], newsType>(
	'news/editNews',
	async (editedData: newsType) => {
		const formData = new FormData()

		// formData.append('id', editedData.id)
		formData.append('_id', editedData._id || '')
		formData.append('title', editedData.title)
		formData.append('description', editedData.description)
		formData.append('textEditor', editedData.textEditor)
		formData.append('isTop', String(editedData.isTop))
		formData.append(
			'date',
			editedData.date instanceof Date ? editedData.date.toISOString() : ''
		)

		// Only append image if it has been changed
		if (editedData.image instanceof File) {
			formData.append('image', editedData.image, editedData.image.name)
		}

		const response = await axios.put(
			`http://localhost:3001/news/edit/${editedData._id}`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		)
		return response.data
	}
)

const newsSlice = createSlice({
	name: 'news',
	initialState,
	reducers: {},
	extraReducers: builder => {
		// fetch
		builder.addCase(fetchNews.pending, state => {
			state.status = 'loading'
		})
		builder.addCase(
			fetchNews.fulfilled,
			(state, action: PayloadAction<newsType[]>) => {
				state.status = 'succeeded'
				state.newsList = action.payload
			}
		)
		builder.addCase(fetchNews.rejected, (state, action) => {
			state.status = 'failed'
			state.error = action.error.message ?? 'An error occurred'
		})
		// add
		builder.addCase(addNews.pending, state => {
			state.status = 'loading'
		})
		builder.addCase(addNews.fulfilled, (state, action) => {
			state.status = 'succeeded'
			state.newsList = action.payload
		})
		builder.addCase(addNews.rejected, (state, action) => {
			state.status = 'failed'
			state.error = action.error.message ?? 'An error occurred'
		})
		// edit
		builder.addCase(editNews.pending, state => {
			state.status = 'loading'
		})
		builder.addCase(editNews.fulfilled, (state, action) => {
			state.status = 'succeeded'
			state.newsList = action.payload
		})
		builder.addCase(editNews.rejected, (state, action) => {
			state.status = 'failed'
			state.error = action.error.message ?? 'An error occurred'
		})
		// delete
		builder.addCase(deleteNews.pending, state => {
			state.status = 'loading'
		})
		builder.addCase(deleteNews.fulfilled, (state, action) => {
			state.status = 'succeeded'
			state.newsList = action.payload
		})
		builder.addCase(deleteNews.rejected, (state, action) => {
			state.status = 'failed'
			state.error = action.error.message ?? 'An error occurred'
		})
	},
})

export default newsSlice.reducer
export type AppDispatch = typeof store.dispatch
