import {
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import LotteryCard from './LotteryCard';
import { Lottery } from '../types';
import { Casino, SentimentVeryDissatisfied, Search } from '@mui/icons-material';
import { useState } from 'react';

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
  const [filter, setFilter] = useState('');

  const filteredLotteries = lotteries.filter((lottery) =>
    lottery.name.includes(filter),
  );

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
      <TextField
        value={filter}
        onChange={(e) => setFilter(e.currentTarget.value)}
        placeholder="Filter lotteries"
        sx={{ width: 400, mb: 4 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search />
            </InputAdornment>
          ),
        }}
      />
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
        {lotteries.length !== 0 && filteredLotteries.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: 8,
            }}
          >
            <Typography variant="h4">
              No search results for '{filter}'
            </Typography>
          </Box>
        )}
        {filteredLotteries.map((lottery) => (
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
