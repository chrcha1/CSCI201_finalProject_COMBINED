package models;

import java.sql.Timestamp;

public class User {
    private String id;
    private String username;
    private String password;
    private Timestamp createdAt;

    // Constructors

    public User(String id, String username, String password, Timestamp createdAt) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.createdAt = createdAt;
    }

    // Getters and Setters

    public String getUserId() {
        return id;
    }

    public void setUserId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getHashedPassword() {
        return password;
    }

    public void setHashedPassword(String password) {
        this.password = password;
    }
    
    public Timestamp getCreationTime() {
    	return createdAt;
    }
}
