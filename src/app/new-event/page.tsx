import Navbar from "@/app/components/navbar";
import "../css/events.css";
import Datepicker from "@/app/components/datepicker";

export default function newEvent() {
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
        <div className={"container"}>
          <div
            className={"row d-flex justify-content-center align-items-center"}
          >
            <div
              className={
                "col-5 d-flex align-items-center justify-content-center"
              }
            >
              <div
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
                  defaultValue="New Event Name"
                />
              </div>
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
              <div className={"mb-5"}>What date will work?</div>
              <Datepicker />
            </div>
              <div className={"new-event-create-event-button-wrapper row pt-5 w-50"}>
                <button
                  className={"new-event-create-event-button px-5 py-1 mb-5"}
                  style={{
                    fontWeight: 400,
                    color: "435A58",
                  }}
                >
                  CREATE EVENT
                </button>
              </div>
          </div>
        </div>
      </div>
    </main>
  );
}
