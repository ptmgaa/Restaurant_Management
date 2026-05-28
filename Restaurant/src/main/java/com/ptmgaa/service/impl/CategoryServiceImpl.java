/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.service.impl;

import com.ptmgaa.pojo.Category;
import com.ptmgaa.repository.CategoryRepository;
import com.ptmgaa.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
/**
 *
 * @author Miee
 */
@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepo;

    @Override
    public List<Category> getCates() {
        return this.categoryRepo.getCates();
    }

    @Override
    public Category getCategoryById(Integer id) {
        return this.categoryRepo.getCategoryById(id);
    }

    @Override
    public boolean addOrUpdateCategory(Category c) {
        return this.categoryRepo.addOrUpdateCategory(c);
    }

    @Override
    public boolean deleteCategory(Integer id) {
        return this.categoryRepo.deleteCategory(id);
    }
}
