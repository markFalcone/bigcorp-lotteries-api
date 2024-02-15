import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { colors } from '../colors';

const callstackWebsiteUrl = 'https://www.callstack.com/';

export const About = () => {
  const toast = useToast();

  const onPress = async () => {
    const supported = await Linking.canOpenURL(callstackWebsiteUrl);
    if (supported) {
      await Linking.openURL(callstackWebsiteUrl);
    } else {
      toast.show('Whoops! App was unable to navigate to Callstack website...', {
        type: 'danger',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text>Created by the Callstack Team</Text>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onPress}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Callstack website</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  button: {
    marginTop: 12,
  },
  buttonText: {
    color: colors.buttonPrimary,
  },
});
