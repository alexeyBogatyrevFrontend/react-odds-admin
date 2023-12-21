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
		editTopNews: (state, action) => {
			const { id, title, description, textEditor } = action.payload
			const index = state.topNewsList.findIndex(item => item.id === id)
			if (index !== -1) {
				state.topNewsList[index].title = title
				state.topNewsList[index].description = description
				state.topNewsList[index].textEditor = textEditor
			}
		},
	},
})

export const { addTopNews, deleteTopNews, editTopNews } = topNewsSlice.actions

export default topNewsSlice.reducer
