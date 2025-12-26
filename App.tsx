/**
 * AquaDose Pro - Aquarium Dosing Calculator
 * @format
 */

import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppProvider} from './src/context/AppContext';
import {colors} from './src/constants/theme';
import {initializeAds} from './src/services/adService';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Initialize ads on app startup
  useEffect(() => {
    initializeAds();
  }, []);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show splash screen
  if (showSplash) {
    return (
      <SafeAreaProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
        <SplashScreen onComplete={handleSplashComplete} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.primary}
          />
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: colors.primary,
              tabBarInactiveTintColor: colors.textSecondary,
              tabBarStyle: {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
                borderTopWidth: 1,
                paddingTop: 8,
                paddingBottom: 8,
                height: 60,
              },
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
                marginTop: 4,
              },
            }}>
            <Tab.Screen
              name="Calculator"
              component={CalculatorScreen}
              options={{
                tabBarLabel: 'Calculator',
                tabBarIcon: ({color, size}) => (
                  <Icon name="calculator" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="History"
              component={HistoryScreen}
              options={{
                tabBarLabel: 'History',
                tabBarIcon: ({color, size}) => (
                  <Icon name="history" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                tabBarLabel: 'Settings',
                tabBarIcon: ({color, size}) => (
                  <Icon name="cog" color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;
