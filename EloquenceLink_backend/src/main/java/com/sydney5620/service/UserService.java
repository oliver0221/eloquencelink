package com.sydney5620.service;

import com.sydney5620.pojo.User;

import java.util.List;

public interface UserService {
    User userLogin(User user);
    List<User> getUserByUserName(String userName);
    List<User> getAllUsers();
    Integer addUser(User user);
    Integer updateUser(User user);
    Integer deleteUserByUserName(User user);
}
