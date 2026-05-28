/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.controllers;

import com.ptmgaa.pojo.Category;
import com.ptmgaa.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
/**
 *
 * @author Miee
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class ApiCategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> list() {
        return new ResponseEntity<>(this.categoryService.getCates(), HttpStatus.OK);
    }

    @PostMapping("/categories")
    public ResponseEntity<?> create(@RequestBody Category c) {
        if (this.categoryService.addOrUpdateCategory(c)) {
            return new ResponseEntity<>(c, HttpStatus.CREATED);
        }
        return new ResponseEntity<>("Không thể tạo danh mục!", HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<?> update(@PathVariable(value = "id") Integer id, @RequestBody Category c) {        c.setId(id); 
        if (this.categoryService.addOrUpdateCategory(c)) {
            return new ResponseEntity<>(c, HttpStatus.OK);
        }
        return new ResponseEntity<>("Không thể cập nhật danh mục!", HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<Category> getById(@PathVariable(value = "id") Integer id) {
        Category c = this.categoryService.getCategoryById(id);
        if (c != null) {
            return new ResponseEntity<>(c, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> delete(@PathVariable(value = "id") Integer id) {
        if (this.categoryService.deleteCategory(id)) {
            return new ResponseEntity<>("Xóa danh mục thành công!", HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>("Xóa danh mục thất bại hoặc danh mục không tồn tại!", HttpStatus.BAD_REQUEST);
    }
}
