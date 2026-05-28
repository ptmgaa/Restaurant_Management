/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.repository.impl;

import com.ptmgaa.pojo.Category;
import com.ptmgaa.repository.CategoryRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
/**
 *
 * @author Miee
 */
@Repository
@Transactional
public class CategoryRepositoryImpl implements CategoryRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Category> getCates() {
        Session session = this.factory.getObject().getCurrentSession();
        Query<Category> query = session.createQuery("FROM Category c WHERE c.active = true", Category.class);
        return query.getResultList();
    }

    @Override
    public Category getCategoryById(Integer id) {
        Session session = this.factory.getObject().getCurrentSession();
        return session.get(Category.class, id);
    }

    @Override
    public boolean addOrUpdateCategory(Category c) {
        Session session = this.factory.getObject().getCurrentSession();
        try {
            if (c.getId() != null) {
                session.merge(c);
            } else {
                session.persist(c);
            }
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean deleteCategory(Integer id) {
        Session session = this.factory.getObject().getCurrentSession();
        try {
            Category c = this.getCategoryById(id);
            if (c != null) {
                c.setActive(false);
                session.merge(c);
                return true;
            }
            return false;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }
}