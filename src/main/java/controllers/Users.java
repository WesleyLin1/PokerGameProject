package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.UUID;

@Path("users/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)
// UsersList
public class Users{
    @GET
    @Path("list")
    public String UsersList() {
        System.out.println("Invoked Users.UsersList()");
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT userID, name FROM users");
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject();
                row.put("userID", results.getInt(1));
                row.put("name", results.getString(2));
                response.add(row);
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }
    // UserGet (1 specific record)
    @GET
    @Path("get/{UserID}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String getUser(@PathParam("UserID") Integer UserID) {
        System.out.println("Invoked Users.GetUser() with UserID " + UserID);
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT name, chipcount FROM users WHERE userID = ?");
            ps.setInt(1, UserID);
            ResultSet results = ps.executeQuery();
            JSONObject response = new JSONObject();
            if (results.next()== true) {
                response.put("userID", UserID);
                response.put("name", results.getString(1));
                response.put("chipcount", results.getInt(2));
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to get item, please see server console for more info.\"}";
        }
    }
    // UserCreate
    @POST
    @Path("add")
    public String UsersAdd(@FormDataParam("name") String UserName,@FormDataParam("password") String Pass,
                           @FormDataParam("aidifficulty") Integer AIDiff) {
        System.out.println("Invoked Users.UsersAdd()");
        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO users (name, password,  aidifficulty) VALUES (?,?,?)");
            ps.setString(1, UserName);
            ps.setString(2, Pass);
            ps.setInt(3, AIDiff);
            ps.execute();
            return "{\"OK\": \"Added user.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }

    }
    // Login
    @POST
    @Path("login")
    public String usersLogin(@FormDataParam("name") String name, @FormDataParam("password") String password) {
        System.out.println("Invoked loginUser() on path users/login " + name + " " + password);
        try {
            PreparedStatement ps1 = Main.db.prepareStatement("SELECT password FROM users WHERE name = ?");
            ps1.setString(1, name);
            ResultSet loginResults = ps1.executeQuery();
            if (loginResults.next() == true) {
                String correctPassword = loginResults.getString(1);
                if (password.equals(correctPassword)) {
                    String token = UUID.randomUUID().toString();
                    PreparedStatement ps2 = Main.db.prepareStatement("UPDATE users SET token = ? WHERE name = ?");
                    ps2.setString(1, token);
                    ps2.setString(2, name);
                    ps2.executeUpdate();
                    JSONObject userDetails = new JSONObject();
                    userDetails.put("UserName", name);
                    userDetails.put("Token", token);
                    return userDetails.toString();
                } else {
                    return "{\"Error\": \"Incorrect password!\"}";
                }
            } else {
                return "{\"Error\": \"Incorrect username.\"}";
            }
        } catch (Exception exception) {
            System.out.println("Database error during /users/login: " + exception.getMessage());
            return "{\"Error\": \"Server side error!\"}";
        }
    }

    public static int validToken(String Token) {
        System.out.println("Invoked User.validateToken(), Token value " + Token);
        try {
            PreparedStatement statement = Main.db.prepareStatement("SELECT userID FROM users WHERE token = ?");
            statement.setString(1, Token);
            ResultSet resultSet = statement.executeQuery();
            System.out.println("userID is " + resultSet.getInt("UserID"));
            return resultSet.getInt("UserID");  //Retrieve by column name  (should really test we only get one result back!)
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return -1;  //rogue value indicating error
        }
    }

    @POST
    @Path("logout")
    public static String logout(@CookieParam("token") String token){
        try{
            System.out.println("users/logout "+ token);
            PreparedStatement ps = Main.db.prepareStatement("SELECT userID FROM users WHERE token=?");
            ps.setString(1, token);
            ResultSet logoutResults = ps.executeQuery();
            if (logoutResults.next()){
                int userID = logoutResults.getInt(1);
                //Set the token to null to indicate that the user is not logged in
                PreparedStatement ps1 = Main.db.prepareStatement("UPDATE users SET token = NULL WHERE userID = ?");
                ps1.setInt(1, userID);
                ps1.executeUpdate();
                return "{\"status\": \"OK\"}";
            } else {
                return "{\"error\": \"Invalid token!\"}";

            }
        } catch (Exception ex) {
            System.out.println("Database error during /users/logout: " + ex.getMessage());
            return "{\"error\": \"Server side error!\"}";
        }

    }



}
