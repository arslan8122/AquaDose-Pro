import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import CustomTextInput from '../../components/CustomTextInput';
import CustomPicker from '../../components/CustomPicker';
import ResultCard from '../../components/ResultCard';
import InfoBox from '../../components/InfoBox';
import {calculateWaterConditioner, ConditionerInputs} from '../../utils/calculators';
import {colors, spacing, typography, borderRadius, adSizes} from '../../constants/theme';
import {useApp} from '../../context/AppContext';

// Common water conditioners with their dosage rates (ml per gallon)
const COMMON_CONDITIONERS = [
  {label: 'Seachem Prime', dosage: 0.2},
  {label: 'API Stress Coat', dosage: 1.25},
  {label: 'API Tap Water Conditioner', dosage: 0.3},
  {label: 'Tetra AquaSafe', dosage: 1},
  {label: 'Custom', dosage: 0},
];

const ConditionerCalculator = () => {
  const {addCalculation} = useApp();
  const scrollViewRef = useRef<ScrollView>(null);
  const [tankVolume, setTankVolume] = useState('');
  const [volumeUnit, setVolumeUnit] = useState<'gallons' | 'liters'>('gallons');
  const [waterChangePercentage, setWaterChangePercentage] = useState('25');
  const [conditionerDoseRate, setConditionerDoseRate] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleConditionerSelect = (dosage: number) => {
    if (dosage > 0) {
      setConditionerDoseRate(dosage.toString());
    }
  };

  const handleCalculate = () => {
    const inputs: ConditionerInputs = {
      tankVolume: parseFloat(tankVolume),
      volumeUnit,
      waterChangePercentage: parseFloat(waterChangePercentage),
      conditionerDoseRate: parseFloat(conditionerDoseRate),
    };

    const calculationResult = calculateWaterConditioner(inputs);
    setResult(calculationResult);

    // Auto-scroll to result
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 100);
  };

  const handleSave = () => {
    if (result && !result.error) {
      addCalculation({
        type: 'conditioner',
        inputs: {
          tankVolume,
          volumeUnit,
          waterChangePercentage,
          conditionerDoseRate,
        },
        result: result.formattedDosage,
        notes: result.instructions,
      });

      Alert.alert(
        'Saved Successfully',
        'Your calculation has been saved to History.',
        [{text: 'OK'}]
      );
    }
  };

  const isFormValid = tankVolume && waterChangePercentage && conditionerDoseRate;

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Water Conditioner Calculator</Text>
        <Text style={styles.description}>
          Calculate the exact amount of water conditioner needed for your water change.
          Protects fish from harmful chemicals in tap water.
        </Text>

        <InfoBox
          title="💡 Pro Tip"
          message="Add water conditioner to new water BEFORE adding it to your tank. This neutralizes chlorine and chloramine immediately, protecting your fish and beneficial bacteria."
          type="tip"
        />

        {/* Common Conditioners */}
        <View style={styles.conditionersContainer}>
          <Text style={styles.conditionersLabel}>Common Conditioners:</Text>
          <View style={styles.conditionerButtons}>
            {COMMON_CONDITIONERS.map(cond => (
              <TouchableOpacity
                key={cond.label}
                style={[
                  styles.conditionerButton,
                  conditionerDoseRate === cond.dosage.toString() &&
                    styles.conditionerButtonActive,
                ]}
                onPress={() => handleConditionerSelect(cond.dosage)}>
                <Text
                  style={[
                    styles.conditionerButtonText,
                    conditionerDoseRate === cond.dosage.toString() &&
                      styles.conditionerButtonTextActive,
                  ]}>
                  {cond.label}
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
          placeholder="Enter total tank volume"
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
          label="Water Change Percentage (%)"
          value={waterChangePercentage}
          onChangeText={setWaterChangePercentage}
          keyboardType="numeric"
          placeholder="e.g., 25 for 25%"
        />

        <CustomTextInput
          label="Conditioner Dose Rate (ml per gallon)"
          value={conditionerDoseRate}
          onChangeText={setConditionerDoseRate}
          keyboardType="decimal-pad"
          placeholder="Check product label"
        />

        <TouchableOpacity
          style={[styles.calculateButton, !isFormValid && styles.calculateButtonDisabled]}
          onPress={handleCalculate}
          disabled={!isFormValid}>
          <Text style={styles.calculateButtonText}>Calculate Dosage</Text>
        </TouchableOpacity>

        {result && (
          <ResultCard
            title="Water Conditioner Dosage"
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
  conditionersContainer: {
    marginBottom: spacing.lg,
  },
  conditionersLabel: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  conditionerButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  conditionerButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  conditionerButtonActive: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.secondary,
  },
  conditionerButtonText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  conditionerButtonTextActive: {
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

export default ConditionerCalculator;
