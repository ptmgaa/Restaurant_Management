/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.controllers;

import java.util.List;
import com.ptmgaa.pojo.Menu;
import com.ptmgaa.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
/**
 *
 * @author Miee
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class ApiMenuController {

    @Autowired
    private MenuService menuService;
    
    @GetMapping("/menus")
    public ResponseEntity<List<Menu>> list() {
        return new ResponseEntity<>(this.menuService.getMenus(), HttpStatus.OK);
    }

    @GetMapping("/menus/{menuId}")
    public ResponseEntity<Menu> getMenuById(@PathVariable("menuId") int id) {
        Menu m = this.menuService.getMenuById(id);
        if (m != null) {
            return new ResponseEntity<>(m, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @PostMapping("/secure/menus")
    public ResponseEntity<?> addMenu(@RequestBody Menu menu) {
        try {
            this.menuService.addOrUpdateMenu(menu);
            return new ResponseEntity<>(menu, HttpStatus.CREATED);
        } catch (SecurityException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception ex) {
            return new ResponseEntity<>("Lỗi hệ thống!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @DeleteMapping("/secure/menus/{menuId}")
    public ResponseEntity<?> deleteMenu(@PathVariable("menuId") int id) {
        this.menuService.deleteMenu(id);
        return new ResponseEntity<>("Đã xóa thực đơn", HttpStatus.NO_CONTENT);
    }

    @PostMapping("/secure/menus/{menuId}/dishes/{dishId}")
    public ResponseEntity<?> addDishToMenu(@PathVariable("menuId") int menuId, @PathVariable("dishId") int dishId) {
        try {
            if (this.menuService.addDishToMenu(menuId, dishId)) {
                return new ResponseEntity<>("Thêm món vào thực đơn thành công!", HttpStatus.OK);
            }
            return new ResponseEntity<>("Không tìm thấy thực đơn hoặc món ăn!", HttpStatus.BAD_REQUEST);
        } catch (SecurityException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/secure/menus/{menuId}/dishes/{dishId}")
    public ResponseEntity<?> removeDishFromMenu(@PathVariable("menuId") int menuId, @PathVariable("dishId") int dishId) {
        if (this.menuService.removeDishFromMenu(menuId, dishId)) {
            return new ResponseEntity<>("Xóa món khỏi thực đơn thành công!", HttpStatus.OK);
        }
        return new ResponseEntity<>("Xóa thất bại!", HttpStatus.BAD_REQUEST);
    }
}