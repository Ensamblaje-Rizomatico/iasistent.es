import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAssistant } from '../../hooks/useAssistant';
import { Sidebar } from './Sidebar';
import { AssistantCard } from './AssistantCard';
import { AssistantForm } from './AssistantForm';
import { Plus, Search, Bot } from 'lucide-react';
import { AssistantConfig } from '../../types';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { assistants, loading, createAssistant, updateAssistant, deleteAssistant } = useAssistant(user?.id);
  const [activeTab, setActiveTab] = useState('assistants');
  const [showForm, setShowForm] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState<AssistantConfig | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateAssistant = async (data: Partial<AssistantConfig>) => {
    const { error } = await createAssistant(data);
    if (!error) {
      setShowForm(false);
    }
  };

  const handleUpdateAssistant = async (data: Partial<AssistantConfig>) => {
    if (editingAssistant) {
      const { error } = await updateAssistant(editingAssistant.id, data);
      if (!error) {
        setShowForm(false);
        setEditingAssistant(undefined);
      }
    }
  };

  const handleEditAssistant = (assistant: AssistantConfig) => {
    setEditingAssistant(assistant);
    setShowForm(true);
  };

  const handleDeleteAssistant = async (assistantId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este asistente?')) {
      await deleteAssistant(assistantId);
    }
  };

  const handleToggleActive = async (assistantId: string, isActive: boolean) => {
    await updateAssistant(assistantId, { isActive });
  };

  const filteredAssistants = assistants.filter(assistant =>
    assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assistant.personality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'assistants':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Asistentes</h1>
                <p className="text-gray-600">Gestiona y configura tus asistentes de voz</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all font-medium flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Nuevo Asistente</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar asistentes..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredAssistants.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No se encontraron asistentes' : 'No tienes asistentes aún'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Crea tu primer asistente de voz para comenzar'
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all font-medium"
                  >
                    Crear Primer Asistente
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssistants.map((assistant) => (
                  <AssistantCard
                    key={assistant.id}
                    assistant={assistant}
                    onEdit={handleEditAssistant}
                    onDelete={handleDeleteAssistant}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'knowledge':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Base de Conocimiento</h1>
              <p className="text-gray-600">Gestiona la información que conocen tus asistentes</p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="text-gray-500 mb-4">🔧</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Próximamente</h3>
              <p className="text-gray-600">La gestión de base de conocimiento estará disponible pronto.</p>
            </div>
          </div>
        );

      case 'conversations':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Conversaciones</h1>
              <p className="text-gray-600">Revisa el historial de conversaciones de tus asistentes</p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="text-gray-500 mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Próximamente</h3>
              <p className="text-gray-600">El historial de conversaciones estará disponible pronto.</p>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Estadísticas</h1>
              <p className="text-gray-600">Analiza el rendimiento de tus asistentes</p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="text-gray-500 mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Próximamente</h3>
              <p className="text-gray-600">Las estadísticas y análisis estarán disponibles pronto.</p>
            </div>
          </div>
        );

      case 'integration':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Integración</h1>
              <p className="text-gray-600">Código para integrar tus asistentes en cualquier sitio web</p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="text-gray-500 mb-4">🔗</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Próximamente</h3>
              <p className="text-gray-600">Las opciones de integración estarán disponibles pronto.</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
              <p className="text-gray-600">Ajustes generales de tu cuenta</p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="text-gray-500 mb-4">⚙️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Próximamente</h3>
              <p className="text-gray-600">Las opciones de configuración estarán disponibles pronto.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={signOut}
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>

      {showForm && (
        <AssistantForm
          assistant={editingAssistant}
          onSave={editingAssistant ? handleUpdateAssistant : handleCreateAssistant}
          onCancel={() => {
            setShowForm(false);
            setEditingAssistant(undefined);
          }}
        />
      )}
    </div>
  );
}