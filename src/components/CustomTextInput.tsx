import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import {colors, spacing, typography, borderRadius} from '../constants/theme';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: object;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  containerStyle,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          isFocused ? styles.inputFocused : null,
        ]}
        placeholderTextColor={colors.textLight}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...textInputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default CustomTextInput;
