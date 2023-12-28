import { newsType } from '../types'

export const sortNewsByDate = (a: newsType, b: newsType, sortOrder: string) => {
	const dateA = new Date(a.date!)
	const dateB = new Date(b.date!)

	if (
		dateA.toString() === 'Invalid Date' ||
		dateB.toString() === 'Invalid Date'
	) {
		return 0
	}

	return sortOrder === 'newest'
		? dateB.getTime() - dateA.getTime()
		: dateA.getTime() - dateB.getTime()
}
