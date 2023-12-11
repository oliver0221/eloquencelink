package com.sydney5620.controller;

import com.sydney5620.common.Result;
import com.sydney5620.pojo.AIAssistant;
import com.sydney5620.service.AIAssistanceService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@ResponseBody
@RequestMapping("/admin/ai")
@Api(tags = "ai Interface")
public class AIAssistanceController {
    @Autowired
    private AIAssistanceService aiAssistanceService;

    @ApiOperation("getAllAIAssistance")
    @GetMapping("/getAllAIAssistance")
    public Result<List<AIAssistant>> getAllAIAssistance(){
        List<AIAssistant> list = aiAssistanceService.findAllAIAssistance();
        return Result.success(list);
    }

    @ApiOperation("getAIAssistanceByUserId")
    @GetMapping("/getAIAssistanceById")
    public Result<List<AIAssistant>> getAIAssistanceById(@RequestParam String userId) {
        List<AIAssistant> aiAssistantByAIName = aiAssistanceService.getAIAssistantByUserId(userId);
        return Result.success(aiAssistantByAIName);
    }

    @ApiOperation("getAIAssistanceByAIName")
    @GetMapping("/getAIAssistance")
    public Result<AIAssistant> getAIAssistanceByAIName(@RequestParam String aiName) {
        AIAssistant aiAssistantByAIName = aiAssistanceService.getAIAssistantByAIName(aiName);
        return Result.success(aiAssistantByAIName);
    }

    @ApiOperation("updateAIAssistance")
    @PutMapping("/updateAIAssistance")
    public Result<String> updateAIAssistance(@RequestBody AIAssistant aiAssistant){
        aiAssistanceService.updateAIAssistanceById(aiAssistant);
        return Result.success("update successfully");

    }

    @ApiOperation("deleteAIAssistanceById")
    @DeleteMapping("/deleteAIAssistance/{aiId}")
    public Result<String> deleteAIAssistanceByAIId(@PathVariable Long aiId){
        aiAssistanceService.deleteAIAssistanceById(aiId);
        return Result.success("delete successfully");
    }

    @ApiOperation("saveChatContentByUserId")
    @PutMapping("/saveChatContent")
    public Result<String> saveChatContent(@RequestBody AIAssistant aiAssistant){
        aiAssistanceService.updateContent(aiAssistant);
        return Result.success(null, "save chat successfully");
    }

    @ApiOperation("addAIAssistance")
    @PostMapping("/addAIAssistance")
    public Result<String> addAIAssistance(@RequestBody AIAssistant ai){
        aiAssistanceService.addAIAssistance(ai);
        return Result.success("add successfully");
    }


}
