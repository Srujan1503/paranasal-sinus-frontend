import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DashboardLayout from '../layouts/DashboardLayout';
import EmptyState from '../components/dashboard/EmptyState';
import { uploadScan } from '../services/api';

const acceptedExtensions = ['.nrrd', '.nii', '.nii.gz', '.dcm', '.png', '.jpg', '.jpeg'];

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadController, setUploadController] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (uploadController) {
        uploadController.abort();
      }
    };
  }, [previewUrl, uploadController]);

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      return false;
    }

    const name = selectedFile.name.toLowerCase();
    const isSupported = acceptedExtensions.some((extension) => name.endsWith(extension)) || name.endsWith('.nii.gz');

    if (!isSupported) {
      setError('Unsupported file type. Please upload a supported medical scan.');
      return false;
    }

    return true;
  };

  const handleFileSelection = (selectedFile) => {
    if (!selectedFile) return;

    if (!validateFile(selectedFile)) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setError('');
    setFile(selectedFile);
    setProgress(0);

    if (selectedFile.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl('');
    }
  };

  const handleBrowse = (event) => {
    const selectedFile = event.target.files?.[0];
    handleFileSelection(selectedFile);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const selectedFile = event.dataTransfer.files?.[0];
    handleFileSelection(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please choose a supported scan file first.');
      return;
    }

    setLoading(true);
    setError('');
    setProgress(0);

    const controller = new AbortController();
    setUploadController(controller);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadScan(formData, {
        onUploadProgress: (event) => {
          if (!event.total) return;
          setProgress(Math.round((event.loaded * 100) / event.total));
        },
        signal: controller.signal,
      });

      navigate('/prediction-results', { state: { result, fileName: file.name } });
    } catch (err) {
      if (err?.name === 'CanceledError' || err?.message === 'canceled') {
        setError('Upload canceled.');
      } else {
        setError(err?.message || 'Upload failed.');
      }
    } finally {
      setLoading(false);
      setProgress(0);
      setUploadController(null);
    }
  };

  const handleCancel = () => {
    if (uploadController) {
      uploadController.abort();
    }
  };

  return (
    <DashboardLayout title="Upload Scan">
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={700} color="primary.dark">
          Upload Medical Scan
        </Typography>

        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(18px)' }}>
          <Stack spacing={2.5}>
            {error ? <Alert severity={error === 'Upload canceled.' ? 'info' : 'error'}>{error}</Alert> : null}

            <Box
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              sx={{
                border: '2px dashed',
                borderColor: dragActive ? 'primary.main' : 'divider',
                borderRadius: 3,
                p: 4,
                textAlign: 'center',
                background: dragActive ? 'rgba(15,118,110,0.08)' : 'linear-gradient(135deg, rgba(15,118,110,0.08), rgba(37,99,235,0.08))',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <CloudUploadOutlinedIcon color="primary" sx={{ fontSize: 42 }} />
              <Typography variant="h6" fontWeight={600} mt={1}>
                Drag and drop or choose a scan file
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Supported files: .nrrd, .nii, .nii.gz, .dcm, .png, .jpg, .jpeg
              </Typography>
              <Button component="label" variant="contained" sx={{ mt: 2 }}>
                Browse Files
                <input ref={inputRef} hidden type="file" accept=".nrrd,.nii,.nii.gz,.dcm,.png,.jpg,.jpeg" onChange={handleBrowse} />
              </Button>
            </Box>

            {file ? (
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    {previewUrl ? (
                      <Box component="img" src={previewUrl} alt="Preview" sx={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 2 }} />
                    ) : (
                      <Box sx={{ width: 88, height: 88, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
                        {file.name.toLowerCase().endsWith('.dcm') || file.name.toLowerCase().endsWith('.nii') || file.name.toLowerCase().endsWith('.nii.gz') || file.name.toLowerCase().endsWith('.nrrd') ? (
                          <DescriptionOutlinedIcon color="primary" sx={{ fontSize: 36 }} />
                        ) : (
                          <ImageOutlinedIcon color="primary" sx={{ fontSize: 36 }} />
                        )}
                      </Box>
                    )}
                    <Box>
                      <Typography fontWeight={600}>{file.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatBytes(file.size)} • {file.type || 'Medical scan'}
                      </Typography>
                    </Box>
                  </Stack>
                  <Chip label="Ready for upload" color="primary" variant="outlined" />
                </Stack>
              </Paper>
            ) : (
              <EmptyState title="No file selected" description="Select a medical scan to begin analysis." />
            )}

            {loading ? (
              <Box>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Uploading… {progress}%
                </Typography>
              </Box>
            ) : null}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="contained" size="large" onClick={handleAnalyze} disabled={loading || !file}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Analyze Scan'}
              </Button>
              {loading ? (
                <Button variant="outlined" size="large" onClick={handleCancel}>
                  Cancel Upload
                </Button>
              ) : null}
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </DashboardLayout>
  );
};

export default Upload;
