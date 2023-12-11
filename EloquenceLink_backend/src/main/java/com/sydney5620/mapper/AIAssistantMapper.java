package com.sydney5620.mapper;

import com.sydney5620.pojo.AIAssistant;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AIAssistantMapper {

    @Select("select * from ai")
    List<AIAssistant> getAllAIAssistance();

    @Select("select * from ai where ai_name = #{aiName}")
    AIAssistant getAIAssistanceByAIName(String aiName);

    @Update("UPDATE ai Set ai_name = #{aiName}, command = #{command}, creativity = #{creativity}, contextCount = #{contextCount}, replyLength = #{replyLength} where ai_id = #{aiId}")
    Integer updateAIAssistance(AIAssistant aiAssistant);

    @Delete("delete from ai where ai_id = #{aiId}")
    Integer deleteAIAssistanceByAIId(Long aIId);

    @Select("select * from ai where userId = #{userId}")
    List<AIAssistant> getAIAssistanceByUserId(String UserId);
    void updateContent(AIAssistant aiAssistant);

    @Insert("insert into ai (userId, ai_name, command, creativity, contextCount, replyLength) values (#{userId}, #{aiName}, #{command}, #{creativity}, #{contextCount}, #{replyLength})")
    void addAIAssistance(AIAssistant aiAssistant);
}
