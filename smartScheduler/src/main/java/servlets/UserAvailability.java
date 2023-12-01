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
    	
    	StringBuilder jsonBuilder = new StringBuilder();
        String line;
        while ((line = request.getReader().readLine()) != null) {
            jsonBuilder.append(line);
        }
        JsonObject jsonObject = JsonParser.parseString(jsonBuilder.toString()).getAsJsonObject();

        String userId = jsonObject.get("userId").getAsString();
        String eventId = jsonObject.get("eventId").getAsString();

        try (Connection conn = DatabaseUtil.getConnection();
        	PreparedStatement ps = conn.prepareStatement("INSERT INTO participants (user_id, event_id, availability) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE availability = ?")) {

        	JsonArray availability = jsonObject.get("availability").getAsJsonArray();
        	ps.setString(1, userId);
            ps.setString(2, eventId);
            ps.setString(3, availability.toString());
            ps.setString(4, availability.toString());

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
    
    @Override
	protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
	    setAccessControlHeaders(resp);
	    resp.setStatus(HttpServletResponse.SC_OK);
	}

	private void setAccessControlHeaders(HttpServletResponse resp) {
		resp.setHeader("Access-Control-Allow-Origin", "*");
	    resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	    resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
	}
}
