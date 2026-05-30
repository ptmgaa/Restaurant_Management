/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.service;

import com.ptmgaa.pojo.User;
import java.util.Map;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Miee
 */
public interface UserService extends UserDetailsService {
    User getUserByUsername(String username) ;
    User addUser(Map<String, String> params, MultipartFile avatar);
    boolean authenticate(String username, String password);
    boolean approveChef(int chefId);
    User updateUser(Map<String, String> params, MultipartFile avatar, String currentUsername);
}
