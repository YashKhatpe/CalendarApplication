


import { useState, useEffect } from 'react';
import { Event, EventsByDate, EventsState } from '../types';
import { formatDate } from '../utils/dateUtils';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
const useEvents = () => {
  const [events, setEvents] = useState<EventsState>({});
  const [eventsByDate, setEventsByDate] = useState<EventsByDate>({});
  const [_, setIsLoading] = useState(false);
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    // console.log(storedEvents);
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(parsedEvents);
        setEventsByDate(parsedEvents);
      } catch (error) {
        console.error("Error parsing events from localStorage:", error);
      }
    }
  }, []);
  
  

  useEffect(() => {
    if (Object.keys(events).length > 0) {
      localStorage.setItem('events', JSON.stringify(events));
    }
    // localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const addEvent = (date: dayjs.Dayjs, event: Omit<Event, 'id'>) => {
    const formattedDate = formatDate(date);
    const newEvent: Event = { ...event, id: Date.now().toString() };
    setEvents((prevEvents) => ({
      ...prevEvents,
      [formattedDate]: [...(prevEvents[formattedDate] || []), newEvent],
    }));
  };

  const editEvent = (date: dayjs.Dayjs, eventId: string, updatedEvent: Omit<Event, 'id'>) => {
    const formattedDate = formatDate(date);
    setEvents((prevEvents) => ({
      ...prevEvents,
      [formattedDate]: prevEvents[formattedDate].map((event) =>
        event.id === eventId ? { ...updatedEvent, id: eventId } : event
      ),
    }));
  };

  const deleteEvent = (date: dayjs.Dayjs, eventId: string) => {
    const formattedDate = formatDate(date);
    setEvents((prevEvents) => ({
      ...prevEvents,
      [formattedDate]: prevEvents[formattedDate].filter((event) => event.id !== eventId),
    }));
  };

  const moveEvent = (fromDate: dayjs.Dayjs, toDate: dayjs.Dayjs, eventId: string) => {
  setEvents((prevEvents) => {
    const updatedEvents = { ...prevEvents };
    const fromDateKey = fromDate.format('YYYY-MM-DD');
    const toDateKey = toDate.format('YYYY-MM-DD');
    
    // Remove event from the previous date
    const eventIndex = updatedEvents[fromDateKey]?.findIndex(event => event.id === eventId);
    if (eventIndex >= 0) {
      const eventToMove = updatedEvents[fromDateKey][eventIndex];
      updatedEvents[fromDateKey].splice(eventIndex, 1);
      
      // Add it to the new date
      if (!updatedEvents[toDateKey]) {
        updatedEvents[toDateKey] = [];
      }
      updatedEvents[toDateKey].push(eventToMove);
    }

    return updatedEvents;
  });
};

  const exportJson = async ( selectedMonth: string ) => {  
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
        saveAs(jsonBlob, `events_${selectedMonth}.json`);
        
      
        setIsLoading(false);
      };
  
  
  return { events, addEvent, editEvent, deleteEvent, moveEvent, exportJson };
};

export default useEvents;