import { Box, CircularProgress, Typography } from '@mui/material';
import LotteryCard from './LotteryCard';
import { Lottery } from '../types';
import { Casino, SentimentVeryDissatisfied } from '@mui/icons-material';

interface Props {
  lotteries: Array<Lottery>;
  selectedLotteries: Array<string>;
  loading: boolean;
  onSelect: (lotteryId: string) => void;
}

export default function LotteryList({
  lotteries,
  selectedLotteries,
  onSelect,
  loading,
}: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography
        sx={{
          my: 8,
        }}
        variant="h1"
      >
        Lotteries
        <Casino sx={{ ml: 4, fontSize: 60 }} />
      </Typography>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          maxWidth: '1000px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
          alignContent: 'flex-start',
        }}
      >
        {loading && <CircularProgress size="8rem" />}
        {lotteries.length === 0 && !loading && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: 8,
            }}
          >
            <SentimentVeryDissatisfied sx={{ fontSize: 48, mb: 4 }} />
            <Typography variant="h4">
              There are no lotteries currently
            </Typography>
          </Box>
        )}
        {lotteries.map((lottery) => (
          <LotteryCard
            key={lottery.id}
            lottery={lottery}
            selected={selectedLotteries.includes(lottery.id)}
            onSelect={() => onSelect(lottery.id)}
          />
        ))}
      </Box>
    </Box>
  );
}
