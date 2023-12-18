import { createSlice } from '@reduxjs/toolkit'
import { newsType } from '../components/NewsForm'

type NewsState = {
	newsList: newsType[]
}

const initialState: NewsState = {
	newsList: [],
}

const newsSlice = createSlice({
	name: 'news',
	initialState,
	reducers: {
		addNews: (state, action) => {
			state.newsList.push(action.payload)
		},
		deleteNews: (state, action) => {
			state.newsList = state.newsList.filter(item => item.id !== action.payload)
		},
	},
})

export const { addNews, deleteNews } = newsSlice.actions

export default newsSlice.reducer
