/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ptmgaa.pojo.Dish;
import com.ptmgaa.repository.DishRepository;
import com.ptmgaa.repository.UserRepository;
import com.ptmgaa.service.DishService;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
/**
 *
 * @author Miee
 */
@Service
public class DishServiceImpl implements DishService {
    @Autowired
    private DishRepository dishRepo;
    
    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private Cloudinary cloudinary;

    @Override
    public List<Dish> getDishes(Map<String, String> params) {
        return this.dishRepo.getDishes(params);
    }

    @Override
    public void addOrUpdateDish(Dish d) {
        if (d.getFile() != null && !d.getFile().isEmpty()) {
            try {
                Map res = this.cloudinary.uploader().upload(d.getFile().getBytes(), 
                        ObjectUtils.asMap("resource_type", "auto"));
                d.setImageUrl(res.get("secure_url").toString());
            } catch (IOException ex) {
                Logger.getLogger(DishServiceImpl.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        
        if (d.getId() == null && d.getChefId() == null) {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            d.setChefId(this.userRepo.getUserByUsername(currentUsername));
        }

        this.dishRepo.addOrUpdateDish(d);
    }

    @Override
    public Dish getDishById(int id) {
        return this.dishRepo.getDishById(id);
    }

    @Override
    public void deleteDish(int id) {
        this.dishRepo.deleteDish(id);
    }
    
    @Override
    public List<Dish> compareDishes(List<Integer> ids) {
        return this.dishRepo.compareDishes(ids);
    }
}