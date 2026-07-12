import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import AuthShell from '../components/auth/AuthShell';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await forgotPassword(email);
      const message = 'Reset instructions have been sent to your email.';
      setSuccess(message);
      toast.success(message);
    } catch (err) {
      const message = err?.message || 'Unable to send a reset link right now.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Reset Password" subtitle="We will send you a secure reset link for your account.">
      <Stack spacing={2.5}>
        {error ? (
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        ) : null}
        {success ? (
          <Alert severity="success" variant="outlined">
            {success}
          </Alert>
        ) : null}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              fullWidth
              autoComplete="email"
            />

            <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.2, borderRadius: 2 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Send Reset Link'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          <Link component={RouterLink} to="/login" color="primary.main" fontWeight={600}>
            Back to Login
          </Link>
        </Typography>
      </Stack>
    </AuthShell>
  );
};

export default ForgotPassword;
