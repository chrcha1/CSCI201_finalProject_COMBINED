"use client";
import React, { useEffect, useState } from "react";
import "../css/slotpicker.css";

const EventCalendar = ({
  userId,
  eventId,
  url,
  primaryDate,
}: {
  userId: string;
  eventId: string;
  url: string;
  primaryDate: string;
}) => {
  const [selectedSlots, setSelectedSlots] = useState(new Set());
  const [days, setDays] = useState([]);

  useEffect(() => {
    if (primaryDate && typeof window !== "undefined") {
      setDays(calculateDays());
    }
  }, [primaryDate]);

  const updateAvailability = async () => {
    const availabilityMatrix = createAvailabilityMatrix();
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

  const createAvailabilityMatrix = () => {
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
      const [monthDay, time] = slot.split("-");
      const date = new Date(`${monthDay} ${primaryDate.split("-")[0]}`); // Get year from primary date
      const dayOfWeek = date.getDay(); // Get day of week as number (0=Sunday, 6=Saturday)

      const timeIndex = timeMapping[time];
      if (dayOfWeek !== undefined && timeIndex !== undefined) {
        availabilityMatrix[dayOfWeek][timeIndex] = true;
      }
    });

    console.log("Availability Matrix: ");
    console.log(availabilityMatrix);
    return availabilityMatrix;
  };

  function calculateDays() {
    let selectedDate = new Date(primaryDate); // Example: 2023-12-29T08:00:00.000Z
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
    console.log("Week Days: ");
    console.log(weekDays);
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
      console.log("New Selected Slots: ");
      console.log(newSelectedSlots);
      return newSelectedSlots;
    });
  };

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
