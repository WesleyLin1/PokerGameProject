package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

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



}
