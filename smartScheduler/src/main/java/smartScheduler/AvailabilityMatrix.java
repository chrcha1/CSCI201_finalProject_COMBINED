package smartScheduler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AvailabilityMatrix {
    private static final int DAYS_IN_WEEK = 7;
    private static final int HOURS_IN_DAY = 24;

    // has all users mapped to a boolean matrix
    private Map<User, Boolean[][]> availabilityData;

    public AvailabilityMatrix() {
        this.availabilityData = new HashMap<>();
    }

    /**
     * Sets the availability of a user.
     *
     * @param user        the user to update
     * @param dayIndex    the day index (0-6)
     * @param hourIndex   the hour index (0-23)
     * @param isAvailable the availability status
     */
    public void updateAvailability(User user, int dayIndex, int hourIndex, boolean isAvailable) {
        if (dayIndex < 0 || dayIndex >= DAYS_IN_WEEK || hourIndex < 0 || hourIndex >= HOURS_IN_DAY) {
            throw new IllegalArgumentException("Invalid day or hour index.");
        }

        Boolean[][] matrix = availabilityData.computeIfAbsent(user, k -> new Boolean[DAYS_IN_WEEK][HOURS_IN_DAY]); // Assuming 7 days in a
                                                                                              // week, 24 hours in a day
        matrix[dayIndex][hourIndex] = isAvailable;
    }

    /**
     * Checks if a user is available at a specific time.
     *
     * @param user      the user to check
     * @param dayIndex  the day index (0-6)
     * @param hourIndex the hour index (0-23)
     * @return true if the user is available, false otherwise
     */
    public boolean isUserAvailable(User user, int dayIndex, int hourIndex) {
        Boolean[][] matrix = availabilityData.get(user);

        return matrix != null && matrix[dayIndex][hourIndex] != null && matrix[dayIndex][hourIndex];
    }

    /**
     * Gets the indices of the matrix where the user is available.
     *
     * @param user the user to check
     * @return a list of indices where the user is available
     */
    public List<Integer> getFilledMatrixIndices(User user) {
        // Return a list of matrix indices where the user is available
        List<Integer> filledIndices = new ArrayList<>();
        Boolean[][] matrix = availabilityData.get(user);

        if (matrix != null) {
            for (int dayIndex = 0; dayIndex < 7; dayIndex++) {
                for (int hourIndex = 0; hourIndex < 24; hourIndex++) {
                    if (matrix[dayIndex][hourIndex] != null && matrix[dayIndex][hourIndex]) {
                        int matrixIndex = dayIndex * 24 + hourIndex;
                        filledIndices.add(matrixIndex);
                    }
                }
            }
        }

        return filledIndices;
    }

    public void updateAvailability(User user, AvailabilityMatrix newAvailabilityMatrix) {
        // Update the user's availability matrix using the new availability matrix
        Boolean[][] newMatrix = newAvailabilityMatrix.getMatrixForUser(user);
        availabilityData.put(user, newMatrix);
    }

    /**
     * Gets the availability matrix for a user.
     *
     * @param user the user
     * @return the availability matrix
     */
    public Boolean[][] getMatrixForUser(User user) {
        return availabilityData.get(user);
    }
}
