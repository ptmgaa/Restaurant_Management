/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ptmgaa.utils;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import java.util.Date;

/**
 *
 * @author Miee
 */
public class JwtUtils {
    private static final String SECRET_KEY = "MyMy&KimChiPhatTrienHeThongWebHihiii";
    
    private static final int EXPIRE_TIME = 86400000; 

    public static String generateToken(String username) throws Exception {
        JWSSigner signer = new MACSigner(SECRET_KEY.getBytes());
        
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(username)
                .issuer("ptmgaa_restaurant")
                .expirationTime(new Date(new Date().getTime() + EXPIRE_TIME))
                .build();
        
        SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);
        
        signedJWT.sign(signer);
        
        return signedJWT.serialize();
    }

    public static String validateTokenAndGetUsername(String token) {
        if (token == null || token.isEmpty()) { 
        return null;
        }
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            
            JWSVerifier verifier = new com.nimbusds.jose.crypto.MACVerifier(SECRET_KEY.getBytes());
            
            boolean isVerified = signedJWT.verify(verifier);
            
            if (isVerified) {
                Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
                
                if (expirationTime != null && expirationTime.after(new Date())) {
                    
                    return signedJWT.getJWTClaimsSet().getSubject();
                } else {
                    System.out.println("Token đã hết hạn!");
                }
            } else {
                System.out.println("Chữ ký Token không hợp lệ!");
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi xác thực Token: " + e.getMessage());
        }
        
        return null;
    }
}
