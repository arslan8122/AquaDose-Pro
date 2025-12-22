import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {colors, spacing, typography, borderRadius, shadows} from '../constants/theme';
import FertilizerCalculator from './calculators/FertilizerCalculator';
import MedicationCalculator from './calculators/MedicationCalculator';
import ConditionerCalculator from './calculators/ConditionerCalculator';
import SalinityCalculator from './calculators/SalinityCalculator';

type CalculatorType = 'fertilizer' | 'medication' | 'conditioner' | 'salinity' | null;

const CalculatorScreen = () => {
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorType>(null);

  const renderCalculatorSelector = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AquaDose Calculator</Text>
        <Text style={styles.subtitle}>
          Select a calculator type to get started
        </Text>
      </View>

      <View style={styles.selectorContainer}>
        <TouchableOpacity
          style={[styles.calculatorCard, styles.fertilizerCard]}
          onPress={() => setSelectedCalculator('fertilizer')}>
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>🌱</Text>
          </View>
          <Text style={styles.cardTitle}>Fertilizer Dosing</Text>
          <Text style={styles.cardDescription}>
            Calculate precise NPK and micronutrient dosing for planted tanks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.calculatorCard, styles.medicationCard]}
          onPress={() => setSelectedCalculator('medication')}>
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>💊</Text>
          </View>
          <Text style={styles.cardTitle}>Medication Dosing</Text>
          <Text style={styles.cardDescription}>
            Precise medication dosing for treating fish diseases
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.calculatorCard, styles.conditionerCard]}
          onPress={() => setSelectedCalculator('conditioner')}>
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>💧</Text>
          </View>
          <Text style={styles.cardTitle}>Water Conditioner</Text>
          <Text style={styles.cardDescription}>
            Calculate conditioner needed for water changes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.calculatorCard, styles.salinityCard]}
          onPress={() => setSelectedCalculator('salinity')}>
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>🌊</Text>
          </View>
          <Text style={styles.cardTitle}>Salinity Adjustment</Text>
          <Text style={styles.cardDescription}>
            Calculate salt additions for marine and brackish tanks
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSelectedCalculator = () => {
    switch (selectedCalculator) {
      case 'fertilizer':
        return <FertilizerCalculator />;
      case 'medication':
        return <MedicationCalculator />;
      case 'conditioner':
        return <ConditionerCalculator />;
      case 'salinity':
        return <SalinityCalculator />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedCalculator ? (
        <View style={styles.calculatorWrapper}>
          <View style={styles.backHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedCalculator(null)}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>
          {renderSelectedCalculator()}
        </View>
      ) : (
        renderCalculatorSelector()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  title: {
    ...typography.h1,
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.surface,
    opacity: 0.9,
  },
  selectorContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  calculatorCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.medium,
    borderLeftWidth: 4,
  },
  fertilizerCard: {
    borderLeftColor: '#06D6A0',
  },
  medicationCard: {
    borderLeftColor: '#E63946',
  },
  conditionerCard: {
    borderLeftColor: '#0077BE',
  },
  salinityCard: {
    borderLeftColor: '#00A676',
  },
  cardIcon: {
    marginBottom: spacing.sm,
  },
  cardIconText: {
    fontSize: 32,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  calculatorWrapper: {
    flex: 1,
  },
  backHeader: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default CalculatorScreen;
