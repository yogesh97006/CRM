import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from "react";
import Widget from "../components/Widget";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Modal, Button } from "react-bootstrap";
import { ModalHeader } from "react-bootstrap";
import { fetchTicket, ticketUpdation } from "../api/Tickets";

function Engineer() {
  const Columns = [
    {
      title: "ID",
      field: "id",
    },
    {
      title: "TITLE",
      field: "title",
    },
    {
      title: "REPORTER",
      field: "reporter",
    },
    {
      title: "DESCRIPTION",
      field: "description",
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

  const [TicketUpdationModal, setTicketUpdationModal] = useState(false);
  const [TicketDetails, setTicketDetails] = useState([]);
  const [TicketStatusCount, setTicketStatusCount] = useState({});
  const [Message, setMessage] = useState("");
  const [SelectedCurrTicket, setSelectedCurrTicket] = useState({});

  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);
  const closeTicketUpdationModal = () => setTicketUpdationModal(false);

  useEffect(() => {
    (async () => {
      fetchTickets();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTickets = () => {
    fetchTicket()
      .then(function (res) {
        setTicketDetails(res.data);
        updateTicketCount(res.data);
      })
      .catch(function (error) {
        setMessage(error.response.data.Message);
      });
  };

  const updateTicketCount = (tickets) => {
    const data = {
      open: 0,
      closed: 0,
      pending: 0,
      blocked: 0,
    };
    tickets.forEach((ticket) => {
      if (ticket.status === "OPEN") data.open += 1;
      else if (ticket.status === "IN_PROGRESS") data.pending += 1;
      else if (ticket.status === "CLOSED") data.closed += 1;
      else if (ticket.status === "BLOCKED") data.blocked += 1;
    });
    setTicketStatusCount(Object.assign({}, data));
  };
  // console.log(TicketStatusCount)

  const editTicket = (TicketDetail) => {
    const Ticket = {
      id: TicketDetail.id,
      title: TicketDetail.title,
      description: TicketDetail.description,
      ticketPriority: TicketDetail.ticketPriority,
      reporter: TicketDetail.reporter,
      assignee: TicketDetail.assignee,
      status: TicketDetail.status,
    };
    setSelectedCurrTicket(Ticket);
    setTicketUpdationModal(true);
  };
  const onTicketUpdate = (e) => {
    if (e.target.name === "priority")
      SelectedCurrTicket.ticketPriority = e.target.value;
    else if (e.target.name === "description")
      SelectedCurrTicket.description = e.target.value;
    else if (e.target.name === "status")
      SelectedCurrTicket.status = e.target.value;
    updateSelectedCurrTicket(Object.assign({}, SelectedCurrTicket));
  };

  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(SelectedCurrTicket.id, SelectedCurrTicket)
      .then(function (res) {
        setMessage("Ticket Updated Successfully!");
        fetchTickets();
        closeTicketUpdationModal();
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  };
  return (
    <div>
      <Sidebar />
      <div className="container p-5">
        <h3 className="text-center" style={{ color: "#3da5d9" }}>
          Welcome, {localStorage.getItem('name')}!
        </h3>
        <p className="lead text-muted text-center">
          Take a quick look at your engineer state below{" "}
        </p>
        <div className="row  ">
          <Widget
            color="#7b2cbf"
            title="OPEN"
            icon="envelope-open"
            ticketCount={TicketStatusCount.open}
          />
          <Widget
            color="#ef233c"
            title="PROGRESS"
            icon="hourglass-split"
            ticketCount={TicketStatusCount.pending}
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
        <h5 className="text-center text-info">{Message}</h5>
        <MaterialTable
          onRowClick={(event, rowData) => editTicket(rowData)}
          data={TicketDetails}
          columns={Columns}
          title="TICKET ASSIGNED TO YOU"
          options={{
            filtering: true,
            exportMenu: [
              {
                label: "Export Pdf",
                exportFunc: (cols, data) =>
                  ExportPdf(cols, data, "Ticket Records"),
              },
              {
                label: "Export Csv",
                exportFunc: (cols, data) =>
                  ExportCsv(cols, data, "Ticket Records"),
              },
            ],
            headerStyle: {
              backgroundColor: "#5bc0eb",
              color: "#fff",
            },
          }}
        />

        {TicketUpdationModal ? (
          <Modal
            show={TicketUpdationModal}
            onHide={() => setTicketUpdationModal(false)}
            backdrop="static"
            centered
          >
            <ModalHeader closeButton>
              <Modal.Title>UPDATE TICKET</Modal.Title>
            </ModalHeader>
            <Modal.Body>
              <form onSubmit={updateTicket}>
                <div className="p-1">
                  <h5 className="text-info">ID:{SelectedCurrTicket.id}</h5>
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    TITLE
                  </label>
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    value={SelectedCurrTicket.title}
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    REPORTER
                  </label>
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    value={SelectedCurrTicket.reporter}
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
                    onChange={onTicketUpdate}
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
                    value={SelectedCurrTicket.ticketPriority}
                    onChange={onTicketUpdate}
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
                    onChange={onTicketUpdate}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => closeTicketUpdationModal}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" className="m-1" type="submit">
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

export default Engineer;
