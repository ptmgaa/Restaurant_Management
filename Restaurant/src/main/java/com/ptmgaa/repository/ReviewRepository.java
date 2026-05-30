/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.repository;

import com.ptmgaa.pojo.Review;
import java.util.List;
/**
 *
 * @author Miee
 */
public interface ReviewRepository {
    Review addReview(Review r);
    List<Review> getReviewsByDishId(int dishId);
}
