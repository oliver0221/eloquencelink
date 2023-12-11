package com.sydney5620.service.Impl;

import com.sydney5620.exception.BusinessException;
import com.sydney5620.mapper.UserMapper;
import com.sydney5620.pojo.User;
import com.sydney5620.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public User userLogin(User user) {
        User userFromDb = userMapper.getUserByUserName(user.getUserName());

        // Check if user exists in the database
        if (userFromDb == null) {
            throw new BusinessException("User does not exist");
        }

        if (user.getPassword().equals(userFromDb.getPassword())) {
            return userFromDb;
        }

        throw new BusinessException("Password is incorrect");
    }

    @Override
    public List<User> getUserByUserName(String userName) {
        List<User> userList = new ArrayList<>();
        User user = userMapper.getUserByUserName(userName);
        userList.add(user);
        return userList;
    }

    @Override
    public List<User> getAllUsers() {
        List<User> userList = userMapper.getAllUsers();
        return userList;
    }

    @Override
    public Integer addUser(User user) {
        if(user.getUserName() == null){
            throw new BusinessException("please enter userName");
        }
        User userByUserName = userMapper.getUserByUserName(user.getUserName());
        user.setUserStatus("1");
        //check whether the userName has existed
        if(userByUserName == null){
            return userMapper.addUser(user);
        }

        throw new BusinessException("UserName has already been taken");
    }

    @Override
    public Integer updateUser(User user) {
        User userByUserName = userMapper.getUserByUserName(user.getUserName());
        // check whether the  user who was found is same as updating user
        if (userByUserName != null && !userByUserName.getId().equals(user.getId())) {
            throw new BusinessException("UserName has already been taken");
        }

        return userMapper.updateUser(user);

    }

    @Override
    public Integer deleteUserByUserName(User user) {
        return userMapper.deleteUserByUserName(user);
    }


}
