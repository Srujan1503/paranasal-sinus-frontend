import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
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

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back! You are now signed in.');
      navigate('/dashboard');
    } catch (err) {
      const message = err?.message || 'Unable to sign in right now.';
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
    <AuthShell title="Sign In" subtitle="AI-Powered Paranasal Sinus Disease Detection">
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
              autoComplete="current-password"
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

            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />}
                label="Remember me"
              />
              <Link component={RouterLink} to="/forgot-password" underline="hover" color="primary.main" fontWeight={600}>
                Forgot password?
              </Link>
            </Stack>

            <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.2, borderRadius: 2 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Login'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} to="/signup" color="primary.main" fontWeight={600}>
            Sign up
          </Link>
        </Typography>
      </Stack>
    </AuthShell>
  );
};

export default Login;
