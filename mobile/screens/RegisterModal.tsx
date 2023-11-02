import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import useLotteryRegister from '../hooks/useLotteryRegister';
import { colors } from '../colors';
import { RegisterScreenRouteProp } from '../types';

const registerSchema = Yup.object({
  name: Yup.string().min(4).required(),
});

const RegisterModal = () => {
  const { error, loading, registerToLotteries } = useLotteryRegister();
  const route = useRoute<RegisterScreenRouteProp>();
  const navigation = useNavigation();

  const selectedLotteries = route.params?.selectedLotteries;

  const handleClose = () => {
    navigation.goBack();
  };

  const formik = useFormik({
    validationSchema: registerSchema,
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      name: '',
    },
    onSubmit: async ({ name }) => {
      await registerToLotteries({ name, lotteries: selectedLotteries });
      handleClose();
    },
  });

  const backgroundColor = !formik.isValid
    ? colors.grey
    : colors.buttonSecondary;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register to lotteries</Text>
      <TextInput
        accessibilityLabel="Text input field"
        placeholder="Enter your name"
        onChangeText={formik.handleChange('name')}
        onBlur={formik.handleBlur('name')}
        value={formik.values.name}
        style={styles.input}
      />
      {formik.touched.name && formik.errors.name ? (
        <Text>{formik.errors.name}</Text>
      ) : null}
      <Pressable
        accessibilityRole="button"
        style={[styles.button, { backgroundColor }]}
        onPress={() => formik.handleSubmit()}
        disabled={!formik.isValid}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </Pressable>
      {error ? <Text style={styles.error}>error</Text> : null}
    </View>
  );
};

export default RegisterModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
  },
  input: {
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    fontSize: 16,
    width: 300,
  },
  button: {
    marginTop: 32,
    width: 120,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    fontSize: 10,
    color: colors.danger,
    paddingTop: 8,
  },
});
