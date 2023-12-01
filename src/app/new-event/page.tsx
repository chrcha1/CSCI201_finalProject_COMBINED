"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/navbar";
import Datepicker from "@/app/components/datepicker";

import "../css/events.css";

export default function newEvent() {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [selectedDates, setSelectedDates] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    // Access localStorage after component mounts to ensure it's client-side
    const userId = localStorage.getItem("userId");
    setCreatedBy(userId || '');
  }, []);

  const onSelectedDatesChange = (newSelectedDates : any) => {
      setSelectedDates(newSelectedDates.values().next().value);
  }

  const handleEventCreation = async (event: any) => {
    event.preventDefault();

    console.log("Creating event...");
    try {
      const domain = `${window.location.protocol}//${window.location.hostname}`;
      const port = 8080;
      console.log(createdBy);
      console.log(selectedDates);
      const response = await fetch(
        `${domain}:${port}/smartScheduler/EventServlet`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `name=${encodeURIComponent(
            eventName
          )}&description=${encodeURIComponent(
            eventDescription
          )}&createdBy=${encodeURIComponent(createdBy || '')}
          &primary_date=${encodeURIComponent(selectedDates)}`,
        }
      );

      const data = await response.json();
      console.log("Response: " + data);

      if (data.message === "Event created successfully.") {
          console.log(data.eventId);
          let eventId = data.eventId;
          setUrl("localhost:3000/events?eventId=" + eventId);
          console.log(url);
      }

    } catch (error) {
      console.log("Failed to create event: ", error);
    }
  };

  // Function to generate time options from 12:00 AM to 11:00 PM
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour <= 23; hour++) {
      const time = `${hour === 0 ? "12" : hour <= 12 ? hour : hour - 12}:00 ${
        hour < 12 ? "AM" : "PM"
      }`;
      options.push(time);
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <main>
      <Navbar />
      <div className={"event-main"}>
        <form className={"container"} onSubmit={handleEventCreation}>
          <div
            className={"row d-flex justify-content-center align-items-center"}
          >
            <div
              className={
                "col-5 d-flex align-items-center justify-content-center"
              }
            >
                {!url && <div
                className={
                  "col-5 d-flex align-items-center justify-content-center"
                }
              >
                <input
                  type="text"
                  className="new-event-name text-center mt-5 p-3 px-5"
                  style={{
                    color: "#090000",
                    fontSize: "24px",
                    fontFamily: "Montserrat",
                    fontWeight: 600,
                    backgroundColor: "rgb(232, 241, 241)",
                  }}
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="New Event Name"
                />
                <input
                  type="text"
                  className="new-event-name text-center mt-5 p-3 px-5"
                  style={{
                    color: "#090000",
                    fontSize: "24px",
                    fontFamily: "Montserrat",
                    fontWeight: 600,
                    backgroundColor: "rgb(232, 241, 241)",
                  }}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="New Event Description"
                />
              </div> }
            </div>
          </div>
          <div
            className={
              "row pt-5 d-flex align-items-start justify-content-center h-100"
            }
            style={{
              color: "#090000",
              fontSize: "24px",
              fontFamily: "Montserrat",
              fontWeight: 400,
            }}
          >
            <div
              className={
                "col-12 text-center pt-2 questions d-flex align-items-center justify-content-center flex-column"
              }
            >
                { url && (
                    <div className={"mb-3"}>
                        <div className={"mb-3"}>
                            Event Successfully Created!
                        </div>
                        <div className={"mb-2"}>Schedule your group availability <a href={url}>here</a>!</div>
                    </div>
                )}
              { !url && (
                  <div>
                    <div className={"mb-5"}>What date will work?</div>
                  <Datepicker onSelectedDatesChange={onSelectedDatesChange} />
                  </div>
              )}
            </div>
            { !url && (
                <div
                    className={"new-event-create-event-button-wrapper row pt-5 w-50"}
                >
                  <button
                      className={"new-event-create-event-button px-5 py-1 mb-5"}
                      style={{
                        fontWeight: 400,
                        color: "435A58",
                      }}
                      type="submit"
                  >
                    CREATE EVENT
                  </button>
                </div>
            )}

          </div>
        </form>
      </div>
    </main>
  );
}
