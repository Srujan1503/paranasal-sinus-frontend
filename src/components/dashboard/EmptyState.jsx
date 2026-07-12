import { Box, Button, Stack, Typography } from '@mui/material';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';

const EmptyState = ({ title = 'No data available', description, actionLabel, onAction }) => (
  <Box
    sx={{
      border: '1px dashed',
      borderColor: 'divider',
      borderRadius: 3,
      p: { xs: 3, md: 4 },
      textAlign: 'center',
      background: 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(16px)',
    }}
  >
    <Stack spacing={1.5} alignItems="center">
      <Box
        sx={{
          width: 54,
          height: 54,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(15,118,110,0.14), rgba(37,99,235,0.16))',
          color: 'primary.main',
        }}
      >
        <MedicalServicesOutlinedIcon fontSize="large" />
      </Box>
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
          {description}
        </Typography>
      ) : null}
      {actionLabel && onAction ? (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Stack>
  </Box>
);

export default EmptyState;
