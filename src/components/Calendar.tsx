import React, { useState } from 'react';

import dayjs from 'dayjs';
import { getMonthData, formatDate } from '../utils/dateUtils';
import { EventsState } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import useEvents from '@/hooks/useEvents';
import CalendarDay from './CalendarDay';

interface CalendarProps {
  events: EventsState;
  selectedDate: dayjs.Dayjs;
  onSelectDate: (date: dayjs.Dayjs) => void;
  onMoveEvent: (fromDate: dayjs.Dayjs, toDate: dayjs.Dayjs, eventId: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, selectedDate, onSelectDate, onMoveEvent }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const { exportJson } = useEvents();
  
  const days = getMonthData(currentMonth.year(), currentMonth.month());

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  return (
    <div className="mb-4 md:mb-8 px-2 md:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6 gap-2">
        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
          <ChevronLeft 
            size={32} 
            className="cursor-pointer hover:bg-gray-200 hover:rounded-md p-1"  
            onClick={handlePrevMonth}
          />
          <h2 className="text-xl md:text-2xl font-semibold px-2 sm:px-4">
            {currentMonth.format('MMMM YYYY')}
          </h2>
          <ChevronRight 
            size={32} 
            className="cursor-pointer hover:bg-gray-200 hover:rounded-md p-1" 
            onClick={handleNextMonth}
          />
        </div>
        
        <Button  
          onClick={() => exportJson(currentMonth.format('YYYY-MM'))}
          className="bg-green-500 text-white w-full sm:w-auto text-sm"
        >
          Export as JSON
        </Button>
      </div>
        
      <div className="grid grid-cols-7 gap-1 md:gap-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-500 text-xs md:text-sm">
            {window.innerWidth < 640 ? day.slice(0, 1) : day}
          </div>
        ))}
        {days.map((day) => (
          <CalendarDay
            key={day.toString()}
            day={day}
            events={events[formatDate(day)] || []}
            isSelected={day.isSame(selectedDate, 'day')}
            isToday={day.isSame(dayjs(), 'day')}
            onSelect={() => onSelectDate(day)}
            onMoveEvent={(day, eventId) => onMoveEvent(selectedDate, day, eventId)}
            currentMonth={currentMonth}
          />
        ))}
      </div>
    </div>
  );
};


export default Calendar;