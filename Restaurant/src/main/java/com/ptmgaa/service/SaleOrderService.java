/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.service;
import com.ptmgaa.pojo.OrderRequest;
import com.ptmgaa.pojo.OrderStatus;
import com.ptmgaa.pojo.SaleOrder;
/**
 *
 * @author Miee
 */
public interface SaleOrderService {
    SaleOrder addSaleOrder(OrderRequest orderReq);
    SaleOrder updateOrderStatus(int orderId, OrderStatus newStatus);
}
