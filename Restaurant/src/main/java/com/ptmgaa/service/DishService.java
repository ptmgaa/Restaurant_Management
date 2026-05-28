/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.service;

import com.ptmgaa.pojo.Dish;
import java.util.List;
import java.util.Map;
/**
 *
 * @author Miee
 */
public interface DishService {
    List<Dish> getDishes(Map<String, String> params);
    void addOrUpdateDish(Dish d);
    Dish getDishById(int id);
    void deleteDish(int id);
}