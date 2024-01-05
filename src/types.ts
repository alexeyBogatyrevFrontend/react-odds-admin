export type bdDataType = {
	newsList: newsType[]
	totalPages: number
	currentPage: number
	isTopNews: boolean
}

export type newsType = {
	_id?: string
	h1: string
	title: string
	description: string
	textEditor: string
	isTop: boolean
	date: Date | null | string
	image: File | null
}

export type RootState = {
	news: {
		newsList: newsType[]
		status: string
		error: string
		totalPages: number
		pageNews: number
		pageTopNews: number
		newsPerPage: number
		topNewsPerPage: number
	}
}
