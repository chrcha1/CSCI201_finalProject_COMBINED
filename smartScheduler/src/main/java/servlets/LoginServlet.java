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
import javax.servlet.http.HttpSession;

import util.DatabaseUtil;
import util.ValidationUtil;

import com.google.gson.JsonObject;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public LoginServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	response.setContentType("application/json");
    	response.setCharacterEncoding("UTF-8");
    	response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    	response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    	response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    	response.setHeader("Access-Control-Allow-Credentials", "true");
		
		String username = request.getParameter("username");
        String password = request.getParameter("password");
        
        JsonObject jsonResponse = new JsonObject();
        
        if (ValidationUtil.isNullOrEmpty(username) || ValidationUtil.isNullOrEmpty(password)) {
            jsonResponse.addProperty("error", "Username and password cannot be empty.");
            System.out.println("Username or password empty");
            return;
        }
        
        try {
            Connection conn = DatabaseUtil.getConnection();
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE username = ? AND password = ?");
            ps.setString(1, username);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                HttpSession session = request.getSession();
                session.setAttribute("user", username);
                String userId = rs.getString("id");
                session.setAttribute("userId", userId);

                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("userId", userId);
                jsonResponse.addProperty("redirect", "/new-event");
                System.out.println("Successful Login");
                
            } else {
                jsonResponse.addProperty("error", "Invalid username or password.");
                System.out.println("Invalid username or password");
            }
        } catch (SQLException e) {
        	jsonResponse.addProperty("error", "Database connection problem: " + e.getMessage());
        	System.out.println("Database connection problem: " + e.getMessage());
        } finally {
        	response.getWriter().write(jsonResponse.toString());
        }
    }
	
	@Override
	protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
	    setAccessControlHeaders(resp);
	    resp.setStatus(HttpServletResponse.SC_OK);
	}

	private void setAccessControlHeaders(HttpServletResponse resp) {
		resp.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	    resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	    resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
	    resp.setHeader("Access-Control-Allow-Credentials", "true");
	}

}
