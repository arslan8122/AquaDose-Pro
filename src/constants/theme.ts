// Aquatic-themed color scheme for AquaDose Pro
export const colors = {
  // Primary colors - Ocean blues
  primary: '#0077BE', // Deep ocean blue
  primaryLight: '#4A9FD8', // Light ocean blue
  primaryDark: '#005A8C', // Dark ocean blue

  // Secondary colors - Aquatic greens
  secondary: '#00A676', // Aqua green
  secondaryLight: '#4DC99A', // Light aqua
  secondaryDark: '#007D5A', // Dark aqua

  // Accent colors
  accent: '#FF6B35', // Coral orange (for warnings/important actions)
  warning: '#FFB020', // Golden yellow
  error: '#E63946', // Red
  success: '#06D6A0', // Teal green

  // Neutral colors
  background: '#F8FAFB', // Very light blue-gray
  surface: '#FFFFFF', // White
  cardBackground: '#FFFFFF',

  // Text colors
  text: '#1A3A52', // Dark blue-gray
  textSecondary: '#6B8EA5', // Medium blue-gray
  textLight: '#A3BFD1', // Light blue-gray

  // Border and divider
  border: '#E1EBF0',
  divider: '#D4E3EA',

  // Input colors
  inputBackground: '#F3F7F9',
  inputBorder: '#C2D9E5',
  inputFocus: '#0077BE',

  // Button colors
  buttonDisabled: '#B0C4CE',

  // Shadow
  shadow: 'rgba(0, 119, 190, 0.15)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Ad dimensions
export const adSizes = {
  bannerHeight: 60, // Anchored adaptive banner height
  bannerPadding: 16, // Extra padding to ensure content doesn't touch ad
};
