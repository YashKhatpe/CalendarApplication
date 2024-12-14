import { Event } from "@/types";
import dayjs, { Dayjs } from "dayjs";
import { useDrag, useDrop } from "react-dnd";

interface CalendarDayProps {
  day: dayjs.Dayjs;
  events: Event[];
  isSelected: boolean;
  isToday: boolean;
  onSelect: () => void;
  onMoveEvent: (day: Dayjs, eventId: string) => void;
  currentMonth: dayjs.Dayjs;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  events,
  isSelected,
  isToday,
  onSelect,
  onMoveEvent,
  currentMonth,
}) => {

  // Using react-dnd to implement the rescheduling functionality by dropping the event.
  const [{ isOver }, drop] = useDrop({
    accept: "EVENT",
    drop: (item: { id: string }) => {
      onMoveEvent(day, item.id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const isSameMonth = day.month() === dayjs(currentMonth).month();

  const className = `p-1 md:p-2 border rounded-lg cursor-pointer min-h-[60px] md:min-h-[100px] transition-colors duration-200 ${
    isSelected ? "bg-blue-100 border-blue-500" : ""
  } ${isToday ? "border-blue-500 border-2" : ""} ${
    isOver ? "bg-green-100" : ""
  } ${isSameMonth ? "" : "text-gray-400 bg-gray-50"} hover:bg-gray-100`;

  return (
    <div ref={drop} className={className} onClick={onSelect}>
      <div className="text-right font-medium text-xs md:text-sm">
        {day.date()}
      </div>
      <div className="mt-1 space-y-1">
        {events.slice(0, window.innerWidth < 640 ? 1 : 3).map((event) => (
          <DraggableEvent key={event.id} event={event} />
        ))}
        {events.length > (window.innerWidth < 640 ? 1 : 3) && (
          <div className="text-xs text-gray-500 font-medium">
            +{events.length - (window.innerWidth < 640 ? 1 : 3)} more
          </div>
        )}
      </div>
    </div>
  );
};

interface DraggableEventProps {
  event: Event;
}

const DraggableEvent: React.FC<DraggableEventProps> = ({ event }) => {
// Using react-dnd to implement the rescheduling functionality by dragging the event.
  const [{ isDragging }, drag] = useDrag({
    type: "EVENT",
    item: { id: event.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const className = `text-xs md:text-sm p-0.5 md:p-1 rounded truncate ${
    event.type === "personal"
      ? "bg-green-200 text-green-800"
      : event.type === "work"
      ? "bg-red-200 text-red-800"
      : event.type === "other"
      ? "bg-yellow-200 text-yellow-800"
      : "bg-gray-200 text-gray-800"
  } ${isDragging ? "opacity-50" : ""}`;

  return (
    <div ref={drag} className={className}>
      {event.title}
    </div>
  );
};

export default CalendarDay;
