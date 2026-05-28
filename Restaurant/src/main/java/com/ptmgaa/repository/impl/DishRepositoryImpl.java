/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.repository.impl;

import com.ptmgaa.pojo.Dish;
import com.ptmgaa.repository.DishRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
/**
 *
 * @author Miee
 */
@Repository
@PropertySource("classpath:configs.properties")
@Transactional
public class DishRepositoryImpl implements DishRepository {
@Autowired
    private Environment env;

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Dish> getDishes(Map<String, String> params) {
        Session session = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Dish> q = b.createQuery(Dish.class);
        Root root = q.from(Dish.class);
        q.select(root);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(b.isTrue(root.get("active")));

        if (params != null) {
            String kw = params.get("kw");
            if (kw != null && !kw.isEmpty()) {
                predicates.add(b.like(root.get("name"), String.format("%%%s%%", kw)));
            }

            String fromPrice = params.get("fromPrice");
            if (fromPrice != null && !fromPrice.isEmpty()) {
                predicates.add(b.greaterThanOrEqualTo(root.get("price"), Double.parseDouble(fromPrice)));
            }

            String toPrice = params.get("toPrice");
            if (toPrice != null && !toPrice.isEmpty()) {
                predicates.add(b.lessThanOrEqualTo(root.get("price"), Double.parseDouble(toPrice)));
            }
            
            String cateId = params.get("cateId");
            if (cateId != null && !cateId.isEmpty()) {
                predicates.add(b.equal(root.get("categoryId").as(Integer.class), Integer.parseInt(cateId)));
            }
            
            String chefId = params.get("chefId");
            if (chefId != null && !chefId.isEmpty()) {
                predicates.add(b.equal(root.get("chefId").as(Integer.class), Integer.parseInt(chefId)));
            }
            
            String prepTime = params.get("prepTime");
            if (prepTime != null && !prepTime.isEmpty()) {
                predicates.add(b.lessThanOrEqualTo(root.get("prepTime"), Integer.parseInt(prepTime)));
            }
        }
        
        q.where(predicates.toArray(Predicate[]::new));
        String sort = params.get("sort");
        if (sort != null && !sort.isEmpty()) {
            if (sort.equals("price_asc")) {
                q.orderBy(b.asc(root.get("price")));
            } else if (sort.equals("price_desc")) {
                q.orderBy(b.desc(root.get("price")));
            } else if (sort.equals("name")) {
                q.orderBy(b.asc(root.get("name")));
            }
        } else {
            q.orderBy(b.desc(root.get("id")));
        }
        
        Query query = session.createQuery(q);

        if (params != null && params.containsKey("page")) {
            int pageSize = this.env.getProperty("products.page_size", Integer.class);
            int page = Integer.parseInt(params.getOrDefault("page", "1"));
            int start = (page - 1) * pageSize;

            query.setMaxResults(pageSize);
            query.setFirstResult(start);
        }

        return query.getResultList();
    }

    @Override
    public Dish getDishById(int id) {
        Session session = this.factory.getObject().getCurrentSession();
        return session.get(Dish.class, id);
    }

    @Override
    public void addOrUpdateDish(Dish d) {
        Session session = this.factory.getObject().getCurrentSession();
        if (d.getId() != null) {
            session.merge(d);
        } else {
            session.persist(d);
        }
    }
    
    @Override
    public void deleteDish(int id) {
        Session session = this.factory.getObject().getCurrentSession();
        Dish d = this.getDishById(id);
        if(d != null) {
            d.setActive(false);
            session.merge(d);
        }
    }
}