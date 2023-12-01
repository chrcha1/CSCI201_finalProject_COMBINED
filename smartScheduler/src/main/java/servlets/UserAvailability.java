package servlets;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.google.gson.JsonObject;
import util.DatabaseUtil;

@WebServlet("/UserAvailability")
public class UserAvailability extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public UserAvailability() {
        super();
    }

    // Fetch user availability
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
    	response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    	response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        JsonObject jsonResponse = new JsonObject();
        String userId = request.getParameter("userId");
        String eventId = request.getParameter("eventId");

        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT availability FROM participants WHERE user_id = ? AND event_id = ?")) {

            ps.setString(1, userId);
            ps.setString(2, eventId);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                String availability = rs.getString("availability");
                jsonResponse.addProperty("status", 200);
                jsonResponse.addProperty("data", availability);
            } else {
                jsonResponse.addProperty("status", 200);
                jsonResponse.add("data", createEmptyAvailability());
            }
        } catch (SQLException e) {
            jsonResponse.addProperty("status", 500);
            jsonResponse.addProperty("error", "Database connection problem: " + e.getMessage());
        }

        response.getWriter().write(jsonResponse.toString());
    }

    // Update user availability
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	response.setHeader("Access-Control-Allow-Origin", "*");
    	response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    	response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    	
        String userId = request.getParameter("userId");
        String eventId = request.getParameter("eventId");
        String availability = request.getParameter("availability");

        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement("UPDATE participants SET availability = ? WHERE user_id = ? AND event_id = ?")) {

            JsonObject jsonAvailability = JsonParser.parseString(availability).getAsJsonObject();
            ps.setString(1, jsonAvailability.toString());
            ps.setString(2, userId);
            ps.setString(3, eventId);

            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                response.getWriter().write("Availability updated successfully.");
            } else {
                response.getWriter().write("Failed to update availability.");
            }
        } catch (SQLException e) {
            throw new ServletException("Database connection problem", e);
        }
    }
    
    private JsonArray createEmptyAvailability() {
        JsonArray weekAvailability = new JsonArray();

        for (int day = 0; day < 7; day++) {
            JsonArray dayAvailability = new JsonArray();
            for (int hour = 0; hour < 24; hour++) {
                dayAvailability.add(false);
            }
            weekAvailability.add(dayAvailability);
        }

        return weekAvailability;
    }
}
