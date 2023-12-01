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

@WebServlet("/LogoutServlet")
public class LogoutServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public LogoutServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	response.setContentType("application/json");
    	response.setCharacterEncoding("UTF-8");
		
		String username = request.getParameter("username");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter ("confirmPassword")
        
        JsonObject jsonResponse = new JsonObject();
        
        if (ValidationUtil.isNullOrEmpty(username) || ValidationUtil.isNullOrEmpty(password) || ValidationUtil.isNullOrEmpty(confirmPassword)) {
            jsonResponse.addProperty("error", "Username, password, or confirm password cannot be empty.");
            return;
        }
        if ( !password.equals (confirmPassword)) {
            jsonResponse.addProperty("error", "password and confirm password do not match");
            return;
        }
        
        try {
            Connection conn = DatabaseUtil.getConnection();
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE username = ? AND password = ?");
            ps.setString(1, username);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                jsonResponse.addProperty("error", "username and password already exist.");
                
            } 
            ps = conn.prepareStatement("INSERT INTO Users (name, password) VALUES (?, ?);");
            ps.setString (1, username);
            ps.setString (2, password);
            rs = ps.executeQuery();
            if (rs.next()) {
                HttpSession session = request.getSession();
                session.setAttribute("user", username);
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("redirect", "html/home.html");
            }
        } catch (SQLException e) {
        	jsonResponse.addProperty("error", "Database connection problem: " + e.getMessage());
        } finally {
        	response.getWriter().write(jsonResponse.toString());
        }
    }
}
