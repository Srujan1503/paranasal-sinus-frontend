import { useEffect, useState } from 'react';
import { Alert, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';
import EmptyState from '../components/dashboard/EmptyState';
import { getStatistics } from '../services/api';

const Statistics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getStatistics();
        if (mounted) {
          setData(response || null);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'Unable to load statistics.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DashboardLayout title="Statistics">
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={700} color="primary.dark">
          Clinical Statistics
        </Typography>

        {loading ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, background: 'rgba(255,255,255,0.8)' }}>
            <CircularProgress />
            <Typography variant="body1" color="text.secondary" mt={2}>
              Loading statistics…
            </Typography>
          </Paper>
        ) : error ? (
          <EmptyState title="Unable to load statistics" description={error} />
        ) : data ? (
          <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.8)' }}>
            <Stack spacing={1.5}>
              {Object.entries(data).map(([key, value]) => (
                <Stack key={key} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                  <Typography fontWeight={600} textTransform="capitalize">
                    {key.replace(/_/g, ' ')}
                  </Typography>
                  <Typography color="text.secondary">{String(value)}</Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        ) : (
          <EmptyState title="No data available" description="The backend has not returned any statistics yet." />
        )}

        <Alert severity="info">Statistics are rendered only when the backend returns structured data.</Alert>
      </Stack>
    </DashboardLayout>
  );
};

export default Statistics;
