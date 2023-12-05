import { LoadingButton } from '@mui/lab';
import { Box, Modal, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useLotteryRegister from '../hooks/useLotteryRegister';

const registerSchema = Yup.object({
  name: Yup.string().min(4).required(),
});

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  selectedLotteries: Array<string>;
}

export default function RegisterModal({
  open,
  onClose,
  onSubmit,
  selectedLotteries,
}: Props) {
  const { error, loading, registerToLotteries } = useLotteryRegister();
  const handleClose = () => {
    formik.resetForm();
    onClose();
  };
  const formik = useFormik({
    validationSchema: registerSchema,
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      name: '',
    },
    onSubmit: ({ name }) => {
      registerToLotteries({ name, lotteries: selectedLotteries })
        .then(() => {
          onSubmit();
          handleClose();
        })
        .catch(() => {
          // Noop! Handled elsewhere.
        });
    },
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            pt: 4,
            px: 6,
            pb: 3,
          }}
        >
          <Typography variant="h5" sx={{ mb: 4 }}>
            Register for a lottery
          </Typography>
          <TextField
            sx={{ mb: 4 }}
            fullWidth
            label="Enter your name"
            variant="standard"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            error={Boolean(formik.errors.name && formik.touched.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          {error && (
            <Typography sx={{ mb: 2 }} color="red">
              {error}
            </Typography>
          )}
          <LoadingButton
            loading={loading}
            color="primary"
            variant="contained"
            type="submit"
            disabled={!formik.isValid}
          >
            Register
          </LoadingButton>
        </Box>
      </form>
    </Modal>
  );
}
