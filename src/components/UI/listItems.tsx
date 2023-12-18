import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import ArticleIcon from '@mui/icons-material/Article'
import { NavLink } from 'react-router-dom'

export const mainListItems = (
	<>
		<NavLink to='/'>
			<ListItemButton>
				<ListItemIcon>
					<ArticleIcon />
				</ListItemIcon>
				<ListItemText primary='Новости' />
			</ListItemButton>
		</NavLink>

		<NavLink to='/top-news'>
			<ListItemButton>
				<ListItemIcon>
					<NewspaperIcon />
				</ListItemIcon>
				<ListItemText primary='Топ новости' />
			</ListItemButton>
		</NavLink>
	</>
)
