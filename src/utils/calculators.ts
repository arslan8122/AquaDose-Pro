// Calculator logic for aquarium dosing

import {formatDosage, formatWeight, gallonsToLiters} from './unitConversion';

// Input validation
export const validatePositiveNumber = (value: number, fieldName: string): string | null => {
  if (isNaN(value) || value <= 0) {
    return `${fieldName} must be a positive number`;
  }
  return null;
};

export const validateNumberInRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string,
): string | null => {
  if (isNaN(value) || value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
};

// 1. FERTILIZER DOSING CALCULATOR
export interface FertilizerInputs {
  tankVolume: number;
  volumeUnit: 'gallons' | 'liters';
  desiredPPM: number;
  productConcentration: number; // percentage or ppm
  concentrationType: 'percentage' | 'ppm';
}

export interface FertilizerResult {
  dosageMl: number;
  dosageGrams?: number;
  formattedDosage: string;
  instructions: string;
  error?: string;
}

export const calculateFertilizerDosing = (
  inputs: FertilizerInputs,
): FertilizerResult => {
  // Validate inputs
  const volumeError = validatePositiveNumber(inputs.tankVolume, 'Tank volume');
  const ppmError = validatePositiveNumber(inputs.desiredPPM, 'Desired PPM');
  const concentrationError = validatePositiveNumber(
    inputs.productConcentration,
    'Product concentration',
  );

  if (volumeError || ppmError || concentrationError) {
    return {
      dosageMl: 0,
      formattedDosage: '',
      instructions: '',
      error: volumeError || ppmError || concentrationError || '',
    };
  }

  // Convert to liters if needed
  const volumeInLiters =
    inputs.volumeUnit === 'gallons'
      ? gallonsToLiters(inputs.tankVolume)
      : inputs.tankVolume;

  let dosageMl = 0;

  if (inputs.concentrationType === 'percentage') {
    // For percentage concentration (e.g., 5% solution)
    // Formula: (desired ppm * volume in liters) / (concentration % * 10000)
    dosageMl =
      (inputs.desiredPPM * volumeInLiters) / (inputs.productConcentration * 10000);
  } else {
    // For ppm concentration
    // Formula: (desired ppm * volume in liters) / product ppm
    dosageMl = (inputs.desiredPPM * volumeInLiters) / inputs.productConcentration;
  }

  const instructions = `Add ${formatDosage(dosageMl)} of fertilizer solution to your ${inputs.tankVolume} ${inputs.volumeUnit} tank to achieve ${inputs.desiredPPM} ppm. Dose slowly and monitor your aquarium's response.`;

  return {
    dosageMl,
    formattedDosage: formatDosage(dosageMl),
    instructions,
  };
};

// 2. MEDICATION DOSING CALCULATOR
export interface MedicationInputs {
  tankVolume: number;
  volumeUnit: 'gallons' | 'liters';
  medicationStrength: number; // mg/ml or similar
  dosagePerGallon: number; // recommended dose per gallon
  treatmentDays: number;
}

export interface MedicationResult {
  dosageMl: number;
  formattedDosage: string;
  totalForTreatment: number;
  instructions: string;
  error?: string;
}

export const calculateMedicationDosing = (
  inputs: MedicationInputs,
): MedicationResult => {
  // Validate inputs
  const volumeError = validatePositiveNumber(inputs.tankVolume, 'Tank volume');
  const strengthError = validatePositiveNumber(
    inputs.medicationStrength,
    'Medication strength',
  );
  const dosageError = validatePositiveNumber(
    inputs.dosagePerGallon,
    'Dosage per gallon',
  );
  const daysError = validateNumberInRange(
    inputs.treatmentDays,
    1,
    30,
    'Treatment days',
  );

  if (volumeError || strengthError || dosageError || daysError) {
    return {
      dosageMl: 0,
      formattedDosage: '',
      totalForTreatment: 0,
      instructions: '',
      error: volumeError || strengthError || dosageError || daysError || '',
    };
  }

  // Calculate dosage per application
  const dosageMl = inputs.tankVolume * inputs.dosagePerGallon;
  const totalForTreatment = dosageMl * inputs.treatmentDays;

  const instructions = `Dose ${formatDosage(dosageMl)} per day for ${inputs.treatmentDays} days. Total medication needed: ${formatDosage(totalForTreatment)}. Always follow product instructions and remove carbon filtration during treatment.`;

  return {
    dosageMl,
    formattedDosage: formatDosage(dosageMl),
    totalForTreatment,
    instructions,
  };
};

// 3. WATER CONDITIONER CALCULATOR
export interface ConditionerInputs {
  tankVolume: number;
  volumeUnit: 'gallons' | 'liters';
  waterChangePercentage: number;
  conditionerDoseRate: number; // ml per gallon (standard dose from bottle)
}

export interface ConditionerResult {
  dosageMl: number;
  formattedDosage: string;
  waterChangeVolume: number;
  instructions: string;
  error?: string;
}

export const calculateWaterConditioner = (
  inputs: ConditionerInputs,
): ConditionerResult => {
  // Validate inputs
  const volumeError = validatePositiveNumber(inputs.tankVolume, 'Tank volume');
  const percentageError = validateNumberInRange(
    inputs.waterChangePercentage,
    1,
    100,
    'Water change percentage',
  );
  const doseRateError = validatePositiveNumber(
    inputs.conditionerDoseRate,
    'Conditioner dose rate',
  );

  if (volumeError || percentageError || doseRateError) {
    return {
      dosageMl: 0,
      formattedDosage: '',
      waterChangeVolume: 0,
      instructions: '',
      error: volumeError || percentageError || doseRateError || '',
    };
  }

  // Calculate volume of new water
  const waterChangeVolume =
    (inputs.tankVolume * inputs.waterChangePercentage) / 100;

  // Calculate conditioner needed based on new water volume
  const dosageMl = waterChangeVolume * inputs.conditionerDoseRate;

  const instructions = `For a ${inputs.waterChangePercentage}% water change (${waterChangeVolume.toFixed(2)} ${inputs.volumeUnit}), add ${formatDosage(dosageMl)} of water conditioner. Add conditioner to new water before adding to tank.`;

  return {
    dosageMl,
    formattedDosage: formatDosage(dosageMl),
    waterChangeVolume,
    instructions,
  };
};

// 4. SALINITY/SPECIFIC GRAVITY CALCULATOR
export interface SalinityInputs {
  tankVolume: number;
  volumeUnit: 'gallons' | 'liters';
  currentSalinity: number; // ppt (parts per thousand) or specific gravity
  targetSalinity: number;
  salinityUnit: 'ppt' | 'sg'; // parts per thousand or specific gravity
}

export interface SalinityResult {
  saltToAddGrams: number;
  saltToAddOunces: number;
  formattedAmount: string;
  waterToRemoveLiters?: number;
  action: 'add' | 'remove' | 'none';
  instructions: string;
  error?: string;
}

// Helper: Convert specific gravity to ppt
const sgToPPT = (sg: number): number => {
  return (sg - 1) * 1000;
};

// Helper: Convert ppt to specific gravity
const pptToSG = (ppt: number): number => {
  return ppt / 1000 + 1;
};

export const calculateSalinity = (inputs: SalinityInputs): SalinityResult => {
  // Validate inputs
  const volumeError = validatePositiveNumber(inputs.tankVolume, 'Tank volume');

  let currentPPT = inputs.currentSalinity;
  let targetPPT = inputs.targetSalinity;

  // Convert to PPT if using specific gravity
  if (inputs.salinityUnit === 'sg') {
    const sgError = validateNumberInRange(
      inputs.currentSalinity,
      1.0,
      1.05,
      'Current specific gravity',
    );
    const sgTargetError = validateNumberInRange(
      inputs.targetSalinity,
      1.0,
      1.05,
      'Target specific gravity',
    );

    if (volumeError || sgError || sgTargetError) {
      return {
        saltToAddGrams: 0,
        saltToAddOunces: 0,
        formattedAmount: '',
        action: 'none',
        instructions: '',
        error: volumeError || sgError || sgTargetError || '',
      };
    }

    currentPPT = sgToPPT(inputs.currentSalinity);
    targetPPT = sgToPPT(inputs.targetSalinity);
  } else {
    const pptError = validateNumberInRange(
      inputs.currentSalinity,
      0,
      50,
      'Current salinity',
    );
    const pptTargetError = validateNumberInRange(
      inputs.targetSalinity,
      0,
      50,
      'Target salinity',
    );

    if (volumeError || pptError || pptTargetError) {
      return {
        saltToAddGrams: 0,
        saltToAddOunces: 0,
        formattedAmount: '',
        action: 'none',
        instructions: '',
        error: volumeError || pptError || pptTargetError || '',
      };
    }
  }

  // Calculate difference
  const difference = targetPPT - currentPPT;

  // Convert to liters
  const volumeInLiters =
    inputs.volumeUnit === 'gallons'
      ? gallonsToLiters(inputs.tankVolume)
      : inputs.tankVolume;

  if (Math.abs(difference) < 0.5) {
    return {
      saltToAddGrams: 0,
      saltToAddOunces: 0,
      formattedAmount: '0 g',
      action: 'none',
      instructions: 'Salinity is already at target level. No adjustment needed.',
    };
  }

  if (difference > 0) {
    // Need to add salt
    // Formula: 1.3 grams of salt per liter raises salinity by 1 ppt
    const saltToAddGrams = difference * volumeInLiters * 1.3;
    const saltToAddOunces = saltToAddGrams / 28.3495;

    const instructions = `Add ${formatWeight(saltToAddGrams)} of marine salt to raise salinity from ${currentPPT.toFixed(1)} to ${targetPPT.toFixed(1)} ppt. Dissolve salt in a separate container before adding. Add slowly over several hours while monitoring.`;

    return {
      saltToAddGrams,
      saltToAddOunces,
      formattedAmount: formatWeight(saltToAddGrams),
      action: 'add',
      instructions,
    };
  } else {
    // Need to remove salt (dilute with freshwater)
    const waterToRemoveLiters = Math.abs(difference / targetPPT) * volumeInLiters;

    const instructions = `Remove ${waterToRemoveLiters.toFixed(2)} liters of tank water and replace with freshwater to lower salinity from ${currentPPT.toFixed(1)} to ${targetPPT.toFixed(1)} ppt. Make changes gradually over several hours.`;

    return {
      saltToAddGrams: 0,
      saltToAddOunces: 0,
      formattedAmount: '',
      waterToRemoveLiters,
      action: 'remove',
      instructions,
    };
  }
};
