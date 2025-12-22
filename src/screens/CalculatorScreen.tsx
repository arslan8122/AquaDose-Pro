import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedButton from '../components/AnimatedButton';
import BannerAd from '../components/BannerAd';
import NativeAd from '../components/NativeAd';
import {colors, spacing, typography, borderRadius, shadows} from '../constants/theme';
import {useInterstitialAd} from '../hooks/useInterstitialAd';
import FertilizerCalculator from './calculators/FertilizerCalculator';
import MedicationCalculator from './calculators/MedicationCalculator';
import ConditionerCalculator from './calculators/ConditionerCalculator';
import SalinityCalculator from './calculators/SalinityCalculator';

type CalculatorType = 'fertilizer' | 'medication' | 'conditioner' | 'salinity' | null;

const CalculatorScreen = () => {
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorType>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const fadeAnim = new Animated.Value(1); // Start visible
  const {showOnNavigation} = useInterstitialAd();

  useEffect(() => {
    if (isFirstLoad) {
      // Skip animation on first load
      setIsFirstLoad(false);
      return;
    }

    // Reset and animate on subsequent changes
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedCalculator]);

  const handleBackToHome = () => {
    // Show interstitial ad when going back to home
    showOnNavigation();
    setSelectedCalculator(null);
  };

  const renderCalculatorSelector = () => (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <Animated.View style={{opacity: fadeAnim}}>
        <View style={styles.header}>
          <Text style={styles.title}>AquaDose Calculator</Text>
          <Text style={styles.subtitle}>
            Select a calculator type to get started
          </Text>
        </View>

        <View style={styles.selectorContainer}>
          <AnimatedButton
            style={[styles.calculatorCard, styles.fertilizerCard]}
            onPress={() => setSelectedCalculator('fertilizer')}>
            <View style={styles.cardIcon}>
              <Icon name="leaf" size={40} color="#06D6A0" />
            </View>
            <Text style={styles.cardTitle}>Fertilizer Dosing</Text>
            <Text style={styles.cardDescription}>
              Calculate precise NPK and micronutrient dosing for planted tanks
            </Text>
          </AnimatedButton>

          <AnimatedButton
            style={[styles.calculatorCard, styles.medicationCard]}
            onPress={() => setSelectedCalculator('medication')}>
            <View style={styles.cardIcon}>
              <Icon name="pill" size={40} color="#E63946" />
            </View>
            <Text style={styles.cardTitle}>Medication Dosing</Text>
            <Text style={styles.cardDescription}>
              Precise medication dosing for treating fish diseases
            </Text>
          </AnimatedButton>

          {/* Native Ad between tiles */}
          <NativeAd />

          <AnimatedButton
            style={[styles.calculatorCard, styles.conditionerCard]}
            onPress={() => setSelectedCalculator('conditioner')}>
            <View style={styles.cardIcon}>
              <Icon name="water" size={40} color="#0077BE" />
            </View>
            <Text style={styles.cardTitle}>Water Conditioner</Text>
            <Text style={styles.cardDescription}>
              Calculate conditioner needed for water changes
            </Text>
          </AnimatedButton>

          <AnimatedButton
            style={[styles.calculatorCard, styles.salinityCard]}
            onPress={() => setSelectedCalculator('salinity')}>
            <View style={styles.cardIcon}>
              <Icon name="waves" size={40} color="#00A676" />
            </View>
            <Text style={styles.cardTitle}>Salinity Adjustment</Text>
            <Text style={styles.cardDescription}>
              Calculate salt additions for marine and brackish tanks
            </Text>
          </AnimatedButton>
        </View>
      </Animated.View>
    </ScrollView>
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
      <View style={{flex: 1}}>
        {selectedCalculator ? (
          <Animated.View style={[styles.calculatorWrapper, {opacity: fadeAnim}]}>
            <View style={styles.backHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToHome}>
                <Icon name="arrow-left" size={20} color={colors.primary} />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
            {renderSelectedCalculator()}
          </Animated.View>
        ) : (
          renderCalculatorSelector()
        )}
      </View>
      {/* Only show banner ad when a calculator is selected */}
      {selectedCalculator && <BannerAd />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 80, // Space for banner ad
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
    gap: spacing.xs,
  },
  backButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default CalculatorScreen;
