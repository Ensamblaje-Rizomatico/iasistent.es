import React from 'react';
import { 
  Bot, 
  Settings, 
  BarChart3, 
  BookOpen, 
  LogOut,
  MessageSquare,
  Code
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
}

export function Sidebar({ activeTab, onTabChange, onSignOut }: SidebarProps) {
  const tabs = [
    { id: 'assistants', label: 'Mis Asistentes', icon: Bot },
    { id: 'knowledge', label: 'Base de Conocimiento', icon: BookOpen },
    { id: 'conversations', label: 'Conversaciones', icon: MessageSquare },
    { id: 'analytics', label: 'Estadísticas', icon: BarChart3 },
    { id: 'integration', label: 'Integración', icon: Code },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="bg-white h-full w-64 border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 w-10 h-10 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">VoiceAssistant</h2>
            <p className="text-sm text-gray-600">Panel de Control</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <li key={tab.id}>
                <button
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}