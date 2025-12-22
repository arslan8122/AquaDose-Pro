// Unit conversion utilities for aquarium dosing calculations

// Volume conversions
export const gallonsToLiters = (gallons: number): number => {
  return gallons * 3.78541;
};

export const litersToGallons = (liters: number): number => {
  return liters / 3.78541;
};

// Dosage conversions
export const mlToTeaspoons = (ml: number): number => {
  return ml / 4.92892;
};

export const teaspoonToMl = (tsp: number): number => {
  return tsp * 4.92892;
};

export const mlToTablespoons = (ml: number): number => {
  return ml / 14.7868;
};

export const tablespoonToMl = (tbsp: number): number => {
  return tbsp * 14.7868;
};

export const mlToCups = (ml: number): number => {
  return ml / 236.588;
};

export const cupsToMl = (cups: number): number => {
  return cups * 236.588;
};

export const gramsToOunces = (grams: number): number => {
  return grams / 28.3495;
};

export const ouncesToGrams = (ounces: number): number => {
  return ounces * 28.3495;
};

// Helper function to format volume display
export const formatVolume = (value: number, unit: 'gallons' | 'liters'): string => {
  return `${value.toFixed(2)} ${unit}`;
};

// Helper function to format dosage display with multiple units
export const formatDosage = (ml: number): string => {
  const formatted: string[] = [`${ml.toFixed(2)} ml`];

  if (ml >= 4.92892) {
    formatted.push(`${mlToTeaspoons(ml).toFixed(2)} tsp`);
  }

  if (ml >= 14.7868) {
    formatted.push(`${mlToTablespoons(ml).toFixed(2)} tbsp`);
  }

  if (ml >= 236.588) {
    formatted.push(`${mlToCups(ml).toFixed(2)} cups`);
  }

  return formatted.join(' / ');
};

// Helper function to format weight
export const formatWeight = (grams: number): string => {
  const formatted: string[] = [`${grams.toFixed(2)} g`];

  if (grams >= 28.3495) {
    formatted.push(`${gramsToOunces(grams).toFixed(2)} oz`);
  }

  return formatted.join(' / ');
};
