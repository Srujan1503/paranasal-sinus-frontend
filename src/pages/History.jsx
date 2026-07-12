import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Pagination,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import DashboardLayout from '../layouts/DashboardLayout';
import EmptyState from '../components/dashboard/EmptyState';
import { downloadMask, downloadOverlay, downloadReport, getHistory } from '../services/api';

const PAGE_SIZE = 5;

const normalizeHistory = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
};

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getHistory();
        if (mounted) {
          setHistory(normalizeHistory(response));
          setPage(1);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'Unable to load scan history right now.');
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

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return history;

    return history.filter((item) => {
      const values = [item.filename, item.severity, item.classification, item.upload_date, item.uploadDate, item.created_at, item.createdAt]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return values.includes(query);
    });
  }, [history, search]);

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / PAGE_SIZE));
  const paginatedHistory = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredHistory.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredHistory, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDownload = async (downloadFn, scanId, label) => {
    try {
      const blob = await downloadFn(scanId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${label}-${scanId || 'scan'}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.message || `Unable to download ${label}.`);
    }
  };

  return (
    <DashboardLayout title="History">
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={700} color="primary.dark">
          Scan History
        </Typography>

        {loading ? (
          <Stack spacing={1.5}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Paper key={index} sx={{ p: 2.5, borderRadius: 3, background: 'rgba(255,255,255,0.8)' }}>
                <Skeleton variant="text" width="45%" height={28} />
                <Skeleton variant="text" width="35%" height={24} sx={{ mt: 1 }} />
                <Skeleton variant="rectangular" height={44} sx={{ mt: 2, borderRadius: 2 }} />
              </Paper>
            ))}
          </Stack>
        ) : error ? (
          <EmptyState title="Unable to load history" description={error} />
        ) : history.length === 0 ? (
          <EmptyState title="No scans uploaded yet." description="No scan history has been returned by the backend yet." />
        ) : (
          <>
            <TextField
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by filename or severity"
              fullWidth
              size="small"
            />

            {filteredHistory.length === 0 ? (
              <EmptyState title="No matching scans" description="Try a different search term." />
            ) : (
              <Stack spacing={1.5}>
                {paginatedHistory.map((item, index) => (
                  <Paper key={item.id || `${item.filename || 'history'}-${index}`} sx={{ p: 2.5, borderRadius: 3, background: 'rgba(255,255,255,0.8)' }}>
                    <Stack spacing={2}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5}>
                        <Box>
                          <Typography fontWeight={600}>{item.filename || `Scan ${index + 1}`}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.upload_date || item.uploadDate || item.created_at || item.createdAt || 'Uploaded recently'}
                          </Typography>
                        </Box>
                        <Chip label={item.severity || item.classification || 'Pending'} color="primary" variant="outlined" />
                      </Stack>

                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} flexWrap="wrap">
                        <Typography variant="body2" color="text.secondary">
                          <strong>Confidence:</strong> {item.confidence ?? 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Severity:</strong> {item.severity || item.classification || 'N/A'}
                        </Typography>
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        <Button variant="outlined" startIcon={<DownloadOutlinedIcon />} onClick={() => handleDownload(downloadReport, item.id, 'report')}>
                          Download Report
                        </Button>
                        <Button variant="outlined" startIcon={<DownloadOutlinedIcon />} onClick={() => handleDownload(downloadMask, item.id, 'mask')}>
                          Download Mask
                        </Button>
                        <Button variant="outlined" startIcon={<DownloadOutlinedIcon />} onClick={() => handleDownload(downloadOverlay, item.id, 'overlay')}>
                          Download Overlay
                        </Button>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}

            {filteredHistory.length > PAGE_SIZE ? (
              <Stack alignItems="center">
                <Pagination count={totalPages} page={page - 1} onChange={(_, value) => setPage(value)} color="primary" />
              </Stack>
            ) : null}
          </>
        )}
      </Stack>
    </DashboardLayout>
  );
};

export default History;
