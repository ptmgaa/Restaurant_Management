/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.repository;
import com.ptmgaa.pojo.OrderRequest;
import com.ptmgaa.pojo.SaleOrder;
/**
 *
 * @author Miee
 */
public interface SaleOrderRepository {
    SaleOrder addSaleOrder(OrderRequest orderReq);
    SaleOrder getOrderById(int id);
    SaleOrder updateSaleOrder(SaleOrder order);
}
