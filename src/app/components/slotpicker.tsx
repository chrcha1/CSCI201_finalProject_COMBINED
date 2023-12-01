"use client";
import React, { useState } from "react";
import "../css/slotpicker.css";

const EventCalendar = ({
  userId,
  eventId,
  url,
}: {
  userId: string;
  eventId: string;
  url: string;
}) => {
  const [selectedSlots, setSelectedSlots] = useState(new Set());

  const updateAvailability = async () => {
    const availabilityMatrix = createAvailabilityMatrix(
      selectedSlots as Set<string>
    );
    const payload = {
      userId: userId,
      eventId: eventId,
      availability: availabilityMatrix,
    };

    console.log(JSON.stringify(payload));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    try {
      const response = await fetch(`${url}/UserAvailability`, requestOptions);
      const data = await response.text();
      console.log(data);
    } catch (error) {
      console.error("Error updating availability: ", error);
    }
  };

  const createAvailabilityMatrix = (selectedSlots: Set<string>) => {
    const dayMapping: { [key: string]: number } = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };
    const timeMapping: { [key: string]: number } = {
      "9:00 AM": 9,
      "10:00 AM": 10,
      "11:00 AM": 11,
      "12:00 PM": 12,
      "1:00 PM": 13,
      "2:00 PM": 14,
      "3:00 PM": 15,
      "4:00 PM": 16,
      "5:00 PM": 17,
    };

    let availabilityMatrix = Array(7)
      .fill(null)
      .map(() => Array(24).fill(false));

    selectedSlots.forEach((slot) => {
      const [day, time] = slot.split("-");
      const dayIndex = dayMapping[day.split(" ")[0]]; // Extract day part and get its index
      const timeIndex = timeMapping[time];
      if (dayIndex !== undefined && timeIndex !== undefined) {
        availabilityMatrix[dayIndex][timeIndex] = true;
      }
    });

    return availabilityMatrix;
  };

  let selectedDay = "2023-11-15T08:00:00.000Z"; // demo value
  function calculateDays(selectedDay: any) {
    let selectedDate = new Date(selectedDay);
    const abbreviatedMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let weekDays = [];

    for (let i = -3; i <= 3; i++) {
      let newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() + i);
      let month = abbreviatedMonths[newDate.getMonth()];
      let day = newDate.getDate();
      let monthDay = `${month} ${day}`;
      weekDays.push(monthDay);
    }
    return weekDays;
  }

  const handleTimeSlotClick = (day: string, time: string) => {
    const key = `${day}-${time}`;
    setSelectedSlots((prevSelectedSlots) => {
      const newSelectedSlots = new Set(prevSelectedSlots);
      if (newSelectedSlots.has(key)) {
        newSelectedSlots.delete(key);
      } else {
        newSelectedSlots.add(key);
      }
      return newSelectedSlots;
    });
  };

  let days = calculateDays(selectedDay);

  const renderCalendarGrid = () => {
    const times = [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
    ];
    return (
      <div>
        <div className="calendar-grid">
          <div className="corner-cell"></div> {/* Empty cell for alignment */}
          {days.map((day) => (
            <div key={day} className="day-header">
              {day}
            </div>
          ))}
          {times.map((time) => (
            <React.Fragment key={time}>
              <div className="time-header">{time}</div>
              {days.map((day) => {
                const isSelected = selectedSlots.has(`${day}-${time}`);
                return (
                  <div
                    key={`${day}-${time}`}
                    className={`time-slot ${isSelected ? "selected" : ""}`}
                    onClick={() => handleTimeSlotClick(day, time)}
                  >
                    &nbsp;
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <button onClick={updateAvailability}>Update Availability</button>
      </div>
    );
  };

  return renderCalendarGrid();
};

export default EventCalendar;
