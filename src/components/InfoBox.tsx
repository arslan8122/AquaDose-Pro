import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, spacing, typography, borderRadius} from '../constants/theme';

interface InfoBoxProps {
  title?: string;
  message: string;
  type?: 'info' | 'tip' | 'warning';
}

const InfoBox: React.FC<InfoBoxProps> = ({title, message, type = 'info'}) => {
  const getIconName = () => {
    switch (type) {
      case 'tip':
        return 'lightbulb-on';
      case 'warning':
        return 'alert-circle';
      default:
        return 'information';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'tip':
        return colors.success;
      case 'warning':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'tip':
        return colors.success;
      case 'warning':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={[styles.container, {borderLeftColor: getBorderColor()}]}>
      <View style={styles.header}>
        <Icon name={getIconName()} size={20} color={getIconColor()} />
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight + '20', // 20 for opacity
    borderLeftWidth: 4,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  message: {
    ...typography.bodySmall,
    color: colors.text,
    lineHeight: 20,
  },
});

export default InfoBox;
