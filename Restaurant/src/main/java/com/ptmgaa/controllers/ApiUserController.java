/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.controllers;

import com.ptmgaa.pojo.User;
import com.ptmgaa.service.UserService;
import com.ptmgaa.utils.JwtUtils;
import java.security.Principal;
import java.util.Collections;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Miee
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class ApiUserController {
    @Autowired
    private UserService userService;
    
    @PostMapping(path = "/users", 
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE, 
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> create(@RequestParam Map<String, String> params, 
            @RequestParam(value = "avatar") MultipartFile avatar) {
        User u = this.userService.addUser(params, avatar);
        
        return new ResponseEntity<>(u, HttpStatus.CREATED);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User u) {

        if (this.userService.authenticate(u.getUsername(), u.getPassword())) {
            
            User currentUser = this.userService.getUserByUsername(u.getUsername());
            if (currentUser.getIsApproved() != null && !currentUser.getIsApproved()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tài khoản đang chờ Admin phê duyệt.");
            }

            try {
                String token = JwtUtils.generateToken(u.getUsername());
                return ResponseEntity.ok().body(Collections.singletonMap("token", token));
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Lỗi khi tạo JWT");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai thông tin đăng nhập");
    }
    
    @PostMapping("/admin/approve-chef/{chefId}")
    public ResponseEntity<String> approveChef(@PathVariable(value = "chefId") int chefId) {
        if (this.userService.approveChef(chefId)) {
            return new ResponseEntity<>("Duyệt tài khoản đầu bếp thành công!", HttpStatus.OK);
        }
        return new ResponseEntity<>("Không tìm thấy tài khoản hoặc lỗi hệ thống.", HttpStatus.BAD_REQUEST);
    }

    @PostMapping(path = "/secure/profile/update", 
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE, 
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> updateProfile(@RequestParam Map<String, String> params, 
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            Principal principal) {
        
        User updatedUser = this.userService.updateUser(params, avatar, principal.getName());
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @RequestMapping("/secure/profile")
    @ResponseBody
    public ResponseEntity<User> getProfile(Principal principal) {
        return new ResponseEntity<>(this.userService.getUserByUsername(principal.getName()), HttpStatus.OK);
    }
}