import { Box, Card, Typography, colors } from '@mui/material';
import { Lottery } from '../types';
import { Done, Sync } from '@mui/icons-material';

interface Props {
  lottery: Lottery;
  selected: boolean;
  onSelect: () => void;
}

const selectedStyles = {
  boxShadow: `inset 0 0 0 2px ${colors.blue[400]}`,
};

const disabledStyles = {
  backgroundColor: colors.grey[100],
};

export default function LotteryCard({ lottery, selected, onSelect }: Props) {
  const isDisabled = lottery.status === 'finished';

  const handleSelect = () => {
    if (isDisabled) {
      return;
    }

    onSelect();
  };

  return (
    <Card
      sx={{
        m: 2,
        p: 4,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        ...(isDisabled ? disabledStyles : {}),
        ...(selected ? selectedStyles : {}),
      }}
      variant="outlined"
      onClick={handleSelect}
    >
      <Typography variant="h6">{lottery.name}</Typography>
      <Typography variant="caption">{lottery.prize}</Typography>
      <Typography variant="caption">{lottery.id}</Typography>
      <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
        {lottery.status === 'running' && <Sync />}
        {lottery.status === 'finished' && <Done />}
      </Box>
    </Card>
  );
}
