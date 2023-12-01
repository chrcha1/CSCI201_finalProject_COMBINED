"use client";
import React, { useEffect, useState } from "react";
import "../css/groupavailibility.css";

interface GroupData {
  [key: string]: TimeSlotData;
}

interface TimeSlotData {
  count: number;
  users: string[];
  percentage: number;
}

interface GroupAvailabilityProps {
  groupData: GroupData;
  primaryDate: string;
}

const GroupAvailability: React.FC<GroupAvailabilityProps> = ({
  groupData,
  primaryDate,
}) => {
  const [days, setDays] = useState([]);
  console.log(groupData["Fri-09:00"]);

  useEffect(() => {
    if (primaryDate && typeof window !== "undefined") {
      setDays(calculateDays());
    }
  }, [primaryDate]);

  useEffect(() => {
    if (groupData && typeof window !== "undefined") {
      renderCalendarGrid();
    }
  }, [groupData]);

  //making it red for testing
  const getGradientStyle = (percentage: number) => {
    const minIntensity = 0.0; // Adjust this value as needed

    const redComponent = 67; // R component of the color #435A58
    const greenComponent = 90; // G component of the color #435A58
    const blueComponent = 88; // B component of the color #435A58

    const intensity = percentage * 0.01 * 0.8 + minIntensity;

    // console.log(`Intensity: ${(userCount / maxCount)}`);

    const backgroundColor = `rgba(
          ${redComponent},
          ${greenComponent},
          ${blueComponent},
          ${intensity}
        )`;

    return { backgroundColor };
  };

  function calculateDays() {
    let selectedDate = new Date(primaryDate);
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
    console.log(weekDays);
    return weekDays;
  }

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
      <div className="group-calendar-grid">
        <div className="group-corner-cell"></div>
        {days.map((day) => (
          <div key={day} className="group-day-header">
            {day}
          </div>
        ))}
        {times.map((time) => (
          <React.Fragment key={time}>
            <div className="group-time-header">{time}</div>
            {days.map((day) => {
              const dayOfWeek = dateToDayOfWeek(day, year);
              const formattedTime = convertTo24HourFormat(time);
              const key = `${dayOfWeek}-${formattedTime}`;
              const timeSlotData = groupData[key] || {
                users: [],
                percentage: 0,
              };
              const gradientStyle = getGradientStyle(timeSlotData.percentage);

              //debug
              // console.log(`Time Slot: ${key}, User Count: ${userCount}, Max Count: ${maxCount}`);

              return (
                <div
                  key={key}
                  className={`group-time-slot ${
                    timeSlotData?.users.length > 0 ? "available" : ""
                  }`}
                  style={gradientStyle}
                  title={`Available: ${
                    timeSlotData?.users.join(", ") || "None"
                  }`}
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

export default GroupAvailability;
