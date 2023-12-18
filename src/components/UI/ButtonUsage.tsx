import { Button } from '@mui/material'
import { FC, ReactNode } from 'react'

type ButtonUsageProps = {
	children: ReactNode
}

const ButtonUsage: FC<ButtonUsageProps> = ({ children }) => {
	return <Button variant='contained'>{children}</Button>
}

export default ButtonUsage
