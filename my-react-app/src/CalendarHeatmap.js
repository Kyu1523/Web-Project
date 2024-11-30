// src/CalendarHeatmap.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';  // Default styles for the calendar
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';  // Styles for the heatmap

const CalendarHeatmapComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Sample data: Replace with actual scrobble data
  const heatmapData = [
    { date: '2024-11-01', count: 10 },
    { date: '2024-11-02', count: 3 },
    { date: '2024-11-03', count: 7 },
    // Add more data for your days
  ];

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <h2>Music Heatmap Calendar</h2>
      <Calendar 
        onClickDay={handleDateClick}
        tileContent={({ date, view }) => {
          const dayData = heatmapData.find(data => data.date === date.toISOString().split('T')[0]);
          return dayData ? <div>{dayData.count} songs</div> : null;
        }}
      />
      
      {selectedDate && (
        <div>
          <h3>Details for {selectedDate.toDateString()}</h3>
          {/* Render the scrobble count or other statistics */}
          <p>Number of songs: {heatmapData.find(data => data.date === selectedDate.toISOString().split('T')[0])?.count}</p>
        </div>
      )}
    </div>
  );
};

export default CalendarHeatmapComponent;
