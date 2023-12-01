"use client";
import React, { useEffect, useState } from "react";
import "../css/slotpicker.css";

const EventCalendar = ({
  userId,
  eventId,
  url,
  primaryDate,
  userAvailability
}: {
  userId: string;
  eventId: string;
  url: string;
  primaryDate: string;
  userAvailability: [][];
}) => {
  const [selectedSlots, setSelectedSlots] = useState(new Set());
  const [days, setDays] = useState([]);

  useEffect(() => {
    if (primaryDate && typeof window !== "undefined") {
      setDays(calculateDays());
    }
  }, [primaryDate]);

  useEffect(() => {
    if (userAvailability && typeof window !== "undefined") {
      console.log("User Availability: ", userAvailability)
      updateSelectedSlotsFromAvailability(userAvailability)
    }
  }, [userAvailability]);

  const updateSelectedSlotsFromAvailability = (availabilityMatrix: any) => {
    const newSelectedSlots = new Set();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // Updated times array to use 24-hour format
    const times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  
    console.log(availabilityMatrix.length);
    for (let dayIndex = 0; dayIndex < Math.min(availabilityMatrix.length, 7); dayIndex++) {
      for (let hourIndex = 9; hourIndex <= 17; hourIndex++) {
        if (availabilityMatrix[dayIndex][hourIndex]) {
          const day = days[dayIndex];
          const time = times[hourIndex - 9]; // Directly use 24-hour format time
          console.log(`Adding ${day}-${time}`);
          newSelectedSlots.add(`${day}-${time}`);
        }
      }
    }
  
    setSelectedSlots(newSelectedSlots);
    console.log("New Selected Slots: ");
    console.log(newSelectedSlots);
  };

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
      "9:00": 9,
      "10:00": 10,
      "11:00": 11,
      "12:00": 12,
      "13:00": 13,
      "14:00": 14,
      "15:00": 15,
      "16:00": 16,
      "17:00": 17,
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
    const year = new Date(primaryDate).getFullYear();

    const dateToDayOfWeek = (dateString: string, year: number) => {
      const monthDay = dateString.split(" "); // ["Dec", "31"]
      const months = [
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
      const monthIndex = months.indexOf(monthDay[0]);
      const day = parseInt(monthDay[1], 10);

      const date = new Date(year, monthIndex, day);
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return daysOfWeek[date.getDay()];
    };

    const convertTo24HourFormat = (time: string) => {
      const [hours, minutesPart] = time.split(":");
      let [minutes, modifier] = minutesPart.split(" ");
      let hour = parseInt(hours, 10);

      if (modifier === "PM" && hour < 12) hour += 12;
      if (modifier === "AM" && hour === 12) hour = 0;

      return `${hour < 10 ? "0" + hour : hour}:${minutes}`;
    };
    
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
                const dayOfWeek = dateToDayOfWeek(day, year);
                const formattedTime = convertTo24HourFormat(time);
                const key = `${dayOfWeek}-${formattedTime}`;
                // console.log(`Key: ${key}`)
                const isSelected = selectedSlots.has(key);
                return (
                  <div
                    key={`${day}-${time}`}
                    className={`time-slot ${isSelected ? "selected" : ""}`}
                    onClick={() => handleTimeSlotClick(dayOfWeek, formattedTime)}
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
