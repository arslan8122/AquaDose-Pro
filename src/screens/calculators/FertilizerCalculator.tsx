import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import CustomTextInput from '../../components/CustomTextInput';
import CustomPicker from '../../components/CustomPicker';
import ResultCard from '../../components/ResultCard';
import {calculateFertilizerDosing, FertilizerInputs} from '../../utils/calculators';
import {colors, spacing, typography, borderRadius} from '../../constants/theme';
import {useApp} from '../../context/AppContext';

// Tank size presets
const TANK_SIZES = [
  {label: '10g', value: 10},
  {label: '20g', value: 20},
  {label: '29g', value: 29},
  {label: '40g', value: 40},
  {label: '55g', value: 55},
  {label: '75g', value: 75},
  {label: 'Custom', value: 0},
];

const FertilizerCalculator = () => {
  const {addCalculation} = useApp();
  const [tankVolume, setTankVolume] = useState('');
  const [volumeUnit, setVolumeUnit] = useState<'gallons' | 'liters'>('gallons');
  const [desiredPPM, setDesiredPPM] = useState('');
  const [productConcentration, setProductConcentration] = useState('');
  const [concentrationType, setConcentrationType] = useState<'percentage' | 'ppm'>('percentage');
  const [result, setResult] = useState<any>(null);

  const handlePresetSelect = (value: number) => {
    if (value > 0) {
      setTankVolume(value.toString());
    }
  };

  const handleCalculate = () => {
    const inputs: FertilizerInputs = {
      tankVolume: parseFloat(tankVolume),
      volumeUnit,
      desiredPPM: parseFloat(desiredPPM),
      productConcentration: parseFloat(productConcentration),
      concentrationType,
    };

    const calculationResult = calculateFertilizerDosing(inputs);
    setResult(calculationResult);
  };

  const handleSave = () => {
    if (result && !result.error) {
      addCalculation({
        type: 'fertilizer',
        inputs: {
          tankVolume,
          volumeUnit,
          desiredPPM,
          productConcentration,
          concentrationType,
        },
        result: result.formattedDosage,
        notes: result.instructions,
      });
    }
  };

  const isFormValid = tankVolume && desiredPPM && productConcentration;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Fertilizer Dosing Calculator</Text>
        <Text style={styles.description}>
          Calculate precise fertilizer dosing for your planted tank based on desired PPM
          and product concentration.
        </Text>

        {/* Tank Size Presets */}
        <View style={styles.presetsContainer}>
          <Text style={styles.presetsLabel}>Quick Select Tank Size:</Text>
          <View style={styles.presetButtons}>
            {TANK_SIZES.map(size => (
              <TouchableOpacity
                key={size.value}
                style={[
                  styles.presetButton,
                  tankVolume === size.value.toString() && styles.presetButtonActive,
                ]}
                onPress={() => handlePresetSelect(size.value)}>
                <Text
                  style={[
                    styles.presetButtonText,
                    tankVolume === size.value.toString() &&
                      styles.presetButtonTextActive,
                  ]}>
                  {size.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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

        <CustomTextInput
          label="Desired PPM"
          value={desiredPPM}
          onChangeText={setDesiredPPM}
          keyboardType="numeric"
          placeholder="e.g., 10"
        />

        <CustomTextInput
          label="Product Concentration"
          value={productConcentration}
          onChangeText={setProductConcentration}
          keyboardType="numeric"
          placeholder={concentrationType === 'percentage' ? 'e.g., 5' : 'e.g., 10000'}
        />

        <CustomPicker
          label="Concentration Type"
          options={[
            {label: 'Percentage (%)', value: 'percentage'},
            {label: 'PPM', value: 'ppm'},
          ]}
          selectedValue={concentrationType}
          onValueChange={value => setConcentrationType(value as 'percentage' | 'ppm')}
        />

        <TouchableOpacity
          style={[styles.calculateButton, !isFormValid && styles.calculateButtonDisabled]}
          onPress={handleCalculate}
          disabled={!isFormValid}>
          <Text style={styles.calculateButtonText}>Calculate Dosage</Text>
        </TouchableOpacity>

        {result && (
          <ResultCard
            title="Fertilizer Dosage"
            result={result.formattedDosage}
            instructions={result.instructions}
            error={result.error}
            onSave={!result.error ? handleSave : undefined}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  presetsContainer: {
    marginBottom: spacing.lg,
  },
  presetsLabel: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  presetButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  presetButtonActive: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.secondary,
  },
  presetButtonText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  presetButtonTextActive: {
    color: colors.secondaryDark,
    fontWeight: '600',
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

export default FertilizerCalculator;
