import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Link } from "react-router-dom";

const localizer = momentLocalizer(moment);

export default function CompletedTasks({ events }) {
  const completedEvents = events.filter((e) => e.status === "closed");

  return (
    <div className="container mt-4">
      <h3>Completed Tasks</h3>
      <Calendar
        localizer={localizer}
        events={completedEvents.map((e) => ({
          ...e,
          title: `${e.title} [${moment(e.end).diff(
            moment(e.start),
            "hours"
          ) || 1}h] - ID:${e.id}`,
        }))}
        startAccessor="start"
        endAccessor="end"
        views={{ month: true, week: true, day: true }}
        style={{ height: 600 }}
        eventPropGetter={() => ({ style: { border: "4px solid green" } })}
      />
      <Link to="/" className="btn btn-primary mt-3">
        Back to Calendar
      </Link>
    </div>
  );
}
