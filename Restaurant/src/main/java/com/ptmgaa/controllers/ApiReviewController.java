/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.controllers;

import com.ptmgaa.pojo.Review;
import com.ptmgaa.service.ReviewService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
/**
 *
 * @author Miee
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class ApiReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/dishes/{dishId}/reviews")
    public ResponseEntity<List<Review>> getReviews(@PathVariable("dishId") int dishId) {
        return new ResponseEntity<>(this.reviewService.getReviewsByDishId(dishId), HttpStatus.OK);
    }

    @PostMapping("/secure/dishes/{dishId}/reviews")
    public ResponseEntity<?> addReview(@PathVariable("dishId") int dishId, @RequestBody Review r) {
        try {
            Review newReview = this.reviewService.addReview(dishId, r);
            return new ResponseEntity<>(newReview, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}