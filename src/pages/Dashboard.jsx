import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';
import EmptyState from '../components/dashboard/EmptyState';
import { getStatistics } from '../services/api';

const normalizeStatistics = (payload) => {
  if (!payload || (Array.isArray(payload) && payload.length === 0)) {
    return null;
  }

  const flattened = {};

  const traverse = (value, prefix = '') => {
    if (value == null || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => traverse(item, `${prefix}[${index}]`));
      return;
    }

    if (typeof value === 'object') {
      Object.entries(value).forEach(([key, child]) => {
        const nextKey = prefix ? `${prefix}.${key}` : key;
        traverse(child, nextKey);
      });
      return;
    }

    if (prefix) {
      flattened[prefix] = value;
    }
  };

  traverse(payload);

  const labels = ['total_scans', 'totalScans', 'total', 'total scans', 'scans_total'];
  const severityLabels = {
    total: labels,
    normal: ['normal', 'normal_count', 'normal_scans'],
    mild: ['mild', 'mild_count', 'mild_scans'],
    moderate: ['moderate', 'moderate_count', 'moderate_scans'],
    severe: ['severe', 'severe_count', 'severe_scans'],
  };

  const findValue = (searchLabels) => {
    const entries = Object.entries(flattened);
    const match = entries.find(([key]) => searchLabels.some((label) => key.toLowerCase().includes(label.toLowerCase())));
    return match ? Number(match[1]) : null;
  };

  const normalized = {
    total: findValue(severityLabels.total),
    normal: findValue(severityLabels.normal),
    mild: findValue(severityLabels.mild),
    moderate: findValue(severityLabels.moderate),
    severe: findValue(severityLabels.severe),
  };

  const hasData = Object.values(normalized).some((value) => value !== null && value !== undefined);

  return hasData ? normalized : null;
};

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadStatistics = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getStatistics();
        if (!mounted) return;

        const normalized = normalizeStatistics(response);
        setStatistics(normalized);
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'Unable to load statistics right now.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadStatistics();

    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(
    () => [
      { label: 'Total Scans', value: statistics?.total ?? 0, color: 'primary.main' },
      { label: 'Normal', value: statistics?.normal ?? 0, color: 'success.main' },
      { label: 'Mild', value: statistics?.mild ?? 0, color: 'info.main' },
      { label: 'Moderate', value: statistics?.moderate ?? 0, color: 'warning.main' },
      { label: 'Severe', value: statistics?.severe ?? 0, color: 'error.main' },
    ],
    [statistics],
  );

  return (
    <DashboardLayout title="Dashboard">
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1.5}>
          <Box>
            <Typography variant="h5" fontWeight={700} color="primary.dark">
              Clinical Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review the latest scan statistics directly from the connected backend.
            </Typography>
          </Box>
          <Chip label="Live backend data" color="primary" variant="outlined" />
        </Stack>

        {loading ? (
          <Grid container spacing={2.5}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <Paper sx={{ p: 2.5, borderRadius: 3, background: 'rgba(255,255,255,0.8)' }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="rectangular" height={48} sx={{ mt: 1.5, borderRadius: 2 }} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Alert severity="info">{error}</Alert>
        ) : !statistics ? (
          <EmptyState title="No statistics available." description="The backend did not return any statistics yet." />
        ) : (
          <Grid container spacing={2.5}>
            {cards.map((card) => (
              <Grid item xs={12} sm={6} md={2.4} key={card.label}>
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(18px)',
                    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
                    border: '1px solid rgba(255,255,255,0.7)',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {card.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color={card.color}>
                    {card.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </DashboardLayout>
  );
};

export default Dashboard;
