import { Button } from "@/components/ui/button";
import { Event, EventsByDate } from "@/types";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";

const ExportEventsButton: React.FC<{
  events: Event[];
  selectedMonth: string;
  currentMonth: dayjs.Dayjs;
}> = ({ selectedMonth, currentMonth }) => {

  const [eventsByDate, setEventsByDate] = useState<EventsByDate>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Retrieve events from local storage
    if (isLoading) {
      const storedEvents = localStorage.getItem("events");
      if (storedEvents) {
        setEventsByDate(JSON.parse(storedEvents));
      }
    }
  }, [isLoading]);

  const handleExportJson = async () => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      setEventsByDate(JSON.parse(storedEvents));
    }

    // Filtering events so we will take only events of that month which the user want.
    const filteredEvents: Event[] = [];
    Object.keys(eventsByDate).forEach((date) => {
      if (date.startsWith(selectedMonth)) {
        filteredEvents.push(...eventsByDate[date]);
      }
    });

    if (filteredEvents.length === 0) {
      alert("No events found for the selected month.");
      return;
    }

    const jsonBlob = new Blob([JSON.stringify(filteredEvents, null, 2)], {
      type: "application/json",
    });

    // Using file-saver package to use saveAs() to export the json file named after events_[month].json
    saveAs(jsonBlob, `events_${selectedMonth}.json`);

    setIsLoading(false);
  };

  return (
    <>
      <div className="flex space-x-2 ml-80">
        <h2 className="text-2xl font-semibold ">
          {currentMonth.format("MMMM YYYY")}
        </h2>
      </div>
      <Button onClick={handleExportJson} className="bg-blue-500 text-white ">
        Export as JSON
      </Button>
    </>
  );
};

export default ExportEventsButton;
