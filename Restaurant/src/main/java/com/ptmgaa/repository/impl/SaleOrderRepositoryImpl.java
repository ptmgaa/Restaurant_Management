/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.repository.impl;
import com.ptmgaa.pojo.CartItem;
import com.ptmgaa.pojo.DiningTable;
import com.ptmgaa.pojo.Dish;
import com.ptmgaa.pojo.OrderDetail;
import com.ptmgaa.pojo.OrderRequest;
import com.ptmgaa.pojo.OrderStatus;
import com.ptmgaa.pojo.PaymentMethod;
import com.ptmgaa.pojo.SaleOrder;
import com.ptmgaa.repository.SaleOrderRepository;
import com.ptmgaa.repository.UserRepository;
import java.util.Date;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
/**
 *
 * @author Miee
 */
@Repository
@Transactional
public class SaleOrderRepositoryImpl implements SaleOrderRepository {

    @Autowired
    private LocalSessionFactoryBean factory;
    
    @Autowired
    private UserRepository userRepo;

    @Override
    public SaleOrder addSaleOrder(OrderRequest orderReq) {
        Session session = this.factory.getObject().getCurrentSession();
        
        SaleOrder order = new SaleOrder();
        order.setOrderDate(new Date());
        if (orderReq.getPaymentMethod() != null) {
            order.setPaymentMethod(PaymentMethod.valueOf(orderReq.getPaymentMethod().toUpperCase()));
        }        
        order.setStatus(OrderStatus.PENDING);
        
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        order.setCustomerId(this.userRepo.getUserByUsername(currentUsername));

        if (orderReq.getTableId() != null) {
            DiningTable table = session.get(DiningTable.class, orderReq.getTableId());
            order.setDiningTable(table);
            order.setReservationTime(orderReq.getReservationTime());
        }

        session.persist(order);

        double totalAmount = 0.0;
        
        if (orderReq.getCart() != null) {
            for (CartItem c : orderReq.getCart()) {
                OrderDetail detail = new OrderDetail();
                detail.setOrderId(order);
                
                Dish dish = session.get(Dish.class, c.getId());
                if (dish != null) {
                    detail.setDishId(dish);
                    detail.setQuantity(c.getQuantity());
                    detail.setUnitPrice(dish.getPrice()); 
                    
                    session.persist(detail);
                    totalAmount += (dish.getPrice() * c.getQuantity());
                }
            }
        }

        order.setTotalAmount(totalAmount);
        session.merge(order);

        return order;
    }
    
    @Override
    public SaleOrder getOrderById(int id) {
        Session session = this.factory.getObject().getCurrentSession();
        return session.get(SaleOrder.class, id);
    }
    
    @Override
    public SaleOrder updateSaleOrder(SaleOrder order) {
        Session session = this.factory.getObject().getCurrentSession();
        session.merge(order);
        return order;
    }
}
