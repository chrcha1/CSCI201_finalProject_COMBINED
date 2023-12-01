"use client";
import React, { useState } from "react";
import "../css/slotpicker.css";

const EventCalendar = () => {
  const [selectedSlots, setSelectedSlots] = useState(new Set());

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
    );
  };

  return renderCalendarGrid();
};

export default EventCalendar;
