/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.service.impl;

import com.ptmgaa.pojo.Dish;
import java.util.List;
import com.ptmgaa.pojo.Menu;
import com.ptmgaa.pojo.User;
import com.ptmgaa.repository.MenuRepository;
import com.ptmgaa.repository.UserRepository;
import com.ptmgaa.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
/**
 *
 * @author Miee
 */
@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    private MenuRepository menuRepo;

    @Autowired
    private UserRepository userRepo;
    
    @Override
    public List<Menu> getMenus() {
        return this.menuRepo.getMenus();
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
    public void addOrUpdateMenu(Menu m) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();
        User currentUser = this.userRepo.getUserByUsername(currentUsername);
        
        boolean isAdmin = currentUser.getRoleId().getId() == 1;
        boolean isChef = currentUser.getRoleId().getId() == 2;

        if (m.getId() == null) {
            if (isChef) {
                m.setUserId(currentUser);
            }
        } 
        else {
            Menu existingMenu = this.menuRepo.getMenuById(m.getId());
            if (existingMenu != null) {
                if (!isAdmin) {
                    if (existingMenu.getUserId() == null || !existingMenu.getUserId().getId().equals(currentUser.getId())) {
                        throw new SecurityException("Bạn không có quyền cập nhật thực đơn này!");
                    }
                }
                m.setUserId(existingMenu.getUserId());
            }
        }

        this.menuRepo.addOrUpdateMenu(m);
    }
    
    @Override
    public boolean addDishToMenu(int menuId, int dishId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();
        User currentUser = this.userRepo.getUserByUsername(currentUsername);
        
        Menu menu = this.menuRepo.getMenuById(menuId);
        if (menu != null) {
            boolean isAdmin = currentUser.getRoleId().getId() == 1;
            if (!isAdmin) {
                if (menu.getUserId() == null || !menu.getUserId().getId().equals(currentUser.getId())) {
                    throw new SecurityException("Bạn không có quyền thêm món vào thực đơn này!");
                }
            }
        }
        return this.menuRepo.addDishToMenu(menuId, dishId);
    }

    @Override
    public boolean removeDishFromMenu(int menuId, int dishId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();
        User currentUser = this.userRepo.getUserByUsername(currentUsername);
        
        Menu menu = this.menuRepo.getMenuById(menuId);
        if (menu != null) {
            boolean isAdmin = currentUser.getRoleId().getId() == 1;
            if (!isAdmin) {
                if (menu.getUserId() == null || !menu.getUserId().getId().equals(currentUser.getId())) {
                    throw new SecurityException("Lỗi truy cập: Bạn không có quyền xóa món khỏi thực đơn này!");
                }
            }
        }
        return this.menuRepo.removeDishFromMenu(menuId, dishId);
    }
}
