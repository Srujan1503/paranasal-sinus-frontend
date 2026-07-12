import { useEffect, useState } from 'react';
import { Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import DashboardLayout from '../layouts/DashboardLayout';
import EmptyState from '../components/dashboard/EmptyState';
import { downloadReport, getHistory } from '../services/api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getHistory();
        if (mounted) {
          setReports(Array.isArray(response) ? response : response?.results || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'Unable to load reports.');
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

  const handleDownload = async (scanId) => {
    try {
      const blob = await downloadReport(scanId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${scanId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.message || 'Unable to download report.');
    }
  };

  return (
    <DashboardLayout title="Reports">
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={700} color="primary.dark">
          Clinical Reports
        </Typography>

        {loading ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, background: 'rgba(255,255,255,0.8)' }}>
            <CircularProgress />
            <Typography variant="body1" color="text.secondary" mt={2}>
              Loading reports…
            </Typography>
          </Paper>
        ) : error ? (
          <EmptyState title="Unable to load reports" description={error} />
        ) : reports.length === 0 ? (
          <EmptyState title="No data available" description="No report-ready scans are available yet." />
        ) : (
          <Stack spacing={1.5}>
            {reports.map((report, index) => (
              <Paper key={report.id || `${report.filename || 'report'}-${index}`} sx={{ p: 2.5, borderRadius: 3, background: 'rgba(255,255,255,0.8)' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5}>
                  <Box>
                    <Typography fontWeight={600}>{report.filename || `Review ${index + 1}`}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {report.severity || report.classification || 'Ready for review'}
                    </Typography>
                  </Box>
                  <Button variant="outlined" startIcon={<DownloadOutlinedIcon />} onClick={() => handleDownload(report.id)}>
                    Download Report
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </DashboardLayout>
  );
};

export default Reports;
