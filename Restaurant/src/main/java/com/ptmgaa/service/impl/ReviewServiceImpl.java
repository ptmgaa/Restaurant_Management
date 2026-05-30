/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.service.impl;

import com.ptmgaa.pojo.Dish;
import com.ptmgaa.pojo.Review;
import com.ptmgaa.pojo.User;
import com.ptmgaa.repository.DishRepository;
import com.ptmgaa.repository.ReviewRepository;
import com.ptmgaa.repository.UserRepository;
import com.ptmgaa.service.ReviewService;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
/**
 *
 * @author Miee
 */
@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepo;
    
    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private DishRepository dishRepo;

    @Override
    public Review addReview(int dishId, Review r) {
        if (r.getRating() == null || r.getRating() < 1 || r.getRating() > 5) {
            throw new IllegalArgumentException("Số sao đánh giá phải từ 1 đến 5!");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = this.userRepo.getUserByUsername(auth.getName());

        Dish d = this.dishRepo.getDishById(dishId);
        if (d == null) {
            throw new IllegalArgumentException("Không tìm thấy món ăn này!");
        }

        r.setCustomerId(currentUser);
        r.setDishId(d);
        r.setCreatedAt(new Date());

        return this.reviewRepo.addReview(r);
    }

    @Override
    public List<Review> getReviewsByDishId(int dishId) {
        return this.reviewRepo.getReviewsByDishId(dishId);
    }
}