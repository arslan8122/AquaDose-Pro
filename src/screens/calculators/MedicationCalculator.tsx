import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import CustomTextInput from '../../components/CustomTextInput';
import CustomPicker from '../../components/CustomPicker';
import ResultCard from '../../components/ResultCard';
import InfoBox from '../../components/InfoBox';
import {calculateMedicationDosing, MedicationInputs} from '../../utils/calculators';
import {colors, spacing, typography, borderRadius} from '../../constants/theme';
import {useApp} from '../../context/AppContext';

// Common medications with their dosage rates
const COMMON_MEDICATIONS = [
  {label: 'API General Cure', dosage: 1},
  {label: 'Seachem Paraguard', dosage: 5},
  {label: 'API Super Ick Cure', dosage: 1},
  {label: 'Seachem Focus', dosage: 1},
  {label: 'Custom', dosage: 0},
];

const MedicationCalculator = () => {
  const {addCalculation} = useApp();
  const [tankVolume, setTankVolume] = useState('');
  const [volumeUnit, setVolumeUnit] = useState<'gallons' | 'liters'>('gallons');
  const [medicationStrength, setMedicationStrength] = useState('');
  const [dosagePerGallon, setDosagePerGallon] = useState('');
  const [treatmentDays, setTreatmentDays] = useState('7');
  const [result, setResult] = useState<any>(null);

  const handleMedicationSelect = (dosage: number) => {
    if (dosage > 0) {
      setDosagePerGallon(dosage.toString());
    }
  };

  const handleCalculate = () => {
    const inputs: MedicationInputs = {
      tankVolume: parseFloat(tankVolume),
      volumeUnit,
      medicationStrength: parseFloat(medicationStrength),
      dosagePerGallon: parseFloat(dosagePerGallon),
      treatmentDays: parseInt(treatmentDays, 10),
    };

    const calculationResult = calculateMedicationDosing(inputs);
    setResult(calculationResult);
  };

  const handleSave = () => {
    if (result && !result.error) {
      addCalculation({
        type: 'medication',
        inputs: {
          tankVolume,
          volumeUnit,
          medicationStrength,
          dosagePerGallon,
          treatmentDays,
        },
        result: result.formattedDosage,
        notes: result.instructions,
      });
    }
  };

  const isFormValid = tankVolume && medicationStrength && dosagePerGallon && treatmentDays;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Medication Dosing Calculator</Text>
        <Text style={styles.description}>
          Calculate precise medication dosing for treating fish diseases. Always follow
          product instructions and remove carbon filtration during treatment.
        </Text>

        <InfoBox
          title="⚠️ Important Safety Tips"
          message="Always remove activated carbon from filters during treatment as it will absorb medication. Quarantine sick fish when possible to avoid medicating the entire tank."
          type="warning"
        />

        {/* Common Medications */}
        <View style={styles.medicationsContainer}>
          <Text style={styles.medicationsLabel}>Common Medications:</Text>
          <View style={styles.medicationButtons}>
            {COMMON_MEDICATIONS.map(med => (
              <TouchableOpacity
                key={med.label}
                style={[
                  styles.medicationButton,
                  dosagePerGallon === med.dosage.toString() &&
                    styles.medicationButtonActive,
                ]}
                onPress={() => handleMedicationSelect(med.dosage)}>
                <Text
                  style={[
                    styles.medicationButtonText,
                    dosagePerGallon === med.dosage.toString() &&
                      styles.medicationButtonTextActive,
                  ]}>
                  {med.label}
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
          label="Medication Strength (mg/ml)"
          value={medicationStrength}
          onChangeText={setMedicationStrength}
          keyboardType="numeric"
          placeholder="Check product label"
        />

        <CustomTextInput
          label="Dosage Per Gallon (ml)"
          value={dosagePerGallon}
          onChangeText={setDosagePerGallon}
          keyboardType="numeric"
          placeholder="Recommended dose from product"
        />

        <CustomTextInput
          label="Treatment Duration (Days)"
          value={treatmentDays}
          onChangeText={setTreatmentDays}
          keyboardType="numeric"
          placeholder="Usually 5-10 days"
        />

        <TouchableOpacity
          style={[styles.calculateButton, !isFormValid && styles.calculateButtonDisabled]}
          onPress={handleCalculate}
          disabled={!isFormValid}>
          <Text style={styles.calculateButtonText}>Calculate Dosage</Text>
        </TouchableOpacity>

        {result && (
          <ResultCard
            title="Medication Dosage"
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
  medicationsContainer: {
    marginBottom: spacing.lg,
  },
  medicationsLabel: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  medicationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  medicationButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  medicationButtonActive: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.secondary,
  },
  medicationButtonText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  medicationButtonTextActive: {
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

export default MedicationCalculator;
