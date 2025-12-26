import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useApp} from '../context/AppContext';
import {colors, spacing, typography, borderRadius, shadows, adSizes} from '../constants/theme';
import {useRewardedAd} from '../hooks/useRewardedAd';
import {isPremiumActive, getRemainingPremiumTime} from '../services/adService';
import {PremiumFeatures} from '../config/featureFlags';
import BannerAd from '../components/BannerAd';

const SettingsScreen = () => {
  const {clearAllCalculations} = useApp();
  const {isLoaded, isLoading, show} = useRewardedAd();
  const [premium, setPremium] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    checkPremiumStatus();
    const interval = setInterval(checkPremiumStatus, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  const checkPremiumStatus = async () => {
    const isPremium = await isPremiumActive();
    setPremium(isPremium);

    if (isPremium) {
      const timeLeft = await getRemainingPremiumTime();
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      setRemainingTime(`${hours}h ${minutes}m remaining`);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all saved calculations? This cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearAllCalculations,
        },
      ],
    );
  };

  const handleWatchAd = async () => {
    if (!isLoaded) {
      Alert.alert('Please Wait', 'The ad is still loading. Please try again in a moment.');
      return;
    }

    const success = await show();
    if (success) {
      Alert.alert(
        'Premium Unlocked!',
        `You now have ${PremiumFeatures.PREMIUM_UNLOCK_DURATION_HOURS} hours of ad-free experience!`,
        [{text: 'Awesome!', onPress: () => checkPremiumStatus()}]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>

          {premium ? (
            <View style={styles.premiumCard}>
              <View style={styles.premiumBadge}>
                <Icon name="star" size={24} color={colors.warning} />
                <Text style={styles.premiumBadgeText}>Premium Active</Text>
              </View>
              <Text style={styles.premiumTimeText}>{remainingTime}</Text>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Icon name="check-circle" size={16} color={colors.success} />
                  <Text style={styles.benefitText}>No Banner Ads</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Icon name="check-circle" size={16} color={colors.success} />
                  <Text style={styles.benefitText}>No Interstitial Ads</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Icon name="check-circle" size={16} color={colors.success} />
                  <Text style={styles.benefitText}>Ad-Free Experience</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.premiumCard}>
              <Icon name="star-outline" size={48} color={colors.primary} style={{alignSelf: 'center', marginBottom: spacing.md}} />
              <Text style={styles.premiumTitle}>Get Premium Free!</Text>
              <Text style={styles.premiumDescription}>
                Watch a short video to unlock {PremiumFeatures.PREMIUM_UNLOCK_DURATION_HOURS} hours of ad-free experience.
              </Text>

              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Icon name="check" size={16} color={colors.primary} />
                  <Text style={styles.benefitText}>Remove all banner ads</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Icon name="check" size={16} color={colors.primary} />
                  <Text style={styles.benefitText}>Remove interstitial ads</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Icon name="check" size={16} color={colors.primary} />
                  <Text style={styles.benefitText}>Enjoy uninterrupted calculations</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.watchAdButton, !isLoaded && styles.watchAdButtonDisabled]}
                onPress={handleWatchAd}
                disabled={!isLoaded}>
                {isLoading ? (
                  <ActivityIndicator color={colors.surface} />
                ) : (
                  <>
                    <Icon name="play-circle" size={20} color={colors.surface} />
                    <Text style={styles.watchAdButtonText}>
                      {isLoaded ? 'Watch Video for Premium' : 'Loading...'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <Text style={styles.appName}>Aquarium Dose Calculator</Text>
            <Text style={styles.version}>Version 1.0.0</Text>
            <Text style={styles.description}>
              Precise dosing calculator for aquarium hobbyists. Calculate
              fertilizers, medications, water conditioners, and salinity
              adjustments with accuracy.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearHistory}>
            <Text style={styles.dangerButtonText}>Clear All History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disclaimer</Text>
          <View style={styles.card}>
            <Text style={styles.disclaimerText}>
              Always verify dosing calculations with product instructions.
              AquaDose Pro is a tool to assist with calculations, but the
              responsibility for accurate dosing remains with the user. Improper
              dosing can harm aquatic life.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with care for aquarium hobbyists
          </Text>
        </View>
      </ScrollView>
      <BannerAd />
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: adSizes.bannerHeight + adSizes.bannerPadding, // Space for banner ad with gap
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
  },
  appName: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  version: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  dangerButton: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.small,
  },
  dangerButtonText: {
    ...typography.button,
    color: colors.surface,
  },
  disclaimerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    color: colors.textLight,
  },
  premiumCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.medium,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    alignSelf: 'center',
  },
  premiumBadgeText: {
    ...typography.h3,
    color: colors.warning,
  },
  premiumTimeText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  premiumTitle: {
    ...typography.h2,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  premiumDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  benefitsList: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  benefitText: {
    ...typography.body,
    color: colors.text,
  },
  watchAdButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.small,
  },
  watchAdButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  watchAdButtonText: {
    ...typography.button,
    color: colors.surface,
  },
});

export default SettingsScreen;
