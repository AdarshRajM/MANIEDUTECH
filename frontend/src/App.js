import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Button } from '@mui/material';
import axios from 'axios';
import { ThemeProvider as TailwindThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';

// Lazy loading all components for code splitting & better performance
const Home = lazy(() => import('./components/Home'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Students = lazy(() => import('./components/Students'));
const Courses = lazy(() => import('./components/Courses'));
const Marks = lazy(() => import('./components/Marks'));
const Navbar = lazy(() => import('./components/Navbar'));
const Management = lazy(() => import('./components/Management'));
const Products = lazy(() => import('./components/Products'));
const Wishlist = lazy(() => import('./components/Wishlist'));
const Coupons = lazy(() => import('./components/Coupons'));
const Chatbot = lazy(() => import('./components/Chatbot'));
const SectionLearning = lazy(() => import('./components/SectionLearning'));
const FacultyPortal = lazy(() => import('./components/FacultyPortal'));
const Analytics = lazy(() => import('./components/Analytics')); // New component
const LiveClass = lazy(() => import('./components/LiveClass')); // New component

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

const muiTheme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

const SkeletonLoader = () => (
    <div className="flex flex-col space-y-4 p-8 animate-pulse w-full">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
    </div>
);

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <TailwindThemeProvider>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Routes without Sidebar */}
            <Route path="/" element={<Suspense fallback={<SkeletonLoader />}><><Navbar /><Home /></></Suspense>} />
            <Route path="/login" element={<Suspense fallback={<SkeletonLoader />}><><Navbar /><Login /></></Suspense>} />
            <Route path="/signup" element={<Suspense fallback={<SkeletonLoader />}><><Navbar /><Signup /></></Suspense>} />

            {/* Authenticated Routes wrapped in Modern Sidebar Layout */}
            <Route path="/*" element={
              <Layout>
                <Suspense fallback={<SkeletonLoader />}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/marks" element={<Marks />} />
                    <Route path="/management" element={<Management />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/coupons" element={<Coupons />} />
                    <Route path="/section" element={<SectionLearning />} />
                    <Route path="/faculty" element={<FacultyPortal />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/live" element={<LiveClass />} />
                  </Routes>
                </Suspense>
              </Layout>
            } />
          </Routes>
        </Router>
        <Chatbot />
      </MuiThemeProvider>
    </TailwindThemeProvider>
  );
}

export default App;