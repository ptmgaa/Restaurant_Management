/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.service.impl;

import java.util.List;
import com.ptmgaa.pojo.Menu;
import com.ptmgaa.repository.MenuRepository;
import com.ptmgaa.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
/**
 *
 * @author Miee
 */
@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    private MenuRepository menuRepo;

    @Override
    public List<Menu> getMenus() {
        return this.menuRepo.getMenus();
    }

    @Override
    public void addOrUpdateMenu(Menu m) {
        this.menuRepo.addOrUpdateMenu(m);
    }

    @Override
    public Menu getMenuById(int id) {
        return this.menuRepo.getMenuById(id);
    }

    @Override
    public void deleteMenu(int id) {
        this.menuRepo.deleteMenu(id);
    }

    @Override
    public boolean addDishToMenu(int menuId, int dishId) {
        return this.menuRepo.addDishToMenu(menuId, dishId);
    }

    @Override
    public boolean removeDishFromMenu(int menuId, int dishId) {
        return this.menuRepo.removeDishFromMenu(menuId, dishId);
    }
}
