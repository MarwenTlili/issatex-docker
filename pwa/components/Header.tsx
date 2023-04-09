import React, { forwardRef, useEffect, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import MenuIcon from '@mui/icons-material/Menu';
import FactoryIcon from '@mui/icons-material/Factory';

import { signOut, useSession } from "next-auth/react"
import Link from 'next/link';
import {Link as MuiLink} from '@mui/material';
// import MuiLink from '@mui/material/Link';
import { useRouter } from 'next/router';

const PAGES = ['articles', 'Manufacturing_Orders', 'Blog'];
// const COMPANY_SETTINGS = ['Profile', 'Dashboard', 'Logout'];

const Pages = (props: any) => (
	<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} >
		<MuiLink href='/articles'>
			<Button 
				onClick={props.handleCloseNavMenu} 
				sx={{ my: 2, color: 'white', display: 'block' }} 
			>
				Articles
			</Button>
		</MuiLink>
		<MuiLink href='/manufacturing_orders'>
			<Button 
				onClick={props.handleCloseNavMenu} 
				sx={{ my: 2, color: 'white', display: 'block' }} 
			>
				manufacturing_orders
			</Button>
		</MuiLink>
		<MuiLink href='/blog'>
			<Button 
				onClick={props.handleCloseNavMenu} 
				sx={{ my: 2, color: 'white', display: 'block' }} 
			>
				blog
			</Button>
		</MuiLink>
	</Box>
)

function Header() {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const { data: session, status } = useSession();
	// console.log(`session status: ${status}`);

	// const {asPath} = useRouter();

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<FactoryIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
					<Typography variant="h6" noWrap component="a" href="/"
						sx={{
							mr: 2,
							display: { xs: 'none', md: 'flex' },
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						Issatex
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar"
							aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu id="menu-appbar" anchorEl={anchorElNav}
							anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
							keepMounted
							transformOrigin={{ vertical: 'top', horizontal: 'left', }}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{ display: { xs: 'block', md: 'none' }, }}
						>
							{PAGES.map((page) => (
								<MenuItem 
									key={page} 
									onClick={handleCloseNavMenu}
								>
									<MuiLink href={page}>
										<Typography textAlign="center">{page}</Typography>
									</MuiLink>
								</MenuItem>
							))}
						</Menu>
					</Box>

					{!session && (
						<>
							<FactoryIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
							<Typography
								variant="h5" noWrap component="a" 
								sx={{
									mr: 2,
									display: { xs: 'flex', md: 'none' },
									flexGrow: 1,
									fontFamily: 'monospace',
									fontWeight: 700,
									letterSpacing: '.3rem',
									color: 'inherit',
									textDecoration: 'none',
								}}
							>
								ISSATEX
							</Typography>
						</>
					)}

					{!session && (
						<Box 
							sx={{
								mr: 2,
								display: { xs: 'flex', md: 'none' },
								flexGrow: 0,
								fontFamily: 'monospace',
								fontWeight: 700,
								letterSpacing: '.3rem',
								color: 'inherit',
								textDecoration: 'none',
							}} 
						>
							<MuiLink href='/auth/signin' style={{ textDecoration: 'none' }}>
								<Button key='' onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }} >
									Login
								</Button>
							</MuiLink>
						</Box>
					)}

					<Pages handleCloseNavMenu={handleCloseNavMenu} />

					{!session && (
						<Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }} >
							<MuiLink href='/auth/signin' style={{ textDecoration: 'none' }}>
								<Button key='' onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }} >
									Login
								</Button>
							</MuiLink>
						</Box>
					)}

					{session && (
						<>
							<Typography variant="h6" noWrap component="a" sx={{
								my: 2,
								mr: 2
							}}>
								{session.user.username}
							</Typography>
							<Box sx={{ flexGrow: 0 }}>
								<Tooltip title="Open settings">
									<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
									<Avatar alt={session.user.avatar} src={session.user.avatar} />
									</IconButton>
								</Tooltip>
								<Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser}
									anchorOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									open={Boolean(anchorElUser)}
									onClose={handleCloseUserMenu}
								>
										<MuiLink href='#' underline='none'>
											<MenuItem key='dashboard' onClick={handleCloseUserMenu}>
													Dashboard
											</MenuItem>
										</MuiLink>
										<MuiLink underline='none' 
											onClick={(e) => {
												e.preventDefault()
												signOut()
											}}
										>
											<MenuItem key='logout' onClick={handleCloseUserMenu}>
												Signout
											</MenuItem>
										</MuiLink>
								</Menu>
							</Box>
						</>
					)}
				</Toolbar>
			</Container>
		</AppBar>
	);
}
export default Header;