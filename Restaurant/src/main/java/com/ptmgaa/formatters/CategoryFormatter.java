/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.formatters;

import com.ptmgaa.pojo.Category;
import org.springframework.format.Formatter;
import java.text.ParseException;
import java.util.Locale;
/**
 *
 * @author Miee
 */
public class CategoryFormatter implements Formatter<Category> {
    @Override
    public String print(Category object, Locale locale) {
        return String.valueOf(object.getId());
    }

    @Override
    public Category parse(String text, Locale locale) throws ParseException {
        Category c = new Category();
        c.setId(Integer.parseInt(text));
        return c;
    }
}
