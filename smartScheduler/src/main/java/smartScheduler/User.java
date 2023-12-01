package smartScheduler;

import java.util.ArrayList;
import java.util.List;

public class User {
    private String userId;
    private String username;
    private String hashedPassword;
    private String email;
    private List<Event> participatedEvents;
    private List<Event> scheduledEvents;
    private AvailabilityMatrix availabilityMatrix;

    // Constructors

    public User(String userId, String username, String hashedPassword) {
        this.userId = userId;
        this.username = username;
        this.hashedPassword = hashedPassword;
        this.email = ""; // Initialize email to an empty string
        this.participatedEvents = new ArrayList<>();
        this.scheduledEvents = new ArrayList<>();
        this.availabilityMatrix = new AvailabilityMatrix();
    }

    public void updateAvailabilityMatrix(AvailabilityMatrix newAvailabilityMatrix) {
        this.availabilityMatrix.updateAvailability(this, newAvailabilityMatrix);
    }

    // Getters and Setters

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Event> getParticipatedEvents() {
        return participatedEvents;
    }

    public void setParticipatedEvents(List<Event> participatedEvents) {
        this.participatedEvents = participatedEvents;
    }

    public List<Event> getScheduledEvents() {
        return scheduledEvents;
    }

    public void setScheduledEvents(List<Event> scheduledEvents) {
        this.scheduledEvents = scheduledEvents;
    }

    public void setTimeSlot(int dayIndex, int hourIndex, boolean isAvailable) {
        this.availabilityMatrix.updateAvailability(this, dayIndex, hourIndex, isAvailable);
    }

    public void unsetTimeSlot(int dayIndex, int hourIndex) {
        this.availabilityMatrix.updateAvailability(this, dayIndex, hourIndex, false);
    }

    // Additional methods as needed

    public void addTimeSlot(int dayIndex, int hourIndex, boolean isAvailable) {
        this.availabilityMatrix.updateAvailability(this, dayIndex, hourIndex, isAvailable);
    }

    public void removeTimeSlot(int dayIndex, int hourIndex) {
        this.availabilityMatrix.updateAvailability(this, dayIndex, hourIndex, false);
    }

    public void participateInEvent(Event event) {
        this.participatedEvents.add(event);
    }

    public void scheduleEvent(Event event) {
        this.scheduledEvents.add(event);
    }

    public boolean isAvailable(int dayIndex, int hourIndex) {
        // Check if the user is available at the given matrix spot
        return availabilityMatrix.isUserAvailable(this, dayIndex, hourIndex);
    }

    public List<Integer> getAvailableMatrixIndices() {
        return availabilityMatrix.getFilledMatrixIndices(this);
    }

    public AvailabilityMatrix getAvailabilityMatrix() {
        return availabilityMatrix;
    }

    public void printAvailabilityMatrix() {
        System.out.println("Availability Matrix for User " + getUserId() + ":");
        Boolean[][] matrix = availabilityMatrix.getMatrixForUser(this);
        if (matrix != null) {
            for (int dayIndex = 0; dayIndex < 7; dayIndex++) {
                for (int hourIndex = 0; hourIndex < 24; hourIndex++) {
                    System.out
                            .print((matrix[dayIndex][hourIndex] != null ? matrix[dayIndex][hourIndex] : "null") + " ");
                }
                System.out.println(); // Move to the next line for the next day
            }
        } else {
            System.out.println("Matrix is null");
        }
        System.out.println();
    }
}
