import React from 'react'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

interface Props {
	newsPerPage: number
	totalNews: number
	totalPages: number
	paginate: (pageNumber: number) => void
	currentPage: number
}

const PaginationComponent: React.FC<Props> = ({
	newsPerPage,
	totalNews,
	totalPages,
	paginate,
	currentPage,
}) => {
	const pageNumbers = []

	for (let i = 1; i <= Math.ceil(totalNews / newsPerPage); i++) {
		pageNumbers.push(i)
	}

	return (
		<Stack spacing={2} sx={{ mt: 3 }}>
			<Pagination
				count={totalPages}
				variant='outlined'
				color='primary'
				page={currentPage}
				onChange={(event, value) => paginate(value)}
			/>
		</Stack>
	)
}

export default PaginationComponent
