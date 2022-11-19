import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from "react";
import Widget from "../components/Widget";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { fetchTicket, ticketCreation, ticketUpdation } from "../api/Tickets";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const colum = [
  {
    title: "ID",
    field: "id",
  },
  {
    title: "TITLE",
    field: "title",
  },
  {
    title: "DESCRIPTION",
    field: "description",
  },
  {
    title: "ASSIGNEE",
    field: "assignee",
  },
  {
    title: "PRIORITY",
    field: "ticketPriority",
  },
  {
    title: "STATUS",
    field: "status",
    lookup: {
      OPEN: "OPEN",
      IN_PROGRESS: "IN_PROGRESS",
      CLOSED: "CLOSED",
      BLOCKED: "BLOCKED",
    },
  },
];

function Customer() {
  const [CreateTicketModal, setCreateTicketModal] = useState(false);
  const [Message, setMessage] = useState("");
  const [TicketStatusCount, setTicketStatusCount] = useState({});
  const [ticketDetail, setTicketDetail] = useState([]);
  const [SelectedCurrTicket, setSelectedCurrTicket] = useState({});
  const [ticketUpdationModal, setTicketUpdationModal] = useState(false);

  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);

  useEffect(() => {
    (async () => {
      fetchTickets();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();
  const logoutFn = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchTickets = () => {
    fetchTicket()
      .then(function (response) {
        setTicketDetail(response.data);
        updateTicketCount(response.data);
      })
      .catch(function (error) {
        setMessage(error.response.data.Message);
      });
  };

  const createTicket = (e) => {
    e.preventDefault();
    const data = {
      title: e.target.title.value,
      description: e.target.description.value,
    };
    ticketCreation(data)
      .then(function (response) {
        setMessage("Ticket Created Successfully");
        setCreateTicketModal(false);
        fetchTickets();
      })
      .catch(function (error) {
        if (error.response.status === 400) {
          setMessage(error.response.data.Message);
        } else if (error.response.status === 401) {
          logoutFn();
        } else {
          console.log(error);
        }
      });
  };

  const editTicket = (ticketDetail) => {
    const tickets = {
      assignee: ticketDetail.assignee,
      description: ticketDetail.description,
      title: ticketDetail.title,
      id: ticketDetail.id,
      reporter: ticketDetail.reporter,
      status: ticketDetail.status,
      priority: ticketDetail.ticketPriority,
    };
    setSelectedCurrTicket(tickets);
    setTicketUpdationModal(true);
  };

  const updateTicketCount = (tickets) => {
    const data = {
      open: 0,
      closed: 0,
      progress: 0,
      blocked: 0,
    };

    tickets.forEach((x) => {
      if (x.status === "OPEN") {
        data.open += 1;
      } else if (x.status === "CLOSED") {
        data.closed += 1;
      } else if (x.status === "IN_PROGRESS") {
        data.progress += 1;
      } else {
        data.blocked += 1;
      }
    });
    setTicketStatusCount(Object.assign({}, data));
  };

  const onTicketUpdation = (e) => {
    if (e.target.name === "description")
      SelectedCurrTicket.description = e.target.value;
    else if (e.target.name === "status")
      SelectedCurrTicket.status = e.target.value;
    updateSelectedCurrTicket(Object.assign({}, SelectedCurrTicket));
  };

  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(SelectedCurrTicket.id, SelectedCurrTicket)
      .then(function (response) {
        setMessage("ticket updated successfully");
        setTicketUpdationModal(false);
        fetchTickets();
      })
      .catch(function (error) {
        setMessage(error.response.data.Message);
      });
  };

  return (
    <div>
      <Sidebar />
      <div className="container p-5 ">
        <h3 className="text-center" style={{ color: "#1dd3b0" }}>
          Welcome,{localStorage.getItem("name")}!
        </h3>
        <p className="lead text-center">look at your raised ticket</p>
        <div className="row m-3">
          <Widget
            color="#7b2cbf"
            title="OPEN"
            icon="envelope-open"
            ticketCount={TicketStatusCount.open}
          />
          <Widget
            color="#ef233c"
            title="IN_PROGRESS"
            icon="hourglass-split"
            ticketCount={TicketStatusCount.progress}
          />
          <Widget
            color="#453750"
            title="CLOSED"
            icon="check2-circle"
            ticketCount={TicketStatusCount.closed}
          />
          <Widget
            color="#080f0f"
            title="BLOCKED"
            icon="slash-circle"
            ticketCount={TicketStatusCount.blocked}
          />
        </div>
        <br />
        <p className="lead text-success text-center">{Message}</p>
        <MaterialTable
          className="container"
          data={ticketDetail}
          onRowClick={(event, rowData) => editTicket(rowData)}
          title="TICKET RAISED BY YOU"
          columns={colum}
          options={{
            filtering: true,
            headerStyle: {
              backgroundColor: "#73fbd3",
              color: "#fff",
            },
            exportMenu: [
              {
                label: "Export Pdf",
                exportFunc: (cols, data) =>
                  ExportPdf(cols, data, "ticketRecords"),
              },
              {
                label: "Export Csv",
                exportFunc: (cols, data) =>
                  ExportCsv(cols, data, "ticketRecords"),
              },
            ],
          }}
        />
        <div className="p-5">
          <h4 className="text-center text-danger ">
            Facing any issues? Raise a ticket!
          </h4>
          <div className="d-flex justify-content-center align-items-center d-grid gap-2 col-6 mx-auto">
            <button
              className="rounded-2 btn btn-md "
              style={{ backgroundColor: "#5bc0eb" }}
              onClick={() => setCreateTicketModal(true)}
            >
              Raise Ticket
            </button>
          </div>
        </div>

        {CreateTicketModal ? (
          <Modal
            show={CreateTicketModal}
            centered
            backdrop="static"
            onHide={() => setCreateTicketModal(false)}
          >
            <Modal.Header closeButton>Create a new Ticket</Modal.Header>
            <Modal.Body>
              <form onSubmit={createTicket}>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    TITLE
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    required
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    DESCRIPTION
                  </label>
                  <textarea
                    type="text"
                    classname="md-textarea form-control"
                    row="3"
                    name="description"
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => setCreateTicketModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="m-1" type="submit" variant="primary">
                    CREATE
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}

        {ticketUpdationModal ? (
          <Modal
            show={ticketUpdationModal}
            centered
            backdrop="static"
            onHide={() => setTicketUpdationModal(false)}
          >
            <Modal.Header closeButton>Update the Ticket</Modal.Header>
            <Modal.Body>
              <form onSubmit={updateTicket}>
                <h5 className="card-subtitle lead text-success ">
                  ID :{SelectedCurrTicket.id}
                </h5>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    TITLE
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={SelectedCurrTicket.title}
                    disabled
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    ASSIGNEE
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="assignee"
                    value={SelectedCurrTicket.assignee}
                    disabled
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    PRIORITY
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="priority"
                    value={SelectedCurrTicket.priority}
                    disabled
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    DESCRIPTION
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={SelectedCurrTicket.description}
                    onChange={onTicketUpdation}
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    STATUS
                  </label>
                  <select
                    className="form-control"
                    name="status"
                    value={SelectedCurrTicket.status}
                    onChange={onTicketUpdation}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => setTicketUpdationModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="m-1" type="submit" variant="success">
                    Update
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}
      </div>
    </div>
  );
}

export default Customer;
