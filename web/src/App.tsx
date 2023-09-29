import { useState } from 'react';
import { Add } from '@mui/icons-material';
import { Box, Fab } from '@mui/material';
import LotteryList from './components/LotteryList';
import useLotteries from './hooks/useLotteries';
import AddLotteryModal from './components/AddLotteryModal';
import LotteryNotification from './components/LotteryNotification';
import RegisterModal from './components/RegisterModal';

function App() {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
  });
  const [addLotteryModalOpen, setAddLotteryModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedLotteries, setSelectedLotteries] = useState<Array<string>>([]);
  const lotteries = useLotteries();

  const handleNewLottery = () => {
    setNotification({ open: true, message: 'New lottery created' });
    setSelectedLotteries([]);
    lotteries.fetchLotteries();
  };

  const handleRegister = () => {
    setSelectedLotteries([]);
    setNotification({ open: true, message: 'Registered to lotteries' });
  };

  const handleSelect = (lotteryId: string) => {
    setSelectedLotteries((lotteries) => {
      if (lotteries.includes(lotteryId)) {
        const index = lotteries.indexOf(lotteryId);
        return [...lotteries.slice(0, index), ...lotteries.slice(index + 1)];
      } else {
        return [...lotteries, lotteryId];
      }
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
      }}
    >
      <LotteryList
        lotteries={lotteries.data}
        selectedLotteries={selectedLotteries}
        loading={lotteries.loading}
        onSelect={handleSelect}
      />
      <RegisterModal
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSubmit={handleRegister}
        selectedLotteries={selectedLotteries}
      />
      <AddLotteryModal
        open={addLotteryModalOpen}
        onClose={() => setAddLotteryModalOpen(false)}
        onSubmit={handleNewLottery}
      />
      <LotteryNotification
        open={notification.open}
        message={notification.message}
        onClose={() => setNotification({ open: false, message: '' })}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
        }}
      >
        <Fab
          size="large"
          variant="extended"
          disabled={selectedLotteries.length === 0}
          onClick={() => setRegisterModalOpen(true)}
          sx={{ mr: 2 }}
        >
          Register
        </Fab>
        <Fab
          color="primary"
          size="large"
          variant="extended"
          onClick={() => setAddLotteryModalOpen(true)}
        >
          <Add sx={{ mr: 1 }} />
          Add lottery
        </Fab>
      </Box>
    </Box>
  );
}

export default App;
