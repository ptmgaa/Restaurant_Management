/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.repository;

import com.ptmgaa.pojo.User;

/**
 *
 * @author Miee
 */
public interface UserRepository {
    User getUserByUsername(String username);
    User addUser(User u);
    boolean authenticate(String username, String password);
    boolean approveChef(int chefId);
    User updateUser(User u);
    User getUserById(int id);
}