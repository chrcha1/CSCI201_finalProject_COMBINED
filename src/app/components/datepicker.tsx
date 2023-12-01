"use client";
import React, { useContext, useState, useEffect } from "react";
import DateSelectionContext from "@/app/components/dateselectioncontext";
import "../css/datepicker.css";

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export default function DatepickerComponent( props : any) {
  const { selectedDates, setSelectedDates } = useContext(DateSelectionContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  // Move the selected dates state to the DatepickerComponent
  const [selectedDatesLocal, setSelectedDatesLocal] =
    useState<Set<string>>(selectedDates);

  useEffect(() => {
    generateCalendar();
  }, [currentDate]);

  function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfMonth = new Date(year, month, lastDateOfMonth).getDay();
    const lastDateOfLastMonth = new Date(year, month, 0).getDate();

    let days: CalendarDay[] = [];

    // Previous month's dates
    for (let i = firstDayOfMonth; i > 0; i--) {
      const date = new Date(year, month - 1, lastDateOfLastMonth - i + 1);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // This month's dates
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === new Date().toDateString();
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isToday,
      });
    }

    // Next month's dates to complete the current row
    if (lastDayOfMonth !== 6) {
      let daysLeftInRow = 6 - lastDayOfMonth;
      for (let i = 1; i <= daysLeftInRow; i++) {
        const date = new Date(year, month + 1, i);
        days.push({
          date,
          isCurrentMonth: false,
          isToday: false,
        });
      }
    }

    setCalendarDays(days);
  }

  function navigateMonth(direction: "previous" | "next") {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + (direction === "previous" ? -1 : 1),
        1
      )
    );
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleDateClick = (date: Date) => {
    setSelectedDatesLocal(() => {
      const newSelectedDates = new Set<string>();
      const dateString = date.toISOString();
      newSelectedDates.add(dateString);
      console.log(newSelectedDates);
      props.onSelectedDatesChange(newSelectedDates);
      return newSelectedDates;
    });
  };

  // Update the global selected dates when local state changes
  useEffect(() => {
    setSelectedDates(selectedDatesLocal);
  }, [selectedDatesLocal]);

  return (
    <div className="datepicker-container d-flex flex-column justify-content-center align-items-center px-4">
      <div className="datepicker-header d-flex align-items-center justify-content-center mt-4 mb-4">
        <div className={"col-9"}>
          <div className="datepicker-current-date pe-4 text-start">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
        </div>
        <div className={"col-3"}>
          <div className="datepicker-navigation-menu d-flex text-end">
            <span
              className={"datepicker-navigation"}
              onClick={() => navigateMonth("previous")}
            >
              ←
            </span>
            <span
              className={"datepicker-navigation"}
              onClick={() => navigateMonth("next")}
            >
              →
            </span>
          </div>
        </div>
      </div>

      <div
        className={"datepicker-body pb-4 d-flex align-items-center flex-column"}
      >
        <div className={"datepicker-grid"}>
          <ul className={"datepicker-days"}>
            <li>Sun</li>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
          </ul>
          <ul className={"datepicker-dates"}>
            {calendarDays.map((day, index) => (
              <li
                key={index}
                className={`datepicker-date ${
                  day.isCurrentMonth ? "current-month" : "inactive"
                } ${day.isToday ? "active" : ""} ${
                  selectedDatesLocal.has(day.date.toISOString())
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleDateClick(day.date)}
              >
                {day.date.getDate()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
