import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, Animated} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
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
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCopy = () => {
    const textToCopy = `${title}\n\nDosage: ${result}\n\nInstructions:\n${instructions}`;
    Clipboard.setString(textToCopy);

    if (onCopy) {
      onCopy();
    }
    Alert.alert('Copied!', 'Result copied to clipboard');
  };

  if (error) {
    return (
      <Animated.View
        style={[
          styles.card,
          styles.errorCard,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{translateY: slideAnim}],
        },
      ]}>
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

        <TouchableOpacity style={styles.secondaryButton} onPress={handleCopy}>
          <Text style={styles.secondaryButtonText}>Copy Result</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
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
