import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AssistantConfig, KnowledgeItem } from '../types';

export function useAssistant(userId?: string) {
  const [assistants, setAssistants] = useState<AssistantConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchAssistants();
    }
  }, [userId]);

  const fetchAssistants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assistants')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const assistantsWithKnowledge = await Promise.all(
        (data || []).map(async (assistant) => {
          const { data: knowledgeData } = await supabase
            .from('knowledge_base')
            .select('*')
            .eq('assistant_id', assistant.id);

          return {
            id: assistant.id,
            name: assistant.name,
            personality: assistant.personality,
            language: assistant.language,
            tone: assistant.tone as 'formal' | 'casual' | 'friendly',
            primaryColor: assistant.primary_color,
            secondaryColor: assistant.secondary_color,
            logo: assistant.logo,
            position: assistant.position as 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left',
            knowledgeBase: (knowledgeData || []).map((kb) => ({
              id: kb.id,
              title: kb.title,
              content: kb.content,
              category: kb.category,
              tags: kb.tags,
              createdAt: kb.created_at,
              updatedAt: kb.updated_at,
            })),
            isActive: assistant.is_active,
            createdAt: assistant.created_at,
            updatedAt: assistant.updated_at,
          };
        })
      );

      setAssistants(assistantsWithKnowledge);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar asistentes');
    } finally {
      setLoading(false);
    }
  };

  const createAssistant = async (assistantData: Partial<AssistantConfig>) => {
    try {
      const { data, error } = await supabase
        .from('assistants')
        .insert({
          user_id: userId,
          name: assistantData.name || 'Mi Asistente',
          personality: assistantData.personality || 'Soy un asistente amigable y útil',
          language: assistantData.language || 'es',
          tone: assistantData.tone || 'friendly',
          primary_color: assistantData.primaryColor || '#3B82F6',
          secondary_color: assistantData.secondaryColor || '#10B981',
          position: assistantData.position || 'bottom-right',
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchAssistants();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Error al crear asistente' };
    }
  };

  const updateAssistant = async (assistantId: string, updates: Partial<AssistantConfig>) => {
    try {
      const { data, error } = await supabase
        .from('assistants')
        .update({
          name: updates.name,
          personality: updates.personality,
          language: updates.language,
          tone: updates.tone,
          primary_color: updates.primaryColor,
          secondary_color: updates.secondaryColor,
          logo: updates.logo,
          position: updates.position,
          is_active: updates.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', assistantId)
        .select()
        .single();

      if (error) throw error;

      await fetchAssistants();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Error al actualizar asistente' };
    }
  };

  const deleteAssistant = async (assistantId: string) => {
    try {
      const { error } = await supabase
        .from('assistants')
        .delete()
        .eq('id', assistantId);

      if (error) throw error;

      await fetchAssistants();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Error al eliminar asistente' };
    }
  };

  const addKnowledgeItem = async (assistantId: string, knowledgeItem: Partial<KnowledgeItem>) => {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert({
          assistant_id: assistantId,
          title: knowledgeItem.title || '',
          content: knowledgeItem.content || '',
          category: knowledgeItem.category || 'general',
          tags: knowledgeItem.tags || [],
        })
        .select()
        .single();

      if (error) throw error;

      await fetchAssistants();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Error al agregar conocimiento' };
    }
  };

  const updateKnowledgeItem = async (knowledgeId: string, updates: Partial<KnowledgeItem>) => {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .update({
          title: updates.title,
          content: updates.content,
          category: updates.category,
          tags: updates.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', knowledgeId)
        .select()
        .single();

      if (error) throw error;

      await fetchAssistants();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Error al actualizar conocimiento' };
    }
  };

  const deleteKnowledgeItem = async (knowledgeId: string) => {
    try {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', knowledgeId);

      if (error) throw error;

      await fetchAssistants();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Error al eliminar conocimiento' };
    }
  };

  return {
    assistants,
    loading,
    error,
    createAssistant,
    updateAssistant,
    deleteAssistant,
    addKnowledgeItem,
    updateKnowledgeItem,
    deleteKnowledgeItem,
    refetch: fetchAssistants,
  };
}