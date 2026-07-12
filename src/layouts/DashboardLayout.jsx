// Reusable dashboard shell for authenticated pages.
import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  Brightness4 as Brightness4Icon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  NotificationsNone as NotificationsIcon,
  Settings as SettingsIcon,
  UploadFile as UploadFileIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const drawerWidth = 260;

const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Upload Scan', path: '/upload', icon: <UploadFileIcon /> },
  { label: 'History', path: '/history', icon: <HistoryIcon /> },
  { label: 'Statistics', path: '/statistics', icon: <BarChartIcon /> },
  { label: 'Reports', path: '/reports', icon: <DescriptionIcon /> },
  { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

const DashboardLayout = ({ children, title = 'Dashboard' }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Typography variant="h6" fontWeight={700}>
          Paranasal Sinus AI
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, py: 2 }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              component={RouterLink}
              to={item.path}
              selected={isActive}
              onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar>{user?.displayName?.[0] || user?.email?.[0] || 'U'}</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {user?.displayName || user?.email || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email || 'Signed in'}
            </Typography>
          </Box>
        </Stack>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: darkMode
          ? 'linear-gradient(135deg, #07111f 0%, #0f172a 100%)'
          : 'linear-gradient(135deg, #f4fbff 0%, #eef8ff 100%)',
      }}
    >
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          borderBottom: 1,
          borderColor: 'divider',
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton edge="start" color="inherit" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" component="h1" fontWeight={600}>
              {title}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton color="inherit" aria-label="notifications">
              <NotificationsIcon />
            </IconButton>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ ml: 0.5 }}>
              <Avatar sx={{ width: 34, height: 34 }}>{user?.displayName?.[0] || user?.email?.[0] || 'U'}</Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle2" fontWeight={600} noWrap>
                  {user?.displayName || user?.email || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user?.email || 'Signed in'}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Brightness4Icon color="action" />
              <Switch checked={darkMode} onChange={() => setDarkMode((value) => !value)} size="small" />
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 1,
              borderColor: 'divider',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, mt: { xs: 8, md: 10 } }}>
        <Box
          sx={{
            maxWidth: 1400,
            mx: 'auto',
            borderRadius: 4,
            p: { xs: 0, md: 0.5 },
            background: darkMode ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255,255,255,0.45)',
            backdropFilter: 'blur(18px)',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
