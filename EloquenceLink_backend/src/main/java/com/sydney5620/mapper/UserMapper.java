package com.sydney5620.mapper;

import com.sydney5620.pojo.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {

    @Select("select * from user where user_name = #{userName}")
    User getUserByUserName(String userName);

    @Select("select * from user")
    List<User> getAllUsers();

    @Insert("INSERT INTO user (password, user_name, user_status) VALUES (#{password}, #{userName}, #{userStatus})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int addUser(User user);

    @Update("UPDATE user SET user_name=#{userName}, password=#{password}, user_status=#{userStatus} WHERE id=#{id}")
    int updateUser(User user);

    @Delete("delete from user where user_name = #{userName}")
    int deleteUserByUserName(User user);

}
