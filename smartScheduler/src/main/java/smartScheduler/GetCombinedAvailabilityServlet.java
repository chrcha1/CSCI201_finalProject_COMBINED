import javax.servlet.HTTP.servlet;
import java.sql.*;
import java.io.IOException;
import java.util.HashMap;
import org.json.*;
import javax.servlet.annotation.WebServlet;



@WebServlet("/getCombinedAvailability")
public class GetCombinedAvailabilityServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String eventId = request.getParameter("eventId");
        Map<String, boolean[][]> userAvailabilities = new HashMap<>();
        int totalParticipants = 0;

        // Step 1: Fetch Availabilities
        try (Connection connection = DriverManager.getConnection(/* database URL */, /* username */, /* password */);
             PreparedStatement statement = connection.prepareStatement("SELECT u.username, p.availability FROM participants p JOIN users u ON p.user_id = u.id WHERE p.event_id = ?;")) {
            
            statement.setString(1, eventId);
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                String username = resultSet.getString("username");
                String jsonAvailability = resultSet.getString("availability");
                boolean[][] availabilityMatrix = jsonToBooleanMatrix(jsonAvailability); // Convert JSON to matrix
                userAvailabilities.put(username, availabilityMatrix);
                totalParticipants++;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Step 2 & 3: Combine Availabilities and Calculate Percentage
        JSONArray combinedAvailability = new JSONArray();
        for (int day = 0; day < 7; day++) {
            JSONArray dayAvailability = new JSONArray();
            for (int hour = 0; hour < 24; hour++) {
                JSONObject hourInfo = new JSONObject();
                int availableCount = 0;
                JSONArray availableUsers = new JSONArray();

                for (Map.Entry<String, boolean[][]> entry : userAvailabilities.entrySet()) {
                    if (entry.getValue()[day][hour]) {
                        availableCount++;
                        availableUsers.put(entry.getKey());
                    }
                }

                double percentage = totalParticipants > 0 ? (double) availableCount / totalParticipants * 100 : 0;
                hourInfo.put("count", availableCount);
                hourInfo.put("users", availableUsers);
                hourInfo.put("percentage", percentage);

                dayAvailability.put(hourInfo);
            }
            combinedAvailability.put(dayAvailability);
        }

        // Step 4: Format and Send Response
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(combinedAvailability.toString());
    }

    public boolean[][] jsonToBooleanMatrix(String jsonAvailability) {
    try {
        JSONArray days = new JSONArray(jsonAvailability);
        boolean[][] availability = new boolean[7][24];

        for (int i = 0; i < days.length(); i++) {
            JSONArray hours = days.getJSONArray(i);
            for (int j = 0; j < hours.length(); j++) {
                availability[i][j] = hours.getBoolean(j);
            }
        }

        return availability;
    } catch (JSONException e) {
        e.printStackTrace();
        return new boolean[7][24]; // return an empty array in case of an error
    }
}
