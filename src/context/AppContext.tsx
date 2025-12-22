import React, {createContext, useContext, useState, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types for our calculations
export interface Calculation {
  id: string;
  type: 'fertilizer' | 'medication' | 'conditioner' | 'salinity';
  timestamp: number;
  inputs: Record<string, any>;
  result: string;
  notes?: string;
}

interface AppContextType {
  calculations: Calculation[];
  addCalculation: (calculation: Omit<Calculation, 'id' | 'timestamp'>) => void;
  deleteCalculation: (id: string) => void;
  clearAllCalculations: () => void;
  loadCalculations: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = '@aquadose_calculations';

export const AppProvider = ({children}: {children: ReactNode}) => {
  const [calculations, setCalculations] = useState<Calculation[]>([]);

  const loadCalculations = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCalculations(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading calculations:', error);
    }
  };

  const saveCalculations = async (newCalculations: Calculation[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCalculations));
    } catch (error) {
      console.error('Error saving calculations:', error);
    }
  };

  const addCalculation = (
    calculation: Omit<Calculation, 'id' | 'timestamp'>,
  ) => {
    const newCalculation: Calculation = {
      ...calculation,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    const updated = [newCalculation, ...calculations];
    setCalculations(updated);
    saveCalculations(updated);
  };

  const deleteCalculation = (id: string) => {
    const updated = calculations.filter(calc => calc.id !== id);
    setCalculations(updated);
    saveCalculations(updated);
  };

  const clearAllCalculations = () => {
    setCalculations([]);
    saveCalculations([]);
  };

  return (
    <AppContext.Provider
      value={{
        calculations,
        addCalculation,
        deleteCalculation,
        clearAllCalculations,
        loadCalculations,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
