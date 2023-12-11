package com.sydney5620.service;

import com.sydney5620.pojo.AIAssistant;

import java.util.List;

public interface AIAssistanceService {
    List<AIAssistant> findAllAIAssistance();

    AIAssistant getAIAssistantByAIName(String aiName);

    Integer updateAIAssistanceById(AIAssistant aiAssistant);

    List<AIAssistant> getAIAssistantByUserId(String userId);

    Integer deleteAIAssistanceById(Long aiId);

    void updateContent(AIAssistant aiAssistant);

    void addAIAssistance(AIAssistant aiAssistant);

}
