import { Box, Paper, Stack, Switch, Typography } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';

const Settings = () => {
  return (
    <DashboardLayout title="Settings">
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={700} color="primary.dark">
          Preferences
        </Typography>

        <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.8)' }}>
          <Stack spacing={2.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography fontWeight={600}>Dark Mode</Typography>
                <Typography variant="body2" color="text.secondary">
                  Switch the interface theme for low-light viewing.
                </Typography>
              </Box>
              <Switch defaultChecked />
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography fontWeight={600}>Notifications</Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive updates when new scan results are available.
                </Typography>
              </Box>
              <Switch defaultChecked />
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </DashboardLayout>
  );
};

export default Settings;
