/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.repository.impl;

import com.ptmgaa.pojo.Review;
import com.ptmgaa.repository.ReviewRepository;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
/**
 *
 * @author Miee
 */
@Repository
@Transactional
public class ReviewRepositoryImpl implements ReviewRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Review addReview(Review r) {
        Session session = this.factory.getObject().getCurrentSession();
        session.persist(r);
        return r;
    }

    @Override
    public List<Review> getReviewsByDishId(int dishId) {
        Session session = this.factory.getObject().getCurrentSession();
        Query q = session.createQuery("FROM Review r WHERE r.dishId.id = :dishId ORDER BY r.createdAt DESC", Review.class);
        q.setParameter("dishId", dishId);
        return q.getResultList();
    }
}
