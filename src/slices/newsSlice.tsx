import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { newsType } from '../components/NewsForm'

type NewsState = {
	newsList: newsType[]
	status: 'idle' | 'loading' | 'succeeded' | 'failed'
	error: string | null
}

type FetchNewsResponse = newsType[]

const initialState: NewsState = {
	newsList: [],
	status: 'idle',
	error: null,
}

export const fetchNews = createAsyncThunk<FetchNewsResponse, void>(
	'news/fetchNews',
	async () => {
		const response = await axios.get('http://localhost:3001/news/all')
		return response.data
	}
)

const newsSlice = createSlice({
	name: 'news',
	initialState,
	reducers: {
		// addNews: (state, action) => {
		// 	state.newsList.push(action.payload)
		// },
		addNews: (state, action) => {
			state.newsList = [...state.newsList, action.payload]
		},
		deleteNews: (state, action) => {
			state.newsList = state.newsList.filter(item => item.id !== action.payload)
		},
		editNews: (state, action) => {
			const { id, title, description, textEditor, isTop, date } = action.payload
			const index = state.newsList.findIndex(item => item.id === id)
			if (index !== -1) {
				state.newsList[index].title = title
				state.newsList[index].description = description
				state.newsList[index].textEditor = textEditor
				state.newsList[index].isTop = isTop
				state.newsList[index].date = date
			}
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchNews.pending, state => {
				state.status = 'loading'
			})
			.addCase(
				fetchNews.fulfilled,
				(state, action: PayloadAction<newsType[]>) => {
					state.status = 'succeeded'
					state.newsList = action.payload
				}
			)
			.addCase(fetchNews.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.error.message ?? 'An error occurred'
			})
	},
})

export const { addNews, deleteNews, editNews } = newsSlice.actions

export default newsSlice.reducer
