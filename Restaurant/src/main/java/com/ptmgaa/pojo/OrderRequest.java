/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.pojo;
import java.util.Date;
import java.util.List;
/**
 *
 * @author Miee
 */
public class OrderRequest {
    private List<CartItem> cart;
    private String paymentMethod;
    private Integer tableId;
    private Date reservationTime;
    public List<CartItem> getCart() { return cart; }
    public void setCart(List<CartItem> cart) { this.cart = cart; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public Integer getTableId() { return tableId; }
    public void setTableId(Integer tableId) { this.tableId = tableId; }
    public Date getReservationTime() { return reservationTime; }
    public void setReservationTime(Date reservationTime) { this.reservationTime = reservationTime; }
}