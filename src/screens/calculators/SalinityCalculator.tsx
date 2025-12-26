import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import CustomTextInput from '../../components/CustomTextInput';
import CustomPicker from '../../components/CustomPicker';
import ResultCard from '../../components/ResultCard';
import {calculateSalinity, SalinityInputs} from '../../utils/calculators';
import {colors, spacing, typography, borderRadius, adSizes} from '../../constants/theme';
import {useApp} from '../../context/AppContext';

const SalinityCalculator = () => {
  const {addCalculation} = useApp();
  const [tankVolume, setTankVolume] = useState('');
  const [volumeUnit, setVolumeUnit] = useState<'gallons' | 'liters'>('gallons');
  const [currentSalinity, setCurrentSalinity] = useState('');
  const [targetSalinity, setTargetSalinity] = useState('');
  const [salinityUnit, setSalinityUnit] = useState<'ppt' | 'sg'>('sg');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const inputs: SalinityInputs = {
      tankVolume: parseFloat(tankVolume),
      volumeUnit,
      currentSalinity: parseFloat(currentSalinity),
      targetSalinity: parseFloat(targetSalinity),
      salinityUnit,
    };

    const calculationResult = calculateSalinity(inputs);
    setResult(calculationResult);
  };

  const handleSave = () => {
    if (result && !result.error) {
      addCalculation({
        type: 'salinity',
        inputs: {
          tankVolume,
          volumeUnit,
          currentSalinity,
          targetSalinity,
          salinityUnit,
        },
        result: result.formattedAmount || 'No adjustment needed',
        notes: result.instructions,
      });
    }
  };

  const getResultDisplay = () => {
    if (!result) return null;

    if (result.action === 'add') {
      return (
        <ResultCard
          title="Salt Adjustment"
          result={`Add ${result.formattedAmount}`}
          instructions={result.instructions}
          error={result.error}
          onSave={!result.error ? handleSave : undefined}
        />
      );
    } else if (result.action === 'remove') {
      return (
        <ResultCard
          title="Water Dilution"
          result={`Remove ${result.waterToRemoveLiters?.toFixed(2)} liters of water`}
          instructions={result.instructions}
          error={result.error}
          onSave={!result.error ? handleSave : undefined}
        />
      );
    } else {
      return (
        <ResultCard
          title="No Adjustment Needed"
          result="Salinity at target"
          instructions={result.instructions}
          error={result.error}
          onSave={!result.error ? handleSave : undefined}
        />
      );
    }
  };

  const isFormValid = tankVolume && currentSalinity && targetSalinity;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <Text style={styles.title}>Salinity Calculator</Text>
        <Text style={styles.description}>
          Calculate salt additions or water dilution needed to adjust salinity. For
          saltwater and brackish aquariums.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Reference Values:</Text>
          <Text style={styles.infoText}>• Marine: 1.025-1.026 SG (35 ppt)</Text>
          <Text style={styles.infoText}>• Brackish: 1.005-1.015 SG (5-15 ppt)</Text>
          <Text style={styles.infoText}>• Freshwater: 1.000 SG (0 ppt)</Text>
        </View>

        <CustomTextInput
          label="Tank Volume"
          value={tankVolume}
          onChangeText={setTankVolume}
          keyboardType="numeric"
          placeholder="Enter tank volume"
        />

        <CustomPicker
          label="Volume Unit"
          options={[
            {label: 'Gallons', value: 'gallons'},
            {label: 'Liters', value: 'liters'},
          ]}
          selectedValue={volumeUnit}
          onValueChange={value => setVolumeUnit(value as 'gallons' | 'liters')}
        />

        <CustomPicker
          label="Salinity Measurement"
          options={[
            {label: 'Specific Gravity (SG)', value: 'sg'},
            {label: 'Parts Per Thousand (PPT)', value: 'ppt'},
          ]}
          selectedValue={salinityUnit}
          onValueChange={value => setSalinityUnit(value as 'ppt' | 'sg')}
        />

        <CustomTextInput
          label={
            salinityUnit === 'sg' ? 'Current Specific Gravity' : 'Current Salinity (PPT)'
          }
          value={currentSalinity}
          onChangeText={setCurrentSalinity}
          keyboardType="decimal-pad"
          placeholder={salinityUnit === 'sg' ? 'e.g., 1.020' : 'e.g., 30'}
        />

        <CustomTextInput
          label={
            salinityUnit === 'sg' ? 'Target Specific Gravity' : 'Target Salinity (PPT)'
          }
          value={targetSalinity}
          onChangeText={setTargetSalinity}
          keyboardType="decimal-pad"
          placeholder={salinityUnit === 'sg' ? 'e.g., 1.025' : 'e.g., 35'}
        />

        <TouchableOpacity
          style={[styles.calculateButton, !isFormValid && styles.calculateButtonDisabled]}
          onPress={handleCalculate}
          disabled={!isFormValid}>
          <Text style={styles.calculateButtonText}>Calculate Adjustment</Text>
        </TouchableOpacity>

        {getResultDisplay()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: adSizes.bannerHeight + adSizes.bannerPadding, // Space for banner ad with gap
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: colors.primaryLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoTitle: {
    ...typography.bodySmall,
    color: colors.primaryDark,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: 2,
  },
  calculateButton: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  calculateButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  calculateButtonText: {
    ...typography.button,
    color: colors.surface,
  },
});

export default SalinityCalculator;
