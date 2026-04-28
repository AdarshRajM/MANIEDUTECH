import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
    Dashboard, People, School, Assessment, Store, Favorite, 
    LocalOffer, VideoCall, Brightness4, Brightness7, Notifications, 
    Menu, Close, ExitToApp, Chat, Assignment, AddBox, Create, UploadFile
} from '@mui/icons-material';

import ThreeBackground from './ThreeBackground';

const Layout = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const role = localStorage.getItem('role') || 'STUDENT';
  const username = localStorage.getItem('username') || 'User';

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { name: 'Courses', path: '/courses', icon: <School /> },
    { name: 'Analytics', path: '/analytics', icon: <Assessment /> }, // New analytics page
    { name: 'Products', path: '/products', icon: <Store /> },
    { name: 'Wishlist', path: '/wishlist', icon: <Favorite /> },
    { name: 'Coupons', path: '/coupons', icon: <LocalOffer /> },
    { name: 'Live Class', path: '/live', icon: <VideoCall /> }, // New live class page
    { name: 'Communication Hub', path: '/communication', icon: <Chat /> },
    { name: 'Proctored Tests', path: '/tests', icon: <Assignment /> }
  ];

  if (role === 'PRINCIPAL' || role === 'FACULTY') {
    menuItems.push({ name: 'Students Management', path: '/students', icon: <People /> });
    menuItems.push({ name: 'Faculty Portal', path: '/faculty', icon: <School /> });
    menuItems.push({ name: 'Schedule Live', path: '/schedule-live', icon: <VideoCall /> });
    menuItems.push({ name: 'Management System', path: '/management', icon: <School /> });
    menuItems.push({ name: 'Add Course', path: '/management/add-course', icon: <AddBox /> });
    menuItems.push({ name: 'Add Material', path: '/management/add-product', icon: <UploadFile /> });
    menuItems.push({ name: 'Update Marks', path: '/management/update-marks', icon: <Create /> });
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-transparent text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      <ThreeBackground />
      {/* Sidebar */}
      <motion.div 
        initial={{ width: 260 }}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl z-20 flex flex-col justify-between hidden md:flex border-r border-gray-200/50 dark:border-gray-700/50"
      >
        <div>
          <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
            {sidebarOpen ? (
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                MANIEDUTECH
              </span>
            ) : (
              <School className="text-blue-500" />
            )}
          </div>
          <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-140px)]">
            {menuItems.map((item) => (
              <NavLink 
                key={item.name} 
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-500/90 text-white shadow-md backdrop-blur-sm' 
                      : 'hover:bg-gray-100/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300'
                  }`
                }
              >
                <div>{item.icon}</div>
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-red-50/50 dark:hover:bg-red-900/20 text-red-500 transition-colors" onClick={handleLogout}>
            <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} p-2 rounded-xl`}>
                <ExitToApp />
                {sidebarOpen && <span className="font-medium">Logout</span>}
            </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden z-10">
        
        {/* Header */}
        <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm flex items-center justify-between px-6 transition-colors duration-300 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition">
              <Menu />
            </button>
            <h2 className="text-xl font-semibold hidden sm:block">Welcome back, {username}</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition">
              {isDarkMode ? <Brightness7 className="text-yellow-400" /> : <Brightness4 className="text-gray-600" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition relative"
              >
                <Notifications />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              </button>
              
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 z-50"
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex space-x-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                          <School fontSize="small" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New Course Available</p>
                          <p className="text-xs text-gray-500">Advanced React Native is now live!</p>
                        </div>
                      </div>
                      <div className="flex space-x-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500">
                          <Assessment fontSize="small" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Test Results Published</p>
                          <p className="text-xs text-gray-500">Check your latest analytics dashboard.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Avatar Profile */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg transition">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50/40 dark:bg-gray-900/40 backdrop-blur-md p-6 relative">
          <AnimatePresence mode="wait">
             <motion.div
               key={window.location.pathname}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.2 }}
             >
                {children}
             </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
