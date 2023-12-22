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
})

export const { addNews, deleteNews, editNews } = newsSlice.actions

export default newsSlice.reducer
