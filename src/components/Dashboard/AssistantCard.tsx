import React from 'react';
import { Bot, Settings, Trash2, Play, Pause, Copy, ExternalLink } from 'lucide-react';
import { AssistantConfig } from '../../types';

interface AssistantCardProps {
  assistant: AssistantConfig;
  onEdit: (assistant: AssistantConfig) => void;
  onDelete: (assistantId: string) => void;
  onToggleActive: (assistantId: string, isActive: boolean) => void;
}

export function AssistantCard({ assistant, onEdit, onDelete, onToggleActive }: AssistantCardProps) {
  const handleCopyScript = () => {
    const script = `<script src="${window.location.origin}/widget.js"></script>
<script>
  window.VoiceAssistant.init({
    assistantId: "${assistant.id}",
    apiUrl: "${window.location.origin}/api"
  });
</script>`;
    
    navigator.clipboard.writeText(script);
    // Aquí podrías agregar una notificación de éxito
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${assistant.primaryColor}20` }}
          >
            <Bot className="w-6 h-6" style={{ color: assistant.primaryColor }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{assistant.name}</h3>
            <p className="text-sm text-gray-600 capitalize">
              {assistant.language} • {assistant.tone}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleActive(assistant.id, !assistant.isActive)}
            className={`p-2 rounded-lg transition-all ${
              assistant.isActive
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={assistant.isActive ? 'Pausar asistente' : 'Activar asistente'}
          >
            {assistant.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => onEdit(assistant)}
            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
            title="Configurar asistente"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(assistant.id)}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
            title="Eliminar asistente"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 line-clamp-2">{assistant.personality}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{assistant.knowledgeBase.length}</p>
            <p className="text-xs text-gray-600">Conocimientos</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              {assistant.isActive ? 'Activo' : 'Inactivo'}
            </p>
            <p className="text-xs text-gray-600">Estado</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyScript}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium flex items-center space-x-1"
            title="Copiar código de integración"
          >
            <Copy className="w-3 h-3" />
            <span>Copiar</span>
          </button>
          
          <button
            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all text-sm font-medium flex items-center space-x-1"
            title="Ver demo"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}