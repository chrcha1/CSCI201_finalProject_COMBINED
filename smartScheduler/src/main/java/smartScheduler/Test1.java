package smartScheduler;

import java.sql.Timestamp;
import java.time.Instant;

import models.Event;
import models.User;

/*

public static void main(String[] args) {
    // Create users
    User user1 = new User("1", "Alice", "hashedPassword1");
    User user2 = new User("2", "Bob", "hashedPassword2");
    User user3 = new User("3", "Charlie", "hashedPassword3");
    User user4 = new User("4", "David", "hashedPassword4");
    User user5 = new User("5", "Eve", "hashedPassword5");

    // Create an event
    Event event1 = new Event("E1", "Team Meeting", "Discuss project updates");

    // Add users to the event
    event1.addParticipant(user1);
    event1.addParticipant(user2);
    event1.addParticipant(user3);
    event1.addParticipant(user4);
    event1.addParticipant(user5);

    // Set availability for users in the event
    user1.addTimeSlot(0, 12, true); // user1 is available on Monday at 12 PM
    user1.addTimeSlot(1, 15, true); // user1 is available on Tuesday at 3 PM

    user2.addTimeSlot(0, 12, true); // user2 is available on Monday at 12 PM
    user2.addTimeSlot(2, 10, true); // user2 is available on Wednesday at 10 AM

    user3.addTimeSlot(3, 14, true); // user3 is available on Thursday at 2 PM
    user3.addTimeSlot(4, 16, true); // user3 is available on Friday at 4 PM

    user4.addTimeSlot(0, 14, true); // user4 is available on Monday at 2 PM
    user4.addTimeSlot(2, 12, true); // user4 is available on Wednesday at 12 PM

    user5.addTimeSlot(1, 16, true); // user5 is available on Tuesday at 4 PM
    user5.addTimeSlot(4, 10, true); // user5 is available on Friday at 10 AM

    // Calculate best time slots for the event
    List<User> participants = event1.getParticipants();
    List<Integer> bestTimeSlots = event1.calculateBestTimeSlots(participants);

    // Print the best time slots
    System.out.println("Best Time Slots for Event " + event1.getEventName() + ":");
    for (Integer timeSlot : bestTimeSlots) {
        int dayIndex = timeSlot / 24;
        int hourIndex = timeSlot % 24;
        System.out.println("Day " + dayIndex + ", Hour " + hourIndex);
    }

    // Update availability using a new availability matrix for user1
    AvailabilityMatrix newAvailabilityMatrix = new AvailabilityMatrix();
    user1.addTimeSlot(3, 14, true); // user1 is available on Thursday at 2 PM
    user1.updateAvailabilityMatrix(newAvailabilityMatrix);

    // Check if user1 is available at the new time slot
    System.out.println("Is user1 available on Thursday at 2 PM? " + user1.isAvailable(3, 14));
}
}

*/

public class Test1 {

    public static void main(String[] args) {
        // Create users
        User user1 = new User("1", "Alice", "hashedPwd1", Timestamp.from(Instant.now()));
        User user2 = new User("2", "Bob", "hashedPwd2", Timestamp.from(Instant.now()));
        User user3 = new User("3", "Charlie", "hashedPwd3", Timestamp.from(Instant.now()));

        // Create an event
        Event event = new Event("E1", "Team Meeting", "Weekly Meeting", "1");

        // Add users to the event
        event.addParticipant(user1);
        event.addParticipant(user2);
        event.addParticipant(user3);

        // Update availability for users
        user1.setTimeSlot(0, 9, true); // User1 available on Monday at 9 AM
        user1.setTimeSlot(1, 14, true); // User1 available on Tuesday at 2 PM

        user2.setTimeSlot(0, 9, true); // User2 available on Monday at 9 AM
        user2.setTimeSlot(1, 14, false); // User2 not available on Tuesday at 2 PM

        user3.setTimeSlot(0, 9, false); // User3 not available on Monday at 9 AM
        user3.setTimeSlot(1, 14, true); // User3 available on Tuesday at 2 PM

        // Print availability matrix for users
        // user1.printAvailabilityMatrix();
        // user2.printAvailabilityMatrix();
        // user3.printAvailabilityMatrix();

        // Calculate and print best time slots for the event
        System.out.println("Best Time Slots for the Event:");
        event.calculateBestTimeSlots(event.getParticipants())
                .forEach(matrixIndex -> {
                    int dayIndex = matrixIndex / 24;
                    int hourIndex = matrixIndex % 24;
                    System.out.println("Day: " + dayIndex + ", Hour: " + hourIndex);
                });

    }
}
