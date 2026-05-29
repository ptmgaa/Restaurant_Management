/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.controllers;
import com.ptmgaa.pojo.OrderRequest;
import com.ptmgaa.pojo.OrderStatus;
import com.ptmgaa.pojo.SaleOrder;
import com.ptmgaa.service.SaleOrderService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
/**
 *
 * @author Miee
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class ApiSaleOrderController {

    @Autowired
    private SaleOrderService orderService;

    @PostMapping("/secure/orders")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderReq) {
        try {
            SaleOrder order = this.orderService.addSaleOrder(orderReq);
            return new ResponseEntity<>(order, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>("Lỗi khi tạo đơn hàng", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping("/secure/orders/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable("id") int id, @RequestBody Map<String, String> payload) {
        try {
            String statusStr = payload.get("status");
            OrderStatus newStatus = OrderStatus.valueOf(statusStr.toUpperCase()); // Ép kiểu String về Enum

            SaleOrder updatedOrder = this.orderService.updateOrderStatus(id, newStatus);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);

        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            return new ResponseEntity<>("Trạng thái không hợp lệ hoặc lỗi hệ thống!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
