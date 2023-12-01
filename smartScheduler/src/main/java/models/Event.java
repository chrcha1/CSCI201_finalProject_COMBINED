package models;

public class Event {
    private String id;
    private String name;
    private String description;
    private String createdBy; // UUID foreign key of the user who created the event

    // Constructors
    public Event(String id, String name, String description, String createdBy) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
    }

    // Getters and Setters
    public String getEventId() {
        return id;
    }

    public void setEventId(String id) {
        this.id = id;
    }

    public String getEventName() {
        return name;
    }

    public void setEventName(String name) {
        this.name = name;
    }

    public String getEventDescription() {
        return description;
    }

    public void setEventDescription(String description) {
        this.description = description;
    }
    
    public String getEventCreator() {
    	return createdBy;
    }
    
    public void setEventCreator(String creatorId) {
    	this.createdBy = creatorId;
    }

    // Getting participants and availability will be handled through database calls

    // Availability and relevant data will also be fetched through the database
}
