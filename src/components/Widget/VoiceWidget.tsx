import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, MessageSquare, X, Volume2, Send } from 'lucide-react';
import { AssistantConfig, Message } from '../../types';

interface VoiceWidgetProps {
  assistant: AssistantConfig;
  onClose?: () => void;
}

export function VoiceWidget({ assistant, onClose }: VoiceWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Configurar reconocimiento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = assistant.language === 'es' ? 'es-ES' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentTranscript(transcript);
        
        if (event.results[event.results.length - 1].isFinal) {
          handleVoiceMessage(transcript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setCurrentTranscript('');
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Error de reconocimiento de voz:', event.error);
        setIsListening(false);
        setCurrentTranscript('');
      };
    }
  }, [assistant.language]);

  // Scroll automático a nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Mensaje de bienvenida
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `¡Hola! Soy ${assistant.name}. ${assistant.personality} ¿En qué puedo ayudarte hoy?`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
      speakMessage(welcomeMessage.content);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleVoiceMessage = async (transcript: string) => {
    if (!transcript.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: transcript,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Simular respuesta del asistente (aquí iría la integración con IA)
      const response = await processMessage(transcript);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      speakMessage(response);
    } catch (error) {
      console.error('Error al procesar mensaje:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, he tenido un problema técnico. ¿Podrías repetir tu pregunta?',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      speakMessage(errorMessage.content);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    await handleVoiceMessage(inputValue);
    setInputValue('');
  };

  const processMessage = async (message: string): Promise<string> => {
    // Simular procesamiento (aquí iría la integración con RAG + GPT)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Respuestas básicas de demostración
    const responses = [
      `Entiendo tu consulta sobre "${message}". Basándome en mi conocimiento, puedo ayudarte con eso.`,
      `Gracias por tu pregunta. Permíteme buscar en mi base de conocimiento para darte la mejor respuesta.`,
      `Es una excelente pregunta. Según la información que tengo disponible, te puedo decir que...`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = assistant.language === 'es' ? 'es-ES' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const getPositionClasses = () => {
    switch (assistant.position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      {/* Widget Chat */}
      {isOpen && (
        <div className="mb-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4 text-white"
            style={{ background: `linear-gradient(135deg, ${assistant.primaryColor}, ${assistant.secondaryColor})` }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">{assistant.name}</h3>
                <p className="text-xs opacity-90">
                  {isProcessing ? 'Procesando...' : isListening ? 'Escuchando...' : 'En línea'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Transcripción en tiempo real */}
            {currentTranscript && (
              <div className="flex justify-end">
                <div className="max-w-xs px-4 py-2 rounded-2xl bg-blue-100 text-blue-900 border-2 border-blue-300 border-dashed">
                  <p className="text-sm">{currentTranscript}</p>
                  <p className="text-xs opacity-70 mt-1">Transcribiendo...</p>
                </div>
              </div>
            )}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleTextMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`p-2 rounded-full transition-all ${
                  isListening
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                type="submit"
                disabled={!inputValue.trim() || isProcessing}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={toggleWidget}
        className="w-14 h-14 rounded-full shadow-2xl text-white flex items-center justify-center hover:scale-105 transition-all duration-300"
        style={{ background: `linear-gradient(135deg, ${assistant.primaryColor}, ${assistant.secondaryColor})` }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}