package smartScheduler;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TimeSlot {
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;

    // Constructors

    public TimeSlot(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
    }

    // Getters and Setters

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }

    // Additional methods as needed

    public boolean overlaps(TimeSlot otherTimeSlot) {
        // Check if this time slot overlaps with another time slot
        return this.startDateTime.isBefore(otherTimeSlot.getEndDateTime()) &&
                this.endDateTime.isAfter(otherTimeSlot.getStartDateTime());
    }

    public DayOfWeek getDayOfWeek() {
        return startDateTime.getDayOfWeek();
    }

    public String getFormattedStartDate() {
        return startDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }

    public String getFormattedStartTime() {
        return startDateTime.format(DateTimeFormatter.ofPattern("HH:mm"));
    }

    public String getFormattedEndDate() {
        return endDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }

    public String getFormattedEndTime() {
        return endDateTime.format(DateTimeFormatter.ofPattern("HH:mm"));
    }
}
