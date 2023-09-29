import { Snackbar } from '@mui/material';

interface Props {
  open: boolean;
  message: string;
  onClose: () => void;
}

export default function NewLotteryNotification({
  open,
  message,
  onClose,
}: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      message={message}
    />
  );
}
