/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ptmgaa.pojo.Role;
import com.ptmgaa.pojo.User;
import com.ptmgaa.repository.UserRepository;
import com.ptmgaa.service.UserService;
import java.io.IOException;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Miee
 */
@Service("userDetailsService")
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public User getUserByUsername(String username) {
        return this.userRepo.getUserByUsername(username);
    }

    @Override
    public User addUser(Map<String, String> params, MultipartFile avatar) {
        String username = params.get("username");
        String password = params.get("password");
        String email = params.get("email");
        String fullName = params.get("fullName");
        String phone = params.get("phone");
        
        int roleId = params.get("roleId") != null ? Integer.parseInt(params.get("roleId")) : 3;
        if (roleId == 1) {
            throw new IllegalArgumentException("Không được phép tạo tài khoản Admin qua API này!");
        }
        
        if (username == null || username.trim().isEmpty() ||
            password == null || password.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng điền đầy đủ Username, Password, FullName, Email!");
        }
        if (username.length() < 5) {
            throw new IllegalArgumentException("Username phải từ 5 ký tự trở lên!");
        }

        if (this.userRepo.getUserByUsername(username) != null) {
            throw new IllegalArgumentException("Username này đã tồn tại!");
        }

        if (!password.matches("^(?=.*[A-Za-z])(?=.*\\d).{6,}$")) {
            throw new IllegalArgumentException("Mật khẩu phải từ 6 ký tự trở lên và chứa cả chữ và số!");
        }

        if (!email.contains("@")) {
            throw new IllegalArgumentException("Email không hợp lệ (phải có ký tự @)!");
        }

        if (phone != null && !phone.trim().isEmpty() && !phone.matches("\\d{10}")) {
            throw new IllegalArgumentException("Số điện thoại phải đúng 10 chữ số!");
        }
        
        User u = new User();
        u.setFullName(params.get("fullName"));
        u.setPhone(params.get("phone"));
        u.setEmail(params.get("email"));
        u.setUsername(params.get("username"));
        u.setPassword(passwordEncoder.encode(params.get("password")));
        
        Role role = new Role();
        role.setId(roleId);
        u.setRoleId(role);
        
        if (roleId == 2) {
            u.setIsApproved(false);
        } else {
            u.setIsApproved(true);
        }

        if (avatar != null && !avatar.isEmpty()) {
            try {
                Map res = this.cloudinary.uploader().upload(avatar.getBytes(),
                        ObjectUtils.asMap("resource_type", "auto"));
                u.setAvatar(res.get("secure_url").toString());
            } catch (IOException ex) {
                Logger.getLogger(UserServiceImpl.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        return this.userRepo.addUser(u);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userRepo.getUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("Không tồn tại!");
        }
        
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(user.getRoleId().getName()));
        
        return new org.springframework.security.core.userdetails.User(user.getUsername(),
                user.getPassword(), authorities);
    }

    @Override
    public boolean authenticate(String username, String password) {
        return this.userRepo.authenticate(username, password);
    }

    @Override
    public boolean approveChef(int chefId) {
        return this.userRepo.approveChef(chefId);
    }

    @Override
    public User updateUser(Map<String, String> params, MultipartFile avatar, String currentUsername) {
        User u = this.userRepo.getUserByUsername(currentUsername);
        
        if (params.containsKey("fullName")) u.setFullName(params.get("fullName"));
        if (params.containsKey("phone")) u.setPhone(params.get("phone"));
        if (params.containsKey("email")) u.setEmail(params.get("email"));
        
        if (avatar != null && !avatar.isEmpty()) {
            try {
                Map res = this.cloudinary.uploader().upload(avatar.getBytes(),
                        ObjectUtils.asMap("resource_type", "auto"));
                u.setAvatar(res.get("secure_url").toString());
            } catch (IOException ex) {
                Logger.getLogger(UserServiceImpl.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        
        return this.userRepo.updateUser(u);
    }
}
