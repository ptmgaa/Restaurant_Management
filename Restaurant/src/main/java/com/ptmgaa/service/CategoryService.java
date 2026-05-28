/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.service;

import com.ptmgaa.pojo.Category;
import java.util.List;
/**
 *
 * @author Miee
 */
public interface CategoryService {
    List<Category> getCates();
    Category getCategoryById(Integer id);
    boolean addOrUpdateCategory(Category c);
    boolean deleteCategory(Integer id);
}
