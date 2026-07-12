import { Avatar, Box, Container, Paper, Stack, Typography } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { motion } from 'framer-motion';

const AuthShell = ({ title, subtitle, children }) => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background:
        'radial-gradient(circle at top left, rgba(92, 212, 207, 0.2), transparent 30%), linear-gradient(135deg, #f8fcff 0%, #eef8ff 45%, #ecfdfb 100%)',
      px: { xs: 2, sm: 3 },
      py: { xs: 3, sm: 5 },
    }}
  >
    <Container maxWidth="sm">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 4,
            background: 'rgba(255,255,255,0.78)',
            backdropFilter: 'blur(22px)',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 24px 80px rgba(15, 23, 42, 0.12)',
          }}
        >
          <Stack spacing={2} alignItems="center" mb={3}>
            <Avatar
              sx={{
                width: 68,
                height: 68,
                bgcolor: 'primary.main',
                boxShadow: '0 14px 36px rgba(31, 122, 140, 0.24)',
              }}
            >
              <LocalHospitalIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight={700} color="primary.dark" textAlign="center">
              Paranasal Sinus AI
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 340 }}>
              {subtitle}
            </Typography>
          </Stack>

          {title ? (
            <Typography variant="h5" fontWeight={600} color="text.primary" mb={2.5} textAlign="center">
              {title}
            </Typography>
          ) : null}

          {children}
        </Paper>
      </motion.div>
    </Container>
  </Box>
);

export default AuthShell;
