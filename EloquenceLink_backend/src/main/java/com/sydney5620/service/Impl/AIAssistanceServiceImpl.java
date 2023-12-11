package com.sydney5620.service.Impl;

import com.sydney5620.exception.BusinessException;
import com.sydney5620.mapper.AIAssistantMapper;
import com.sydney5620.pojo.AIAssistant;
import com.sydney5620.service.AIAssistanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AIAssistanceServiceImpl implements AIAssistanceService {
    @Autowired
    private AIAssistantMapper aIAssistantMapper;

    @Override
    public List<AIAssistant> findAllAIAssistance() {
        List<AIAssistant> assistantList = aIAssistantMapper.getAllAIAssistance();
        return assistantList;
    }

    @Override
    public AIAssistant getAIAssistantByAIName(String aiName) {
        AIAssistant aiAssistant = aIAssistantMapper.getAIAssistanceByAIName(aiName);
        return aiAssistant;
    }

    @Override
    public Integer updateAIAssistanceById(AIAssistant aiAssistant) {
        Integer count = aIAssistantMapper.updateAIAssistance(aiAssistant);
        if(aIAssistantMapper.updateAIAssistance(aiAssistant) != 0){
            return count;
        }
        throw new BusinessException("update failed : this AI does not exist");
    }
    @Override
    public List<AIAssistant> getAIAssistantByUserId(String userId){
        List<AIAssistant> aiAssistants = aIAssistantMapper.getAIAssistanceByUserId(userId);
        return aiAssistants;
    }
    @Override
    public Integer deleteAIAssistanceById(Long aiId) {
        Integer count = aIAssistantMapper.deleteAIAssistanceByAIId(aiId);
        if(count != 0){
            return count;
        }
        throw new BusinessException("delete failed : this AI does not exist");
    }

    @Override
    public void updateContent(AIAssistant aiAssistant) {
        aIAssistantMapper.updateContent(aiAssistant);
    }

    @Override
    public void addAIAssistance(AIAssistant aiAssistant) {
        aIAssistantMapper.addAIAssistance(aiAssistant);
    }
}
