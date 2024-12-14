export interface Event {
    id: string;
    title: string;
    start: string;
    end: string;
    description?: string;
    type: 'default' | 'personal' | 'work' | 'other';
  }
  
  export interface EventsState {
    [date: string]: Event[];
  }
  
  export type EventsByDate = {
    [date: string]: Event[]; // Events grouped by date (e.g., "2024-12-17": [Event, Event])
  };
  