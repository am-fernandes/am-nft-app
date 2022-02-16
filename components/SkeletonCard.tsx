import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function SkeletonCard() {
  return (
    <Stack spacing={1}>
      <Skeleton variant="text" animation="pulse" />
      <Skeleton variant="circular" animation="pulse" width={40} height={40} />
      <Skeleton variant="rectangular" animation="pulse" height={250} />
    </Stack>
  );
}