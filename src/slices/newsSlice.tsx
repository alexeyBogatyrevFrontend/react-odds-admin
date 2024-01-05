import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import store from '../store'
import { bdDataType, newsType } from '../types'

type NewsState = {
	newsList: newsType[]
	status: 'idle' | 'loading' | 'succeeded' | 'failed'
	error: string | null
	totalPages: number
	pageNews: number
	pageTopNews: number
	newsPerPage: number
	topNewsPerPage: number
}

const initialState: NewsState = {
	newsList: [],
	status: 'idle',
	error: null,
	totalPages: 1,
	pageNews: 1,
	pageTopNews: 1,
	newsPerPage: 6,
	topNewsPerPage: 6,
}

export const fetchNews = createAsyncThunk<
	bdDataType,
	{ page: number; pageSize: number }
>('news/fetchNews', async ({ page, pageSize }) => {
	const response = await axios.get(
		`http://localhost:3001/news/all?page=${page}&pageSize=${pageSize}`
	)

	return response.data
})

export const fetchTopNews = createAsyncThunk<
	bdDataType,
	{ page: number; pageSize: number }
>('news/fetchTopNews', async ({ page, pageSize }) => {
	const response = await axios.get(
		`http://localhost:3001/news/top?page=${page}&pageSize=${pageSize}`
	)

	return response.data
})

export const addNews = createAsyncThunk<newsType[], newsType>(
	'news/addNews',
	async (dataNews: newsType) => {
		const formData = new FormData()

		formData.append('h1', dataNews.h1)
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

export const deleteNews = createAsyncThunk<
	bdDataType,
	{ newsId: string; topNews: boolean; currentPage: number; pageSize: number }
>('news/deleteNews', async ({ newsId, topNews, currentPage, pageSize }) => {
	const response = await axios.delete(
		`http://localhost:3001/news/delete/${newsId}?topNews=${topNews}&currentPage=${currentPage}&pageSize=${pageSize}`
	)
	return response.data
})

export const editNews = createAsyncThunk<
	bdDataType,
	{
		editedData: newsType
		topNews: boolean
		currentPage: number
		pageSize: number
	}
>('news/editNews', async ({ editedData, topNews, currentPage, pageSize }) => {
	const formData = new FormData()

	formData.append('_id', editedData._id || '')
	formData.append('h1', editedData.h1)
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
		`http://localhost:3001/news/edit/${editedData._id}?topNews=${topNews}&currentPage=${currentPage}&pageSize=${pageSize}`,
		formData
	)
	return response.data
})

const newsSlice = createSlice({
	name: 'news',
	initialState,
	reducers: {
		setPageNews: (state, action) => {
			state.pageNews = action.payload
		},
		setPageTopNews: (state, action) => {
			state.pageTopNews = action.payload
		},
		setNewsPerPage: (state, action) => {
			state.newsPerPage = action.payload
		},
		setTopNewsPerPage: (state, action) => {
			state.topNewsPerPage = action.payload
		},
	},
	extraReducers: builder => {
		// fetch
		builder.addCase(fetchNews.pending, state => {
			state.status = 'loading'
		})
		builder.addCase(
			fetchNews.fulfilled,
			(state, action: PayloadAction<bdDataType>) => {
				state.status = 'succeeded'
				state.newsList = action.payload.newsList
				state.totalPages = action.payload.totalPages
				state.pageNews =
					action.payload.currentPage > action.payload.totalPages
						? action.payload.totalPages
						: action.payload.currentPage
			}
		)
		builder.addCase(fetchNews.rejected, (state, action) => {
			state.status = 'failed'
			state.error = action.error.message ?? 'An error occurred'
		})
		// fetch top
		builder.addCase(fetchTopNews.pending, state => {
			state.status = 'loading'
		})
		builder.addCase(
			fetchTopNews.fulfilled,
			(state, action: PayloadAction<bdDataType>) => {
				state.status = 'succeeded'
				state.newsList = action.payload.newsList
				state.totalPages = action.payload.totalPages
				state.pageTopNews =
					action.payload.currentPage > action.payload.totalPages
						? action.payload.totalPages
						: action.payload.currentPage
			}
		)
		builder.addCase(fetchTopNews.rejected, (state, action) => {
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
			state.newsList = action.payload.newsList
			state.pageNews = action.payload.currentPage
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
			state.newsList = action.payload.newsList
			state.totalPages = action.payload.totalPages
			action.payload.isTopNews
				? (state.pageTopNews =
						action.payload.currentPage > action.payload.totalPages
							? action.payload.totalPages
							: action.payload.currentPage)
				: (state.pageNews =
						action.payload.currentPage > action.payload.totalPages
							? action.payload.totalPages
							: action.payload.currentPage)
		})
		builder.addCase(deleteNews.rejected, (state, action) => {
			state.status = 'failed'
			state.error = action.error.message ?? 'An error occurred'
		})
	},
})

export default newsSlice.reducer
export const {
	setPageNews,
	setPageTopNews,
	setNewsPerPage,
	setTopNewsPerPage,
} = newsSlice.actions
export type AppDispatch = typeof store.dispatch
