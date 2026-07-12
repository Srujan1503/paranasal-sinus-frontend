import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import AuthShell from '../components/auth/AuthShell';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      const message = 'Passwords do not match.';
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, fullName);
      toast.success('Account created successfully.');
      navigate('/dashboard');
    } catch (err) {
      const message = err?.message || 'Unable to create your account right now.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      toast.success('Signed in with Google successfully.');
      navigate('/dashboard');
    } catch (err) {
      const message = err?.message || 'Google sign-in failed.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create Account" subtitle="Securely manage your sinusAI workflow with a professional account.">
      <Stack spacing={2.5}>
        {error ? (
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        ) : null}

        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
          disabled={loading}
          sx={{
            py: 1.2,
            borderRadius: 2,
            borderColor: 'divider',
            color: 'text.primary',
            backgroundColor: 'rgba(255,255,255,0.7)',
            '&:hover': { borderColor: 'primary.main', backgroundColor: 'rgba(255,255,255,0.95)' },
          }}
        >
          Continue with Google
        </Button>

        <Divider>
          <Typography color="text.secondary" variant="body2">
            OR
          </Typography>
        </Divider>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Full Name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              fullWidth
              autoComplete="email"
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((value) => !value)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword((value) => !value)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.2, borderRadius: 2 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" color="primary.main" fontWeight={600}>
            Login
          </Link>
        </Typography>
      </Stack>
    </AuthShell>
  );
};

export default Signup;
