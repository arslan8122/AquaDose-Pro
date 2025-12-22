import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useApp} from '../context/AppContext';
import {colors, spacing, typography, borderRadius, shadows} from '../constants/theme';

const SettingsScreen = () => {
  const {clearAllCalculations} = useApp();

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <Text style={styles.appName}>AquaDose Pro</Text>
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
});

export default SettingsScreen;
