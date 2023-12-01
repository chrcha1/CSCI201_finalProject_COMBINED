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
import java.util.UUID;

import com.google.gson.JsonObject;
import util.DatabaseUtil;

@WebServlet("/EventServlet")
public class EventServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public EventServlet() {
        super();
    }

    // Fetch Event Details
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    	response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    	response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    	response.setHeader("Access-Control-Allow-Credentials", "true");

        String eventId = request.getParameter("eventId");

        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM events WHERE id = ?")) {

            ps.setString(1, eventId);
            ResultSet rs = ps.executeQuery();

            JsonObject jsonResponse = new JsonObject();
            if (rs.next()) {
                jsonResponse.addProperty("id", rs.getString("id"));
                jsonResponse.addProperty("name", rs.getString("name"));
                jsonResponse.addProperty("description", rs.getString("description"));
                jsonResponse.addProperty("createdBy", rs.getString("created_by"));
                jsonResponse.addProperty("primaryDate", rs.getString("primary_date"));
            }

            response.getWriter().write(jsonResponse.toString());
        } catch (SQLException e) {
            throw new ServletException("Database connection problem", e);
        }
    }

    // Create a New Event
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        String name = request.getParameter("name");
        String description = request.getParameter("description");
        String createdBy = request.getParameter("createdBy");
        String primary_date = request.getParameter("primary_date");

        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement("INSERT INTO events (id, name, description, created_by, primary_date) VALUES (?, ?, ?, ?, ?)",
                     PreparedStatement.RETURN_GENERATED_KEYS)) {

            String newEventId = UUID.randomUUID().toString();
            ps.setString(1, newEventId);
            ps.setString(2, name);
            ps.setString(3, description);
            ps.setString(4, createdBy);
            ps.setString(5, primary_date);

            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                JsonObject jsonResponse = new JsonObject();
                jsonResponse.addProperty("message", "Event created successfully.");
                jsonResponse.addProperty("eventId", newEventId);

                response.getWriter().write(jsonResponse.toString());
            } else {
                throw new SQLException("Creating event failed, no ID obtained.");
            }
        } catch (SQLException e) {
            throw new ServletException("Database connection problem", e);
        }
    }
}
