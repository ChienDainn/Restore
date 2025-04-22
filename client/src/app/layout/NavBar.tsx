import { AppBar, Badge, Box, IconButton, List, ListItem, Toolbar, Typography } from "@mui/material";
import { DarkMode, LightMode, ShoppingCart } from '@mui/icons-material';
import { NavLink } from "react-router-dom";

const midLinks = [
  { title: 'catalog', path: '/catalog' },
  { title: 'about', path: '/about' },
  { title: 'contact', path: '/contact' },
];

const rightLinks = [
  { title: 'login', path: '/login' },
  { title: 'register', path: '/register' }
];

const navStyles = {
  color: 'inherit',
  typography: 'h6',
  textDecoration: 'none',
  transition: 'color 0.3s ease, transform 0.2s ease',
  '&:hover': {
    color: 'primary.light',
    transform: 'scale(1.05)',
  },
  '&.active': {
    color: '#00e5ff',
    fontWeight: 'bold',
  }
};

type Props = {
  toggleDarkMode: () => void;
  darkMode: boolean;
};

export default function NavBar({ darkMode, toggleDarkMode }: Props) {
  return (
    <AppBar position="fixed" sx={{ mb: 4 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3 }}>

        {/* Logo + Theme Toggle */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography
            component={NavLink}
            to="/"
            variant="h5"
            sx={{ ...navStyles, fontWeight: 700, letterSpacing: 1 }}
          >
            RE-STORE
          </Typography>

          <IconButton onClick={toggleDarkMode} sx={{ transition: 'all 0.3s ease' }}>
            {darkMode ? <DarkMode sx={{ color: '#fdd835' }} /> : <LightMode sx={{ color: '#ffeb3b' }} />}
          </IconButton>
        </Box>

        {/* Middle Navigation */}
        <List sx={{ display: 'flex', gap: 2 }}>
          {midLinks.map(({ title, path }) => (
            <ListItem
              component={NavLink}
              to={path}
              key={path}
              sx={{ ...navStyles, px: 2 }}
            >
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>

        {/* Cart + Right Links */}
        <Box display="flex" alignItems="center" gap={3}>
          <IconButton size="large" sx={{ color: 'inherit' }}>
            <Badge badgeContent={4} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          <List sx={{ display: 'flex', gap: 2 }}>
            {rightLinks.map(({ title, path }) => (
              <ListItem
                component={NavLink}
                to={path}
                key={path}
                sx={{ ...navStyles, px: 2 }}
              >
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
        </Box>

      </Toolbar>
    </AppBar>
  );
}
