/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.repository;

import com.ptmgaa.pojo.Menu;
import java.util.List;
/**
 *
 * @author Miee
 */
public interface MenuRepository {
    List<Menu> getMenus();
    void addOrUpdateMenu(Menu m);
    Menu getMenuById(int id);
    void deleteMenu(int id);
    boolean addDishToMenu(int menuId, int dishId);
    boolean removeDishFromMenu(int menuId, int dishId);
}
