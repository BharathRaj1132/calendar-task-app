import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
let id = 0;

export default function CalendarComponent({ events, setEvents }) {
  const [modalShow, setModalShow] = useState(false);
  const [newTask, setNewTask] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filter, setFilter] = useState({ company: "", activity: "" });
  const [viewDate, setViewDate] = useState(new Date());
  const [view, setView] = useState("month");

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setNewTask({});
    setModalShow(true);
  };

  const handleSubmit = () => {
    const task = {
      id: ++id,
      title: `${newTask.company || ""} - ${newTask.activity || ""}`,
      ...newTask,
      start: selectedSlot.start,
      end: selectedSlot.end,
      status: "open",
    };
    setEvents((prev) => [...prev, task]);
    setModalShow(false);
  };

  const copyTask = (task) => {
    setNewTask({
      company: task.company,
      activity: task.activity,
      description: task.description,
    });
    setSelectedSlot({ start: new Date(), end: new Date() });
    setModalShow(true);
  };

  const completeTask = (id) => {
    const updated = events.map((e) =>
      e.id === id ? { ...e, status: "closed" } : e
    );
    setEvents(updated);
  };

  const filteredEvents = events.filter(
    (e) =>
      (!filter.company || e.company === filter.company) &&
      (!filter.activity || e.activity === filter.activity)
  );

  const eventPropGetter = (event) =>
    event.status === "closed"
      ? { style: { border: "4px solid green" } }
      : {};

  return (
    <div className="container mt-4">
      <h3>Task Scheduler</h3>
      <Form.Control
        placeholder="Filter by Company"
        value={filter.company}
        onChange={(e) => setFilter({ ...filter, company: e.target.value })}
        className="mb-2"
      />
      <Form.Control
        placeholder="Filter by Activity"
        value={filter.activity}
        onChange={(e) => setFilter({ ...filter, activity: e.target.value })}
        className="mb-3"
      />

      <div className="mb-3">
        <Button variant="secondary" onClick={() => setViewDate(new Date())}>
          Today
        </Button>{" "}
        <Button
          variant="secondary"
          onClick={() =>
            setViewDate(moment(viewDate).subtract(1, "month").toDate())
          }
        >
          Back
        </Button>{" "}
        <Button
          variant="secondary"
          onClick={() =>
            setViewDate(moment(viewDate).add(1, "month").toDate())
          }
        >
          Next
        </Button>{" "}
        <Button
          variant={view === "month" ? "primary" : "outline-primary"}
          onClick={() => setView("month")}
        >
          Month
        </Button>{" "}
        <Button
          variant={view === "week" ? "primary" : "outline-primary"}
          onClick={() => setView("week")}
        >
          Week
        </Button>{" "}
        <Button
          variant={view === "day" ? "primary" : "outline-primary"}
          onClick={() => setView("day")}
        >
          Day
        </Button>{" "}
        <Link to="/completed" className="btn btn-success ms-3">
          View Completed Tasks
        </Link>
      </div>

      <Calendar
        localizer={localizer}
        events={filteredEvents.map((e) => ({
          ...e,
          title: `${e.title} [${moment(e.end).diff(
            moment(e.start),
            "hours"
          ) || 1}h] - ID:${e.id}`,
        }))}
        startAccessor="start"
        endAccessor="end"
        selectable
        view={view}
        views={{ month: true, week: true, day: true }}
        date={viewDate}
        onNavigate={(date) => setViewDate(date)}
        onView={(view) => setView(view)}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(e) => copyTask(e)}
        style={{ height: 600 }}
        eventPropGetter={eventPropGetter}
      />

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                value={newTask.company || ""}
                onChange={(e) =>
                  setNewTask({ ...newTask, company: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Activity Type</Form.Label>
              <Form.Control
                type="text"
                value={newTask.activity || ""}
                onChange={(e) =>
                  setNewTask({ ...newTask, activity: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newTask.description || ""}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>Save Task</Button>
        </Modal.Footer>
      </Modal>

      <h5 className="mt-4">Complete Activities</h5>
      {events.map(
        (e) =>
          e.status === "open" && (
            <div key={e.id} className="mb-2">
              {e.title} [ID: {e.id}]
              <Button
                size="sm"
                className="ms-2"
                onClick={() => completeTask(e.id)}
              >
                Complete
              </Button>
            </div>
          )
      )}
    </div>
  );
}
