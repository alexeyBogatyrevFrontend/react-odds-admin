import axios from 'axios'
import { newsType } from '../components/NewsForm'

export const addNewsBD = async (dataNews: newsType) => {
	try {
		const formData = new FormData()
		formData.append('id', dataNews.id)
		formData.append('title', dataNews.title)
		formData.append('description', dataNews.description)
		formData.append('textEditor', dataNews.textEditor)
		formData.append('isTop', String(dataNews.isTop))
		formData.append('date', dataNews.date.toISOString())
		if (dataNews.image) {
			formData.append('image', dataNews.image, dataNews.image.name)
		}

		const response = await axios.post(
			'http://localhost:3001/news/add',
			formData
		)
		console.log(response.data)
	} catch (error) {
		console.log('Error adding news:')
	}
}

export const editNewsBD = async (news: newsType) => {
	try {
		const response = await axios.put(
			`http://localhost:3001/news/edit/${news._id}`,
			news
		)
		console.log(response.data)
	} catch (error) {
		console.log('Error updating news:')
	}
}

export const deleteNewsBD = async (newsId: string) => {
	try {
		const response = await axios.delete(
			`http://localhost:3001/news/delete/${newsId}`
		)
		return response.data
	} catch (error) {
		console.log('Error deleting news:')
	}
}
