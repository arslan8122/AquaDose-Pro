import React, {useRef} from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface AnimatedButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: any;
  enableHaptic?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  style,
  onPress,
  enableHaptic = true,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (enableHaptic) {
      ReactNativeHapticFeedback.trigger('impactLight', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }

    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      activeOpacity={0.8}
      {...props}>
      <Animated.View
        style={[
          style,
          {
            transform: [{scale: scaleAnim}],
          },
        ]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedButton;
