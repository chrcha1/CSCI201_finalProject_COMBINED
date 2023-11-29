package smartScheduler;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import java.util.*;

public class Event {
    private String eventId;
    private String eventName;
    private UUID created_by; // Who created the event
    private String eventDescription;
    private List<User> participants;
    private AvailabilityMatrix availabilityMatrix;
    public int[][] finalmatrix = new int[7][24];

    // Constructors
    public Event(String eventId, String eventName, String eventDescription) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.eventDescription = eventDescription;
        this.participants = new ArrayList<>();
        this.availabilityMatrix = new AvailabilityMatrix();
    }

    // Getters and Setters
    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventDescription() {
        return eventDescription;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }

    public List<User> getParticipants() {
        return participants;
    }

    public void setParticipants(List<User> participants) {
        this.participants = participants;
    }

    public void addParticipant(User user) {
        this.participants.add(user);
    }

    public void removeParticipant(User user) {
        this.participants.remove(user);
    }

    public void updateAvailabilityMatrix(User user, int dayIndex, int hourIndex, boolean isAvailable) {
        availabilityMatrix.updateAvailability(user, dayIndex, hourIndex, isAvailable);
    }

    public void updateAvailabilityMatrix(User user, AvailabilityMatrix newAvailabilityMatrix) {
        // Update the availability matrix for a specific user in the event
        availabilityMatrix.updateAvailability(user, newAvailabilityMatrix);
    }

    /**
     * Calculate the best time slots for the event based on participant availability.
     * 
     * @param users List of users to consider for the event
     * @return List of sorted time slots based on availability
     */
    public List<Integer> calculateBestTimeSlots(List<User> users) {
        Map<Integer, Integer> availabilityMetrics = new HashMap<>();

        for (int dayIndex = 0; dayIndex < 7; dayIndex++) {
            for (int hourIndex = 0; hourIndex < 24; hourIndex++) {
                int overlapCount = calculateOverlapCount(dayIndex, hourIndex, users);
                finalmatrix[dayIndex][hourIndex] = overlapCount;
                System.out.println("overlap count is = " + overlapCount + " on " + dayIndex + " at " + hourIndex);
                int matrixIndex = dayIndex * 24 + hourIndex;
                availabilityMetrics.put(matrixIndex, overlapCount);
            }
        }

        // Sort time slots based on availability metric in descending order
        List<Integer> sortedTimeSlots = availabilityMetrics.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        return sortedTimeSlots;
    }

    private int calculateOverlapCount(int dayIndex, int hourIndex, List<User> users) {
        // Calculate and return the number of users available in the given time slot
        return (int) users.stream()
                .filter(user -> availabilityMatrix.isUserAvailable(user, dayIndex, hourIndex))
                .count();
    }
}
