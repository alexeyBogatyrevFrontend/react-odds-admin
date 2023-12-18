import { createSlice } from '@reduxjs/toolkit'
import { newsType } from '../components/NewsForm'

type NewsState = {
	topNewsList: newsType[]
}

const initialState: NewsState = {
	topNewsList: [],
}

const topNewsSlice = createSlice({
	name: 'top-news',
	initialState,
	reducers: {
		addTopNews: (state, action) => {
			state.topNewsList.push(action.payload)
		},
		deleteTopNews: (state, action) => {
			state.topNewsList = state.topNewsList.filter(
				item => item.id !== action.payload
			)
		},
	},
})

export const { addTopNews, deleteTopNews } = topNewsSlice.actions

export default topNewsSlice.reducer
