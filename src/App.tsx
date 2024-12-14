import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Calendar from './components/Calendar';
import EventSheet from './components/EventSheet';
import useEvents from './hooks/useEvents';
import dayjs from 'dayjs';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { events, addEvent, editEvent, deleteEvent, moveEvent } = useEvents();

  return (
    <DndProvider backend={HTML5Backend}>
  <div className="flex justify-center min-h-screen bg-gray-100 p-4">
    <div className="container p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Event Calendar</h1>
      <Calendar
        events={events}
        selectedDate={selectedDate}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setIsSheetOpen(true);
        }}
        onMoveEvent={moveEvent}
      />
      <EventSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        selectedDate={selectedDate}
        events={events[selectedDate.format('YYYY-MM-DD')] || []}
        onAddEvent={(event) => addEvent(selectedDate, event)}
        onEditEvent={(eventId, event) => editEvent(selectedDate, eventId, event)}
        onDeleteEvent={(eventId) => deleteEvent(selectedDate, eventId)}
      />
    </div>
  </div>
</DndProvider>


  );
};

export default App;

