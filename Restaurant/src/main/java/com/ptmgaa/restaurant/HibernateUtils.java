/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.restaurant;

import com.ptmgaa.pojo.*;
import java.util.Properties;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Environment;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

/**
 *
 * @author Miee
 */
public class HibernateUtils {
    private static final SessionFactory factory;

    static {
        Configuration conf = new Configuration();
        Properties props = new Properties();
        
        props.setProperty(Environment.DIALECT, "org.hibernate.dialect.MySQLDialect");
        props.setProperty(Environment.JAKARTA_JDBC_DRIVER, "com.mysql.cj.jdbc.Driver");
        props.setProperty(Environment.JAKARTA_JDBC_URL, "jdbc:mysql://localhost/resdb");
        props.setProperty(Environment.JAKARTA_JDBC_USER, "root");
        props.setProperty(Environment.JAKARTA_JDBC_PASSWORD, "root");
        props.setProperty(Environment.SHOW_SQL, "true");
        
        
        props.setProperty(Environment.HBM2DDL_AUTO, "update");
        
        conf.setProperties(props);
        
        conf.addAnnotatedClass(Role.class);
        conf.addAnnotatedClass(User.class);
        conf.addAnnotatedClass(Category.class);
        conf.addAnnotatedClass(Ingredient.class);
        conf.addAnnotatedClass(Dish.class);
        conf.addAnnotatedClass(Menu.class);
        conf.addAnnotatedClass(SaleOrder.class);
        conf.addAnnotatedClass(OrderDetail.class);
        conf.addAnnotatedClass(Transaction.class);
        conf.addAnnotatedClass(Review.class);

        ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                .applySettings(conf.getProperties())
                .build();

        factory = conf.buildSessionFactory(serviceRegistry);
    }
    /**
     * @return the factory
     */
    public static SessionFactory getFactory() {
        return factory;
    }
}
