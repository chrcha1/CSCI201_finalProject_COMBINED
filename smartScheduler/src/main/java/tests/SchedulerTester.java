package tests;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

import models.Event;
import models.User;

public class SchedulerTester {

    public static void main(String[] args) {
        // Create users
        User user1 = new User("1", "Alice", "hashedPwd1", Timestamp.from(Instant.now()));
        User user2 = new User("2", "Bob", "hashedPwd2", Timestamp.from(Instant.now()));
        User user3 = new User("3", "Charlie", "hashedPwd3", Timestamp.from(Instant.now()));
        User user4 = new User("4", "David", "hashedPwd4", Timestamp.from(Instant.now()));
        User user5 = new User("5", "Eve", "hashedPwd5", Timestamp.from(Instant.now()));

        // Create more events
        Event event1 = new Event("E1", "Team Meeting", "Weekly Meeting", "1");
        Event event2 = new Event("E2", "Project Discussion", "Discuss project details", "2");

        // Add users to events
        event1.addParticipant(user1);
        event1.addParticipant(user2);
        event1.addParticipant(user3);
        event1.addParticipant(user4);
        event1.addParticipant(user5);

        event2.addParticipant(user2);
        event2.addParticipant(user3);
        event2.addParticipant(user4);

        // Update availability for users
        user1.setTimeSlot(0, 9, true); // User1 available on Monday at 9 AM
        user1.setTimeSlot(1, 14, true); // User1 available on Tuesday at 2 PM
        user1.setTimeSlot(2, 10, true); // User1 available on Wednesday at 10 AM

        user2.setTimeSlot(0, 9, true); // User2 available on Monday at 9 AM
        user2.setTimeSlot(1, 14, false); // User2 not available on Tuesday at 2 PM
        user2.setTimeSlot(2, 10, true); // User2 available on Wednesday at 10 AM

        user3.setTimeSlot(0, 9, false); // User3 not available on Monday at 9 AM
        user3.setTimeSlot(1, 14, true); // User3 available on Tuesday at 2 PM
        user3.setTimeSlot(2, 10, false); // User3 not available on Wednesday at 10 AM

        user4.setTimeSlot(0, 9, true); // User4 available on Monday at 9 AM
        user4.setTimeSlot(1, 14, true); // User4 available on Tuesday at 2 PM
        user4.setTimeSlot(2, 10, true); // User4 available on Wednesday at 10 AM

        user5.setTimeSlot(0, 9, false); // User5 not available on Monday at 9 AM
        user5.setTimeSlot(1, 14, true); // User5 available on Tuesday at 2 PM
        user5.setTimeSlot(2, 10, false); // User5 not available on Wednesday at 10 AM

        // Print availability matrix for users
        /*
         * System.out.println("Availability Matrix for User1:");
         * user1.printAvailabilityMatrix();
         * System.out.println("Availability Matrix for User2:");
         * user2.printAvailabilityMatrix();
         * System.out.println("Availability Matrix for User3:");
         * user3.printAvailabilityMatrix();
         * System.out.println("Availability Matrix for User4:");
         * user4.printAvailabilityMatrix();
         * System.out.println("Availability Matrix for User5:");
         * user5.printAvailabilityMatrix();
         */

        // Calculate and print best time slots for the events
        System.out.println("Best Time Slots for Event1:");
        List<Integer> bestTimeSlotsEvent1 = event1.calculateBestTimeSlots(event1.getParticipants());
        bestTimeSlotsEvent1.forEach(matrixIndex -> {
            int dayIndex = matrixIndex / 24;
            int hourIndex = matrixIndex % 24;
            System.out.println("Day: " + dayIndex + ", Hour: " + hourIndex);
        });

        System.out.println("Best Time Slots for Event2:");
        List<Integer> bestTimeSlotsEvent2 = event2.calculateBestTimeSlots(event2.getParticipants());
        bestTimeSlotsEvent2.forEach(matrixIndex -> {
            int dayIndex = matrixIndex / 24;
            int hourIndex = matrixIndex % 24;
            System.out.println("Day: " + dayIndex + ", Hour: " + hourIndex);
        });

        for (int[] element : event1.finalmatrix) {
            for (int j = 0; j < event1.finalmatrix[0].length; j++) {
                System.out.print(element[j] + " ");
            }
            System.out.println();
        }
    }
}
