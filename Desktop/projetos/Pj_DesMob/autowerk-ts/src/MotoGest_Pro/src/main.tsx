import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { StorageProvider } from './contexts/StorageContext'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StorageProvider>
      <App />
    </StorageProvider>
  </React.StrictMode>,
)
