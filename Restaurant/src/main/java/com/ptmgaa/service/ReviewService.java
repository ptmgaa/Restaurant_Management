/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.service;

import com.ptmgaa.pojo.Review;
import java.util.List;
/**
 *
 * @author Miee
 */
public interface ReviewService {
    Review addReview(int dishId, Review r);
    List<Review> getReviewsByDishId(int dishId);
}
