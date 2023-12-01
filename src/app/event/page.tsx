"use client";

import React, { useState, useEffect } from "react";
import "../css/events.css";
import Navbar from "@/app/components/navbar";
import Slotpicker from "@/app/components/slotpicker";
import GroupAvailability from "@/app/components/groupavailability";

const EventPage = () => {
  const [groupData, setGroupData] = useState({});
  const [userAvailability, setUserAvailability] = useState({});
  const [eventDetails, setEventDetails] = useState({
    name: "",
    description: "",
    createdBy: "",
    primaryDate: "",
  });
  const [eventId, setEventId] = useState("");
  const [userId, setUserId] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      setEventId(queryParams.get("eventId") || "");
      setUserId(localStorage.getItem("userId") || "");
      const domain = `${window.location.protocol}//${window.location.hostname}`;
      const port = 8080;
      setUrl(`${domain}:${port}/smartScheduler`);
    }
  }, []);

  useEffect(() => {
    if (eventId) {
      console.log("Updated Event ID: ", eventId);
      fetchEventDetails(eventId);
      fetchGroupData(eventId);
    }
  }, [eventId]);

  useEffect(() => {
    if (userId && eventId) {
      fetchUserAvailability(userId, eventId);
    }
  }, [userId, eventId]);

  const fetchEventDetails = (eventId: string) => {
    fetch(`${url}/EventServlet?eventId=${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log("Event details: ");
        // console.log(data);
        setEventDetails({
          name: data.name || "Unnamed Event",
          description: data.description || "No description provided.",
          createdBy: data.createdBy || "Unknown",
          primaryDate: data.primaryDate || "",
        });
      })
      .catch((error) => {
        console.error("Error fetching event details: ", error);
      });
  };

  const fetchGroupData = (eventId: string) => {
    fetch(`${url}/GetCombinedAvailability?eventId=${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log("Raw group data: ");
        // console.log(data);
        const formattedData = formatGroupData(data);
        // console.log("Group data: ");
        // console.log(formattedData);
        setGroupData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching group data: ", error);
      });
  };

  const fetchUserAvailability = (userId: string, eventId: string) => {
    fetch(`${url}/UserAvailability?userId=${userId}&eventId=${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("User availability: ", data);
        if (data.status === 200) {
          setUserAvailability(JSON.parse(data.data)); // Assuming data.data is the user's availability
        } else {
          console.error("Error fetching user availability: ", data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching user availability: ", error);
      });
  };

  const formatGroupData = (data: any[][]) => {
    const formatted = {};
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    data.forEach((dayData, dayIndex) => {
      dayData.forEach((hourData, hourIndex) => {
        const hourFormatted =
          hourIndex < 10 ? `0${hourIndex}:00` : `${hourIndex}:00`;
        const key = `${days[dayIndex]}-${hourFormatted}`;
        formatted[key] = {
          count: hourData.count,
          users: hourData.users,
          percentage: hourData.percentage,
        };
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
          <p>
            To invite people to this event, direct them to{" "}
            <a href={window.location.href}>this link</a>
          </p>
        </div>
        <div className="availability-container">
          <div className="text-center availability-section">
            <h3>Your Availability</h3>
            <p>Click time slots to select your availability</p>
            <Slotpicker
              userId={userId}
              eventId={eventId}
              url={url}
              primaryDate={eventDetails.primaryDate}
              userAvailability={userAvailability}
            />
          </div>
          <div className="text-center availability-section">
            <h3>Group Availability</h3>
            <p>Mouseover to see who is available</p>
            <GroupAvailability
              groupData={groupData}
              primaryDate={eventDetails.primaryDate}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default EventPage;
