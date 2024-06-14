import React from 'react';
import { useRoutes } from 'react-router-dom';
import Landing from './layouts/landing/Landing.jsx';
import { AuthProvider } from './context/authContext/index.jsx';
import Dashboard from './layouts/dashboard.jsx';
import Auth from './layouts/auth.jsx';

function App() {
  const routes = [
    {
      path: '/',
      element: <Landing />,
    },
    {
      path: '/auth/*',
      element: <Auth />,
    },
    {
      path: '/dashboard/*',
      element: <Dashboard />,
    },
    {
      path: '/candidate/*',
      element: <Dashboard />,
    },
  ];

  let routesElement = useRoutes(routes);

  return (
    <AuthProvider>
      {routesElement}
    </AuthProvider>
  );
}

export default App;
