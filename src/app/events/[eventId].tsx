import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import "../css/events.css";
import Navbar from "@/app/components/navbar";
import Slotpicker from "@/app/components/slotpicker";
import GroupAvailability from "@/app/components/groupavailability";

type AvailabilityMatrix = boolean[][]; // A 7x24 matrix of boolean values

interface ParticipantAvailability {
  username: string;
  availability: AvailabilityMatrix;
}

type ParticipantsAvailabilityData = ParticipantAvailability[];

const sampleGroupData = {
  "Mon-9:00 AM": ["Alice", "Bob"],
  "Mon-10:00 AM": ["Alice", "Charlie"],
  "Tue-9:00 AM": ["Bob", "Charlie", "Dave"],
  "Tue-11:00 AM": ["Eve", "Alice"],
  "Wed-12:00 PM": ["Charlie"],
  "Thu-2:00 PM": ["Bob", "Eve"],
  "Fri-1:00 PM": ["Alice", "Dave", "Eve"],
  "Sat-3:00 PM": ["Charlie", "Dave"],
  "Sun-4:00 PM": ["Eve"],
};

const Page = () => {
  const [groupData, setGroupData] = useState({});
  const [eventDetails, setEventDetails] = useState({ name: "", description: "", createdBy: "" });
  const router = useRouter();

  useEffect(() => {
    const eventId = `${router.query.eventId}`; // Need to implement slug routing and get event ID from URL
    fetchEventDetails(eventId);
    fetchGroupData(eventId);
  }, []);

  const fetchEventDetails = (eventId: string) => {
    fetch(`/EventServlet?eventId=${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        setEventDetails({
          name: data.name || "Unnamed Event",
          description: data.description || "No description provided.",
          createdBy: data.createdBy || "Unknown",
        });
      })
      .catch((error) => {
        console.error("Error fetching event details: ", error);
      });
  };

  const fetchGroupData = (eventId: string) => {
    fetch(`/GetCombinedAvailability?eventId=${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = formatGroupData(data);
        setGroupData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching group data: ", error);
      });
  };

  const formatGroupData = (data: ParticipantsAvailabilityData) => {
    const formatted: { [key: string]: string[] } = {};
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Initialize formatted object with empty arrays
    days.forEach((day, dayIndex) => {
      for (let hour = 0; hour < 24; hour++) {
        const hourFormatted = hour < 10 ? `0${hour}:00` : `${hour}:00`;
        const key = `${day}-${hourFormatted}`;
        formatted[key] = [];
      }
    });

    // Aggregate usernames by timeslot
    data.forEach((participant) => {
      participant.availability.forEach((dayAvailability, dayIndex) => {
        dayAvailability.forEach((isAvailable, hour) => {
          if (isAvailable) {
            const hourFormatted = hour < 10 ? `0${hour}:00` : `${hour}:00`;
            const key = `${days[dayIndex]}-${hourFormatted}`;
            formatted[key].push(participant.username);
          }
        });
      });
    });

    return formatted;
  };

  return (
    <main>
      <Navbar />
      <div className="event-main">
        <div className="text-center pt-5 availability-header">
          <h2>{eventDetails.name}</h2>
          <p>{eventDetails.description}</p>
          <p>To invite people to this event, direct them to *link*</p>
        </div>
        <div className="availability-container">
          <div className="text-center availability-section">
            <h3>Your Availability</h3>
            <p>Click time slots to select your availability</p>
            <Slotpicker />
          </div>
          <div className="text-center availability-section">
            <h3>Group Availability</h3>
            <p>Mouseover to see who is available</p>
            <GroupAvailability groupData={groupData} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
