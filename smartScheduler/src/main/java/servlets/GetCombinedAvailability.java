package servlets;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;
import com.google.gson.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/GetCombinedAvailability")
public class GetCombinedAvailability extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public GetCombinedAvailability() {
        super();
    }

    @Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String eventId = request.getParameter("eventId");
        Map<String, boolean[][]> userAvailabilities = new HashMap<>();
        int totalParticipants = 0;

        // Step 1: Fetch Availabilities
        try (Connection connection = DriverManager.getConnection("database URL", "username", "password");
             PreparedStatement statement = connection.prepareStatement("SELECT u.username, p.availability FROM participants p JOIN users u ON p.user_id = u.id WHERE p.event_id = ?;")) {

            statement.setString(1, eventId);
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                String username = resultSet.getString("username");
                String jsonAvailability = resultSet.getString("availability");
                boolean[][] availabilityMatrix = jsonToBooleanMatrix(jsonAvailability);
                userAvailabilities.put(username, availabilityMatrix);
                totalParticipants++;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Step 2 & 3: Combine Availabilities and Calculate Percentage
        JsonArray combinedAvailability = new JsonArray();
        Gson gson = new Gson();
        for (int day = 0; day < 7; day++) {
            JsonArray dayAvailability = new JsonArray();
            for (int hour = 0; hour < 24; hour++) {
                JsonObject hourInfo = new JsonObject();
                int availableCount = 0;
                JsonArray availableUsers = new JsonArray();

                for (Map.Entry<String, boolean[][]> entry : userAvailabilities.entrySet()) {
                    if (entry.getValue()[day][hour]) {
                        availableCount++;
                        availableUsers.add(entry.getKey());
                    }
                }

                double percentage = totalParticipants > 0 ? (double) availableCount / totalParticipants * 100 : 0;
                hourInfo.addProperty("count", availableCount);
                hourInfo.add("users", availableUsers);
                hourInfo.addProperty("percentage", percentage);

                dayAvailability.add(hourInfo);
            }
            combinedAvailability.add(dayAvailability);
        }

        // Step 4: Format and Send Response
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(combinedAvailability));
    }

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	public boolean[][] jsonToBooleanMatrix(String jsonAvailability) {
		Gson gson = new Gson();
		try {
			boolean [][] availability = gson.fromJson(jsonAvailability, boolean[][].class);
			return availability;
		} catch (JsonSyntaxException e) {
			e.printStackTrace();
			return new boolean[7][24];
		}
	}
}
