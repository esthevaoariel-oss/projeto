import React, { createContext, useContext } from 'react';
import { IStorageService, AsyncStorageService } from '../services/storageService';

interface StorageContextType {
  storage: IStorageService;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storage = new AsyncStorageService();

  return (
    <StorageContext.Provider value={{ storage }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = (): IStorageService => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context.storage;
};
