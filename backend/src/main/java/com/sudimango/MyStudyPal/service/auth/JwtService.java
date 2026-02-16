package com.sudimango.MyStudyPal.service.auth;

import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    // Secret key, gotten from application.properties
    @Value("${jwt.secret.key}")
    private String secretKey = "";

    // Token expiration times
    public static final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 365;
    public static final long REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 365;


    /**
     * Generates an access token for a given username
     * 
     * @param username - the user's username for whom the token will be generated
     * @return the access token for the user
     */
    public String generateAccessToken(String username) {
        return generateToken(username, ACCESS_TOKEN_EXPIRATION, "access");
    }

    /**
     * Generates a refresh token for a given username
     * 
     * @param username - the user's username for whom the token will be generated
     * @return the refresh token for the user
     */
    public String generateRefreshToken(String username) {
        return generateToken(username, REFRESH_TOKEN_EXPIRATION, "refresh");
    }

    /**
     * Checks if a token is valid against a user
     * 
     * @param token - the token to be validated
     * @param userDetails - the UserDetails of the user
     * @return true if token is valid for that user, false otherwise
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractClaim(token, Claims::getSubject);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Extract a singular claim from a given token
     * 
     * @param <T> the object type of the item to be extracted
     * @param token - the token from which the claim is to be extracted
     * @param claimResolver - function that takes the token's claims and resolves a specific value from them
     * @return the value for the claim
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    /**
     * Generates a new key based on the HmacSHA256 algorithm and prints it to the console
     * 
     * @return the key as a string
     * @throws NoSuchAlgorithmException if the provided algorithm isn't valid
     */
    public static String generateKey() throws NoSuchAlgorithmException {
        KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
        SecretKey sk = keyGen.generateKey();
        String key = Base64.getEncoder().encodeToString(sk.getEncoded());

        System.out.println(" ");
        System.out.println("---------------------------------");
        System.out.println("Generated key:");
        System.out.println(key);
        System.out.println("---------------------------------");
        System.out.println(" ");

        return key;
    }


    /*
     * 
     * 
     * PRIVATE HELPER FUNCTIONS
     * 
     * 
     */


    // Generate a generc token given a username and an expiration time
    private String generateToken(String username, long expirationTimeMillis, String tokenType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", tokenType);

        String token = Jwts.builder()
                        .claims()
                        .add(claims)
                        .subject(username)
                        .issuedAt(new Date(System.currentTimeMillis()))
                        .expiration(new Date(System.currentTimeMillis() + expirationTimeMillis))
                        .and()
                        .signWith(getKey())
                        .compact();
        
        return token;
    }

    // Turn a string key into a SecretKey
    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Extract all claims from a token
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
    }

    // Check if a given token is expired
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extract the expiration date from the token
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
