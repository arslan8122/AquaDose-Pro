import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useApp} from '../context/AppContext';
import {colors, spacing, typography, borderRadius, shadows} from '../constants/theme';

const HistoryScreen = () => {
  const {calculations, loadCalculations, deleteCalculation} = useApp();

  useEffect(() => {
    loadCalculations();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getCalculatorTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fertilizer: 'Fertilizer Dosing',
      medication: 'Medication Dosing',
      conditioner: 'Water Conditioner',
      salinity: 'Salinity/SG',
    };
    return labels[type] || type;
  };

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardType}>{getCalculatorTypeLabel(item.type)}</Text>
        <TouchableOpacity
          onPress={() => deleteCalculation(item.id)}
          style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.cardDate}>{formatDate(item.timestamp)}</Text>
      <Text style={styles.cardResult}>{item.result}</Text>
      {item.notes && <Text style={styles.cardNotes}>{item.notes}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calculation History</Text>
        <Text style={styles.subtitle}>
          {calculations.length} saved calculation{calculations.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {calculations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No calculations saved yet</Text>
          <Text style={styles.emptySubtext}>
            Your calculations will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={calculations}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
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
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.surface,
    opacity: 0.9,
  },
  listContent: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardType: {
    ...typography.h3,
    color: colors.primary,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  deleteText: {
    ...typography.bodySmall,
    color: colors.error,
  },
  cardDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  cardResult: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardNotes: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textLight,
  },
});

export default HistoryScreen;
