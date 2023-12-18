import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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
