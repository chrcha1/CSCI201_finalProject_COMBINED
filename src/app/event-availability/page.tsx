import React from 'react';
import '../css/events.css';
import Navbar from "@/app/components/navbar";
import Slotpicker from "@/app/components/slotpicker"; 
import Datepicker from "@/app/components/datepicker";
import GroupAvailability from "@/app/components/groupavailability";

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
    return (
        <main>
            <Navbar/>
            <div className="event-main">
                <div className="text-center pt-5 availability-header">
                    <h2>Event Name</h2>
                    <p>To invite people to this event, direct them to *link*</p>
                </div>
                <div className="availability-container">
                    <div className="text-center availability-section">
                        <h3>Your Availability</h3>
                        <p>Click time slots to select your availability</p>
                        <Slotpicker/>
                    </div>
                    <div className="text-center availability-section">
                    <h3>Group Availability</h3>
            <p>Mouseover to see who is available</p>
            <GroupAvailability groupData={sampleGroupData} />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Page;