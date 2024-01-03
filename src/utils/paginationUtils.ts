import { AppDispatch, fetchNews, fetchTopNews } from '../slices/newsSlice'

export const paginateNews = (
	dispatch: AppDispatch,
	page: number,
	newsPerPage: number,
	isTop: boolean
) => {
	const fetchAction = isTop ? fetchTopNews : fetchNews

	dispatch(fetchAction({ page, pageSize: newsPerPage }))
}
