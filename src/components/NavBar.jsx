// components/Navbar.jsx
import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';

function Navbar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const menuItems = [
        { text: 'Dashboard', path: '/dashboard' },
        { text: 'Eventos', path: '/events' },
        // Agrega más opciones según necesites
    ];

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Mykure Lite Dashboard
                    </Typography>
                    {!isMobile &&
                        menuItems.map((item) => (
                            <Button key={item.text} color="inherit" href={item.path}>
                                {item.text}
                            </Button>
                        ))}
                </Toolbar>
            </AppBar>
            <Toolbar />
            {isMobile && (
                <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer} >
                    <List sx={{ width: 250 }}>
                        {menuItems.map((item) => (
                            <ListItem sx={{ color: "primary.main" }} button key={item.text} component="a" href={item.path}>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            )}
        </>
    );
}

export default Navbar;