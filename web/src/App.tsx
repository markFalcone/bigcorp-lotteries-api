import { useEffect, useState } from 'react';
import { Add } from '@mui/icons-material';
import { Box, Fab } from '@mui/material';
import AddLotteryModal from './components/AddLotteryModal';
import { useNewLottery } from './hooks/useNewLottery';
import NewLotteryNotification from './components/NewLotteryNotification';

function App() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [addLotteryModalOpen, setAddLotteryModalOpen] = useState(false);
  const { loading, error, lottery, createNewLottery, resetLottery } =
    useNewLottery();

  useEffect(() => {
    if (lottery) {
      setNotificationOpen(true);
    }
  }, [lottery]);

  const handleModalClose = () => {
    setAddLotteryModalOpen(false);
    resetLottery();
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <AddLotteryModal
        open={addLotteryModalOpen}
        onClose={handleModalClose}
        loading={loading}
        error={error}
        createNewLottery={createNewLottery}
      />
      <NewLotteryNotification
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
      <Fab
        color="primary"
        size="large"
        variant="extended"
        sx={{ position: 'absolute', bottom: 32, right: 32 }}
        onClick={() => setAddLotteryModalOpen(true)}
      >
        <Add sx={{ mr: 1 }} />
        Add lottery
      </Fab>
    </Box>
  );
}

export default App;