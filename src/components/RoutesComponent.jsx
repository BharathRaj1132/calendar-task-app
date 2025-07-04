import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import CalendarComponent from "./CalendarComponent";
import CompletedTasks from "./CompletedTasks";

export default function RoutesComponent() {
  const [events, setEvents] = useState([]);

  return (
    <Routes>
      <Route path="/" element={<CalendarComponent events={events} setEvents={setEvents} />} />
      <Route path="/completed" element={<CompletedTasks events={events} />} />
    </Routes>
  );
}
