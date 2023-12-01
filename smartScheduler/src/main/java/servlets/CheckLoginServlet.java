package servlets;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/CheckLoginServlet")
public class CheckLoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {
		response.setHeader("Access-Control-Allow-Origin", "*");
    	response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    	response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    	
        HttpSession session = request.getSession(false);
        boolean logged_in = (session != null && session.getAttribute("user") != null);

        int user_id = -1;

        if (logged_in) {
            user_id = (Integer) session.getAttribute("userId");
        }

        response.setContentType("application/json");
        response.getWriter().write("{\"verifyLogin\": " + logged_in + ", \"userId\": " + user_id + "}");
    }
}