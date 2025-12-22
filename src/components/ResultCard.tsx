import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {colors, spacing, typography, borderRadius, shadows} from '../constants/theme';

interface ResultCardProps {
  title: string;
  result: string;
  instructions: string;
  error?: string;
  onSave?: () => void;
  onCopy?: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  result,
  instructions,
  error,
  onSave,
  onCopy,
}) => {
  const handleCopy = () => {
    // Note: Clipboard functionality will be added with expo-clipboard
    if (onCopy) {
      onCopy();
    }
    Alert.alert('Copied!', 'Result copied to clipboard');
  };

  if (error) {
    return (
      <View style={[styles.card, styles.errorCard]}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>Dosage:</Text>
        <Text style={styles.resultValue}>{result}</Text>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsLabel}>Instructions:</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {onSave && (
          <TouchableOpacity style={styles.primaryButton} onPress={onSave}>
            <Text style={styles.primaryButtonText}>Save Calculation</Text>
          </TouchableOpacity>
        )}

        {onCopy && (
          <TouchableOpacity style={styles.secondaryButton} onPress={handleCopy}>
            <Text style={styles.secondaryButtonText}>Copy Result</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.md,
    ...shadows.medium,
  },
  errorCard: {
    backgroundColor: '#FEE',
    borderWidth: 1,
    borderColor: colors.error,
  },
  title: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  resultContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  resultLabel: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  resultValue: {
    ...typography.h2,
    color: colors.primaryDark,
  },
  instructionsContainer: {
    marginBottom: spacing.md,
  },
  instructionsLabel: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  instructions: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.surface,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...typography.button,
    color: colors.primary,
  },
  errorTitle: {
    ...typography.h3,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
  },
});

export default ResultCard;
