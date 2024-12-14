import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import dayjs from "dayjs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "../types";

interface EventSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: dayjs.Dayjs;
  events: Event[];
  onAddEvent: (event: Omit<Event, "id">) => void;
  onEditEvent: (eventId: string, event: Omit<Event, "id">) => void;
  onDeleteEvent: (eventId: string) => void;
}

const EventSheet: React.FC<EventSheetProps> = ({
  isOpen,
  onClose,
  selectedDate,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    title: "",
    start: "",
    end: "",
    description: "",
    type: "default",
  });

  useEffect(() => {
    setNewEvent({
      title: "",
      start: "",
      end: "",
      description: "",
      type: "default",
    });
    setEditingEvent(null);
  }, [selectedDate]);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEvent = () => {
    const defaultDate = dayjs().format("YYYY-MM-DD");
    const startDateTime = dayjs(`${defaultDate}T${newEvent.start}`);
    const endDateTime = dayjs(`${defaultDate}T${newEvent.end}`);

    if (newEvent.title && newEvent.start && newEvent.end) {
      // Checking if the ending timing of an event is before than the starting time;
      if (endDateTime.isBefore(startDateTime)) {
        alert("End time cannot be before start time");
        return;
      }

      // Checking overlapping event i.e if 2 two events collide in timings
      const overlappingEvent = events.find((event) => {
        const eventStartDateTime = dayjs(`${defaultDate}T${event.start}`);
        const eventEndDateTime = dayjs(`${defaultDate}T${event.end}`);

        return (
          ((startDateTime.isAfter(eventStartDateTime) &&
            startDateTime.isBefore(eventEndDateTime)) ||
            (endDateTime.isAfter(eventStartDateTime) &&
              endDateTime.isBefore(eventEndDateTime)) ||
            (startDateTime.isBefore(eventStartDateTime) &&
              endDateTime.isAfter(eventEndDateTime))) &&
          (!editingEvent || event.id !== editingEvent.id)
        );
      });

      if (overlappingEvent) {
        alert("This event overlaps with an existing event");
        return;
      }

      if (editingEvent) {
        onEditEvent(editingEvent.id, newEvent);
      } else {
        onAddEvent(newEvent);
      }

      setNewEvent({
        title: "",
        start: "",
        end: "",
        description: "",
        type: "default",
      });
      setEditingEvent(null);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-semibold">
            {selectedDate.format("MMMM D, YYYY")}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingEvent ? "Edit Event" : "Add New Event"}
            </h3>
            <div className="space-y-4">
              <Input
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
              <div className="flex space-x-2">
                <Input
                  type="time"
                  value={newEvent.start}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, start: e.target.value })
                  }
                />
                <Input
                  type="time"
                  value={newEvent.end}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, end: e.target.value })
                  }
                />
              </div>
              <Textarea
                placeholder="Event Description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
              <Select
                value={newEvent.type}
                onValueChange={(value) =>
                  setNewEvent({ ...newEvent, type: value as Event["type"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddEvent} className="w-full">
                {editingEvent ? "Update Event" : "Add Event"}
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pt-8">
            {filteredEvents.map((event) => (
              <EventItem
                key={event.id}
                event={event}
                onEdit={() => {
                  setEditingEvent(event);
                  setNewEvent(event);
                }}
                onDelete={() => onDeleteEvent(event.id)}
              />
            ))}
          </div>
          <div className="pb-10"></div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface EventItemProps {
  event: Event;
  onEdit: (id: string, event: Event) => void;
  onDelete: () => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "EVENT",
    item: { id: event.id, originalStart: event.start, originalEnd: event.end },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 border rounded-lg ${
        event.type === "personal"
          ? "bg-green-100 border-green-300"
          : event.type === "work"
          ? "bg-red-100 border-red-300"
          : event.type === "other"
          ? "bg-yellow-100 border-yellow-300"
          : "bg-gray-100 border-gray-300"
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <h4 className="font-semibold text-2xl mb-1">{event.title}</h4>
      <p className="text-base text-gray-600 mb-1">
        {event.start} - {event.end}
      </p>
      <p className="text-base mb-2">{event.description}</p>
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(event.id, event)}
        >
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default EventSheet;
