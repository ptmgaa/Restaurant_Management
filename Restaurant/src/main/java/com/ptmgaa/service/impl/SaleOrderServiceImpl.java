/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.service.impl;
import com.ptmgaa.pojo.OrderRequest;
import com.ptmgaa.pojo.OrderStatus;
import com.ptmgaa.pojo.SaleOrder;
import com.ptmgaa.pojo.User;
import com.ptmgaa.repository.SaleOrderRepository;
import com.ptmgaa.repository.UserRepository;
import com.ptmgaa.service.SaleOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
/**
 *
 * @author Miee
 */
@Service
public class SaleOrderServiceImpl implements SaleOrderService {

    @Autowired
    private SaleOrderRepository orderRepo;

    @Autowired
    private UserRepository userRepo;
    
    @Override
    public SaleOrder addSaleOrder(OrderRequest orderReq) {
        if (orderReq.getCart() == null || orderReq.getCart().isEmpty()) {
            throw new IllegalArgumentException("Giỏ hàng không được để trống!");
        }
        return this.orderRepo.addSaleOrder(orderReq);
    }
    
    @Override
    public SaleOrder updateOrderStatus(int orderId, OrderStatus newStatus) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = this.userRepo.getUserByUsername(currentUsername);
        int roleId = currentUser.getRoleId().getId();

        SaleOrder order = this.orderRepo.getOrderById(orderId);
        if (order == null) {
            throw new IllegalArgumentException("Không tìm thấy đơn hàng!");
        }

        OrderStatus currentStatus = order.getStatus();

        if (roleId == 3) {
            if (!order.getCustomerId().getId().equals(currentUser.getId())) {
                throw new IllegalArgumentException("Bạn không có quyền vào đơn hàng của người khác!");
            }
            if (newStatus == OrderStatus.CANCELLED && currentStatus == OrderStatus.PENDING) {
                order.setStatus(newStatus);
                return this.orderRepo.updateSaleOrder(order);
            } else {
                throw new IllegalArgumentException("Khách hàng chỉ được phép hủy đơn khi đơn chưa được xác nhận!");
            }
        }

        if (currentStatus == OrderStatus.PENDING) {
            if (newStatus != OrderStatus.CONFIRMED && newStatus != OrderStatus.CANCELLED) {
                throw new IllegalArgumentException("Đơn hàng PENDING chỉ có thể chuyển sang CONFIRMED hoặc CANCELLED!");
            }
        } 
        else if (currentStatus == OrderStatus.CONFIRMED) {
            if (newStatus != OrderStatus.COMPLETED && newStatus != OrderStatus.CANCELLED) {
                throw new IllegalArgumentException("Đơn hàng CONFIRMED chỉ có thể chuyển sang COMPLETED hoặc CANCELLED!");
            }
        } 
        else if (currentStatus == OrderStatus.COMPLETED || currentStatus == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Đơn hàng đã đóng, không thể thay đổi trạng thái nữa!");
        }

        order.setStatus(newStatus);
        
        return this.orderRepo.updateSaleOrder(order); 
    }
}
