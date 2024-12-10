import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ScanPage from './pages/ScanPage';
import StockPage from './pages/StockPage';
import HistoryPage from './pages/HistoryPage';
import NotificationsPage from './pages/NotificationsPage';
import ExportPage from './pages/ExportPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/export" element={<ExportPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;

