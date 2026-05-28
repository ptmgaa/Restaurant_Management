/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.repository.impl;

import java.util.List;
import com.ptmgaa.pojo.Dish;
import com.ptmgaa.pojo.Menu;
import com.ptmgaa.repository.MenuRepository;
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
public class MenuRepositoryImpl implements MenuRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Menu> getMenus() {
        Session session = this.factory.getObject().getCurrentSession();
        Query<Menu> query = session.createQuery("FROM Menu", Menu.class);
        return query.getResultList();
    }

    @Override
    public void addOrUpdateMenu(Menu m) {
        Session session = this.factory.getObject().getCurrentSession();
        if (m.getId() != null) {
            session.merge(m);
        } else {
            session.persist(m);
        }
    }

    @Override
    public Menu getMenuById(int id) {
        Session session = this.factory.getObject().getCurrentSession();
        return session.get(Menu.class, id);
    }

    @Override
    public void deleteMenu(int id) {
        Session session = this.factory.getObject().getCurrentSession();
        Menu m = this.getMenuById(id);
        if (m != null) {
            session.remove(m); 
        }
    }

    @Override
    public boolean addDishToMenu(int menuId, int dishId) {
        Session session = this.factory.getObject().getCurrentSession();
        try {
            Menu m = session.get(Menu.class, menuId);
            Dish d = session.get(Dish.class, dishId);
            
            if (m != null && d != null) {
                m.getDishSet().add(d);
                session.merge(m);
                return true;
            }
            return false;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean removeDishFromMenu(int menuId, int dishId) {
        Session session = this.factory.getObject().getCurrentSession();
        try {
            Menu m = session.get(Menu.class, menuId);
            Dish d = session.get(Dish.class, dishId);
            
            if (m != null && d != null) {
                m.getDishSet().remove(d);
                session.merge(m);
                return true;
            }
            return false;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }
}