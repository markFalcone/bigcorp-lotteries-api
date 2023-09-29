import { Snackbar } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NewLotteryNotification({ open, onClose }: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      message="New lottery created"
    />
  );
}