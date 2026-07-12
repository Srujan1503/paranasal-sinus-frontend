import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';

const PredictionResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;
  const fileName = location.state?.fileName;

  if (!result) {
    return (
      <DashboardLayout title="Prediction Results">
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight={700} color="primary.dark">
            Prediction Results
          </Typography>
          <Alert severity="info">No prediction response was provided by the backend.</Alert>
          <Button variant="contained" onClick={() => navigate('/upload')}>
            Back to Upload
          </Button>
        </Stack>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Prediction Results">
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={700} color="primary.dark">
          Prediction Results
        </Typography>

        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(18px)' }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Uploaded file
              </Typography>
              <Typography fontWeight={600}>{fileName || 'Uploaded scan'}</Typography>
            </Box>

            <Alert severity="success">Backend response received successfully.</Alert>

            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <Stack spacing={1.5}>
                {Object.entries(result).map(([key, value]) => (
                  <Stack key={key} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                    <Typography fontWeight={600} textTransform="capitalize">
                      {key.replace(/_/g, ' ')}
                    </Typography>
                    <Typography color="text.secondary">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="contained" onClick={() => navigate('/history')}>
                View History
              </Button>
              <Button variant="outlined" onClick={() => navigate('/upload')}>
                Upload Another Scan
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </DashboardLayout>
  );
};

export default PredictionResults;
