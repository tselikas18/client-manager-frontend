import AuthProvider from "./components/AuthProvider.tsx";
import {BrowserRouter, Routes, Route, Navigate} from "react-router";
import LoginPage from "./components/LoginPage.tsx";
import Dashboard from "./components/Dashboard.tsx";
import Clients from "./components/Clients.tsx";
import Suppliers from "./components/Suppliers.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

import './App.css'


function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth/login" element={<LoginPage/>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
            <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/clients" replace />} />
            {/*<Route path="/" element={<Navigate to="/dashboard" replace />} />*/}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}

export default App
