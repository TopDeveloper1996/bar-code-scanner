import React, { createContext, useContext, useState } from 'react';

export interface ScannedProduct {
  barcode: string;
  title: string;
  brand: string;
  image: string;
  timestamp: Date;
}

interface ScanHistoryContextType {
  scanHistory: ScannedProduct[];
  addToHistory: (product: Omit<ScannedProduct, 'timestamp'>) => void;
}

const ScanHistoryContext = createContext<ScanHistoryContextType | undefined>(undefined);

export const ScanHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scanHistory, setScanHistory] = useState<ScannedProduct[]>([]);

  const addToHistory = (product: Omit<ScannedProduct, 'timestamp'>) => {
    setScanHistory(prev => [
      {
        ...product,
        timestamp: new Date(),
      },
      ...prev
    ]);
  };

  return (
    <ScanHistoryContext.Provider value={{ scanHistory, addToHistory }}>
      {children}
    </ScanHistoryContext.Provider>
  );
};

export const useScanHistory = () => {
  const context = useContext(ScanHistoryContext);
  if (!context) {
    throw new Error('useScanHistory must be used within a ScanHistoryProvider');
  }
  return context;
}; 