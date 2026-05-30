/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.ptmgaa.restaurant;

import org.hibernate.Session;

/**
 *
 * @author Miee
 */
public class Restaurant {

    public static void main(String[] args) {
        try (Session session = HibernateUtils.getFactory().openSession()) {
            System.out.println("=== KHOI TAO THANH CONG ===");
        }
    }
}
