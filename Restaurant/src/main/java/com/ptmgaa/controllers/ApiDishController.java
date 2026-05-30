/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.controllers;

import com.ptmgaa.pojo.Dish;
import com.ptmgaa.pojo.Ingredient;
import com.ptmgaa.service.DishService;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
/**
 *
 * @author Miee
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class ApiDishController {
    @Autowired
    private DishService dishService;
    
    @GetMapping("/dishes")
    public ResponseEntity<List<Dish>> list(@RequestParam Map<String, String> params) {
        return new ResponseEntity<>(this.dishService.getDishes(params), HttpStatus.OK);
    }
    
    @GetMapping("/dishes/{dishId}")
    public ResponseEntity<Dish> details(@PathVariable(value = "dishId") int id) {
        Dish d = this.dishService.getDishById(id);
        if (d != null && d.getActive()) {
             return new ResponseEntity<>(d, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @PostMapping(path = "/secure/dishes", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> addOrUpdate(@ModelAttribute Dish d, 
                            @RequestParam(value = "ingredientIds", required = false) List<Integer> ingredientIds) {
        
        try {
            if (ingredientIds != null && !ingredientIds.isEmpty()) {
                Set<Ingredient> ingredients = new HashSet<>();
                for (Integer id : ingredientIds) {
                    Ingredient ing = new Ingredient();
                    ing.setId(id);
                    ingredients.add(ing);
                }
                d.setIngredientSet(ingredients);
            }
            
            this.dishService.addOrUpdateDish(d);
            return new ResponseEntity<>(d, HttpStatus.CREATED);
            
        } catch (Exception ex) {
            ex.printStackTrace(); 
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @DeleteMapping("/secure/dishes/{dishId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable(value = "dishId") int id) {
        this.dishService.deleteDish(id);
    }
    
    @GetMapping("/dishes/compare")
    public ResponseEntity<List<Dish>> compareDishes(@RequestParam(value = "ids") List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(this.dishService.compareDishes(ids), HttpStatus.OK);
    }
}