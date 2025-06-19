import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/Auth/LoginForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { VoiceWidget } from './components/Widget/VoiceWidget';
import { AssistantConfig } from './types';

// Demo assistant para mostrar el widget
const demoAssistant: AssistantConfig = {
  id: 'demo',
  name: 'Asistente Demo',
  personality: 'Soy un asistente amigable y útil, listo para ayudarte con cualquier pregunta que tengas.',
  language: 'es',
  tone: 'friendly',
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  position: 'bottom-right',
  knowledgeBase: [],
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function App() {
  const { user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginForm 
                  onToggleMode={() => setIsSignUp(!isSignUp)} 
                  isSignUp={isSignUp} 
                />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/demo" 
            element={
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Demo del Asistente de Voz
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    Haz clic en el botón flotante para probar el asistente
                  </p>
                  <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                      Funcionalidades de demostración:
                    </h2>
                    <ul className="text-left space-y-3 text-gray-700">
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Reconocimiento de voz en español</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>Síntesis de voz para las respuestas</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span>Chat de texto como alternativa</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                        <span>Interfaz personalizable</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <VoiceWidget assistant={demoAssistant} />
              </div>
            } 
          />
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;