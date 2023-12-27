export type newsType = {
	_id?: string
	id: string
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
	}
}
