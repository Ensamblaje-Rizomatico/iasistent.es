import React, { useState, useEffect } from 'react';
import { X, Save, Bot, Palette, MessageSquare } from 'lucide-react';
import { AssistantConfig } from '../../types';

interface AssistantFormProps {
  assistant?: AssistantConfig;
  onSave: (data: Partial<AssistantConfig>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function AssistantForm({ assistant, onSave, onCancel, loading }: AssistantFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    personality: '',
    language: 'es',
    tone: 'friendly' as 'formal' | 'casual' | 'friendly',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    position: 'bottom-right' as 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left',
  });

  useEffect(() => {
    if (assistant) {
      setFormData({
        name: assistant.name,
        personality: assistant.personality,
        language: assistant.language,
        tone: assistant.tone,
        primaryColor: assistant.primaryColor,
        secondaryColor: assistant.secondaryColor,
        position: assistant.position,
      });
    }
  }, [assistant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 w-10 h-10 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {assistant ? 'Editar Asistente' : 'Crear Nuevo Asistente'}
              </h2>
              <p className="text-sm text-gray-600">
                Configura la personalidad y apariencia de tu asistente
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Información Básica</span>
            </h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Asistente
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Mi asistente virtual"
                required
              />
            </div>

            <div>
              <label htmlFor="personality" className="block text-sm font-medium text-gray-700 mb-2">
                Personalidad y Comportamiento
              </label>
              <textarea
                id="personality"
                value={formData.personality}
                onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe cómo debe comportarse tu asistente, su personalidad, estilo de comunicación..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  Idioma
                </label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div>
                <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
                  Tono de Voz
                </label>
                <select
                  id="tone"
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Amigable</option>
                </select>
              </div>
            </div>
          </div>

          {/* Apariencia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Palette className="w-5 h-5 text-green-600" />
              <span>Apariencia</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Color Primario
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Color Secundario
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    id="secondaryColor"
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="#10B981"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                Posición del Widget
              </label>
              <select
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="bottom-right">Abajo Derecha</option>
                <option value="bottom-left">Abajo Izquierda</option>
                <option value="top-right">Arriba Derecha</option>
                <option value="top-left">Arriba Izquierda</option>
              </select>
            </div>
          </div>

          {/* Vista Previa */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Vista Previa</h4>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${formData.primaryColor}20` }}
                >
                  <Bot className="w-6 h-6" style={{ color: formData.primaryColor }} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{formData.name || 'Nombre del Asistente'}</p>
                  <p className="text-sm text-gray-600 capitalize">{formData.language} • {formData.tone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Guardando...' : 'Guardar Asistente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}