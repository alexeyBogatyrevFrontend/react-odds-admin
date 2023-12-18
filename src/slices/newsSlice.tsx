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
	},
})

export const { addNews } = newsSlice.actions

export default newsSlice.reducer
