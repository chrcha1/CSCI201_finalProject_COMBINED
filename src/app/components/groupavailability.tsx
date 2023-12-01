"use client";
import React from "react";
import "../css/groupavailibility.css";

interface GroupData {
  [key: string]: string[];
}

interface GroupAvailabilityProps {
  groupData: GroupData;
}

const GroupAvailability: React.FC<GroupAvailabilityProps> = ({ groupData }) => {
  let selectedDay = "2023-11-15T08:00:00.000Z"; // demo value

  const getMaxUsersCount = () => {
    const maxCounts = Object.values(groupData).map((users) => users.length);
    return maxCounts.length > 0 ? Math.max(...maxCounts) : 0;
  };

  //making it red for testing
  const getGradientStyle = (userCount: number, maxCount: number) => {
    const minIntensity = 0.0; // Adjust this value as needed

    const redComponent = 67; // R component of the color #435A58
    const greenComponent = 90; // G component of the color #435A58
    const blueComponent = 88; // B component of the color #435A58

    const intensity =
      maxCount > 0 ? (userCount / maxCount) * 0.8 + minIntensity : minIntensity;

    const backgroundColor = `rgba(
          ${redComponent},
          ${greenComponent},
          ${blueComponent},
          ${intensity}
        )`;

    return { backgroundColor };
  };

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

  let days = calculateDays(selectedDay);
  console.log(days);

  const renderCalendarGrid = () => {
    console.log(days);
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
              const key = `${day}-${time}`;
              const userCount = groupData[key] ? groupData[key].length : 0;
              const maxCount = getMaxUsersCount(); // Calculate max count for each time slot
              const gradientStyle = getGradientStyle(userCount, maxCount);

              //debug
              //console.log(`Time Slot: ${key}, User Count: ${userCount}, Max Count: ${maxCount}`);

              return (
                <div
                  key={key}
                  className={`group-time-slot ${
                    userCount > 0 ? "available" : ""
                  }`}
                  style={gradientStyle}
                  title={`Available: ${
                    groupData[key] ? groupData[key].join(", ") : "None"
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
