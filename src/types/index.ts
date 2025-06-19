export interface AssistantConfig {
  id: string;
  name: string;
  personality: string;
  language: string;
  tone: 'formal' | 'casual' | 'friendly';
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  knowledgeBase: KnowledgeItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  assistantId: string;
  messages: Message[];
  startedAt: string;
  endedAt?: string;
  userLocation?: string;
  userAgent?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audioUrl?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AssistantStats {
  totalConversations: number;
  averageSessionLength: number;
  popularQuestions: Array<{
    question: string;
    count: number;
  }>;
  dailyUsage: Array<{
    date: string;
    conversations: number;
  }>;
}