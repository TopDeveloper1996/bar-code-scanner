import React, { createContext, useContext, useState } from 'react';

export interface ScannedProduct {
  barcode: string;
  title: string;
  brand: string;
  image: string;
  category: string;
  description: string;
  timestamp: Date;
}

interface ScanHistoryContextType {
  scanHistory: ScannedProduct[];
  addToScanHistory: (product: ScannedProduct) => void;
  clearScanHistory: () => void;
}

const ScanHistoryContext = createContext<ScanHistoryContextType | undefined>(undefined);

export const ScanHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scanHistory, setScanHistory] = useState<ScannedProduct[]>([]);

  const addToScanHistory = (product: ScannedProduct) => {
    setScanHistory(prev => [...prev, product]);
  };

  const clearScanHistory = () => {
    setScanHistory([]);
  };

  return (
    <ScanHistoryContext.Provider value={{ 
      scanHistory, 
      addToScanHistory,
      clearScanHistory 
    }}>
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