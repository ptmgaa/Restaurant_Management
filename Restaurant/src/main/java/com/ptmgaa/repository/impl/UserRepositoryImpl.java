/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.repository.impl;

import com.ptmgaa.pojo.User;
import com.ptmgaa.repository.UserRepository;
import jakarta.persistence.Query;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
/**
 *
 * @author Miee
 */
@Repository
@Transactional
public class UserRepositoryImpl implements UserRepository {
    @Autowired
    private LocalSessionFactoryBean factory;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public User getUserByUsername(String username) {
        Session session = this.factory.getObject().getCurrentSession();
        Query q = session.createQuery("FROM User WHERE username = :username", User.class);
        q.setParameter("username", username);

        try {
            return (User) q.getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public User addUser(User u) {
        Session session = this.factory.getObject().getCurrentSession();
        session.persist(u);
        
        return u;
    }

    @Override
    public boolean authenticate(String username, String password) {
        User u = this.getUserByUsername(username);
        if (u == null) return false;

        return this.passwordEncoder.matches(password, u.getPassword());
    }
    
    @Override
    public User getUserById(int id) {
        Session session = this.factory.getObject().getCurrentSession();
        return session.get(User.class, id);
    }
    
    @Override
    public boolean approveChef(int chefId) {
        Session session = this.factory.getObject().getCurrentSession();
        try {
            User u = session.get(User.class, chefId);
            if (u != null && u.getRoleId().getId() == 2) {
                u.setIsApproved(true);
                session.merge(u);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
    
    @Override
    public User updateUser(User u) {
        Session session = this.factory.getObject().getCurrentSession();
        session.merge(u);
        return u;
    }
}
