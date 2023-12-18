import Typography from '@mui/material/Typography'
import { FC } from 'react'

interface TitleProps {
	children?: React.ReactNode
	props?: any
}

const Title: FC<TitleProps> = ({ children, ...props }) => {
	return (
		<Typography {...props} gutterBottom>
			{children}
		</Typography>
	)
}

export default Title
