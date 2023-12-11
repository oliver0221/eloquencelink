package com.sydney5620.controller;

import com.sydney5620.common.Result;
import com.sydney5620.pojo.AIAssistant;
import com.sydney5620.pojo.User;
import com.sydney5620.service.AIAssistanceService;
import com.sydney5620.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.Builder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@ResponseBody
@RequestMapping("/admin/user")
@Api(tags = "user interface")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private AIAssistanceService aiAssistanceService;

    @ApiOperation("UserLogin")
    @PostMapping("/login")
    public Result<User> userLogin(@RequestBody User user) {
        User userLogin = userService.userLogin(user);
        return Result.success(userLogin);

    }

    @ApiOperation("getAllUser")
    @GetMapping("/getAllUsers")
    public Result<List<User>> getAllUsers() {
        System.out.println("111");
        List<User> userList = userService.getAllUsers();
        return Result.success(userList);


    }

    @ApiOperation("getUserByName")
    @GetMapping("/getUserByName")
    public Result<List<User>> searchUserByUserName(@RequestParam String userName) {
        List<User> userByUserName = userService.getUserByUserName(userName);
        return Result.success(userByUserName);
    }


    @ApiOperation("addUser")
    @PostMapping("/addUser")
    public Result<String> addUser(@RequestBody User user) {
        userService.addUser(user);
        //ai 1
        AIAssistant assistant = new AIAssistant();
        assistant.setAiName("Multilingual Learning Assistant");
        assistant.setCommand("You are a comprehensive language learning assistant capable of understanding and teaching multiple languages. Your task is to engage with the user in interactive language practice sessions, correct their mistakes, and provide constructive feedback to improve their language proficiency.");
        assistant.setCreativity(0.6);
        assistant.setContextCount(100);
        assistant.setReplyLength(1000);
        assistant.setUserId(user.getId());
        aiAssistanceService.addAIAssistance(assistant);
        //ai 2
        AIAssistant assistant2 = new AIAssistant();
        assistant2.setAiName("High EI Conversation Assistant");
        assistant2.setCommand("You are a highly emotionally intelligent assistant designed to help users navigate social interactions with sensitivity and appropriateness. Your role involves analyzing user emotions from text inputs, suggesting emotionally rich responses, and modifying feedback based on detected emotions.");
        assistant2.setCreativity(0.7);
        assistant2.setContextCount(100);
        assistant2.setReplyLength(1000);
        assistant2.setUserId(user.getId());
        aiAssistanceService.addAIAssistance(assistant2);
        return Result.success("add successfully");

    }

    @ApiOperation("updateUser")
    @PutMapping("/updateUser")
    public Result<String> updateUser(@RequestBody User user){
        userService.updateUser(user);
        return Result.success("update successfully");
    }

    @ApiOperation("deleteUser")
    @DeleteMapping("/deleteUser")
    public Result<String> deleteUser(@RequestBody User user){
        userService.deleteUserByUserName(user);
        return Result.success("delete successfully");
    }


}

