package models;

import java.util.ArrayList;
import java.util.List;

public class Availability {
    private static final int DAYS_IN_WEEK = 7;
    private static final int HOURS_IN_DAY = 24;

    // Availability for a user
    private Boolean[][] availability;
    
    public Availability(Boolean[][] availability) {
        this.availability = availability;
    }

    /**
     * Sets the availability of a user.
     *
     * @param dayIndex    the day index (0-6)
     * @param hourIndex   the hour index (0-23)
     * @param isAvailable the availability status
     */
    public void updateAvailability(User user, int dayIndex, int hourIndex, boolean isAvailable) {
        if (dayIndex < 0 || dayIndex >= DAYS_IN_WEEK || hourIndex < 0 || hourIndex >= HOURS_IN_DAY) {
            throw new IllegalArgumentException("Invalid day or hour index.");
        }
        availability[dayIndex][hourIndex] = isAvailable;
    }

    /**
     * Checks for availability at a specific time.
     *
     * @param dayIndex  the day index (0-6)
     * @param hourIndex the hour index (0-23)
     * @return true if available, false otherwise
     */
    public boolean isAvailable(int dayIndex, int hourIndex) {
        return availability != null && availability[dayIndex][hourIndex] != null && availability[dayIndex][hourIndex];
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

        if (availability != null) {
            for (int dayIndex = 0; dayIndex < 7; dayIndex++) {
                for (int hourIndex = 0; hourIndex < 24; hourIndex++) {
                    if (availability[dayIndex][hourIndex] != null && availability[dayIndex][hourIndex]) {
                        int availabilityIndex = dayIndex * 24 + hourIndex;
                        filledIndices.add(availabilityIndex);
                    }
                }
            }
        }

        return filledIndices;
    }

    public void setAvailability(Boolean[][] availability) {
        this.availability = availability;
    }

    /**
     * Gets the availability matrix for a user.
     *
     * @param user the user
     * @return the availability matrix
     */
    public Boolean[][] getAvailability() {
        return availability;
    }
}
