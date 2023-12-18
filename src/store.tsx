import { configureStore } from '@reduxjs/toolkit'
import newsSlice from './slices/newsSlice'
import topNewsSlice from './slices/topNewsSlice'

const store = configureStore({
	reducer: {
		news: newsSlice,
		topNews: topNewsSlice,
	},
})

export default store
