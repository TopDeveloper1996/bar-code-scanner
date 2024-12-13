import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
// import ScanPage from './pages/ScanPage';
import StockPage from './pages/StockPage';
import HistoryPage from './pages/HistoryPage';
import NotificationsPage from './pages/NotificationsPage';
import ExportPage from './pages/ExportPage';
import BarcodeScanPage from './pages/BarcodeScanPage'
import ElectricalStockList from './components/ElectricalStockList';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { ScanHistoryProvider } from './context/ScanHistoryContext';

function App() {
  return (
    <Provider store={store}>
      <ScanHistoryProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/scan" element={<BarcodeScanPage />} />
              {/* <Route path="/barcodescan" element={<BarcodeScanPage />} /> */}
              <Route path="/stock" element={<StockPage />} />
              <Route path="/stock/electrical" element={<ElectricalStockList />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/export" element={<ExportPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Routes>
          </Layout>
        </Router>
      </ScanHistoryProvider>
    </Provider>
  );
}

export default App;

