import React, { useState } from "react";
import MaterialTable from "@material-table/core";
import Sidebar from "../components/Sidebar";
import Widget from "../components/Widget";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { useEffect } from "react";
import { fetchTicket, ticketUpdation } from "../api/Tickets";
import { getAllUser, userUpdation } from "../api/user";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";

// const lookup = { true: "Available", false: "Unavailable" };

const columns = [
  { title: "ID", field: "id" },
  { title: "TITLE", field: "title" },
  { title: "DESCRIPTION", field: "description" },
  { title: "REPORTER", field: "reporter" },
  { title: "ASSIGNEE", field: "assignee" },
  { title: "PRIORITY", field: "ticketPriority" },
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

const usercolumns = [
  { title: "ID", field: "userId" },
  { title: "NAME", field: "name" },
  { title: "EMAIL", field: "email" },
  { title: "ROLE", field: "userTypes" },
  {
    title: "STATUS",
    field: "userStatus",
    lookup: {
      APPROVED: "APPROVED",
      REJECTED: "REJECTED",
      PENDING: "PENDING",
    },
  },
];

function Admin() {
  const [TicketDetails, setTicketDetails] = useState([]);
  const [TicketStatusCount, setTicketStatusCount] = useState({});
  const [TicketUpdationModal, setTicketUpdationModal] = useState(false);
  const [SelectedCurrTicket, setSelectedCurrTicket] = useState({});
  const [Message, setMessage] = useState("");
  const [userList, setUserList] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [UserUpdationModal, setUserUpdationModal] = useState(false);

  const closeTicketUpdationModal = () => setTicketUpdationModal(false);
  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);
  const showUserModal = () => setUserUpdationModal(true);
  const closeUserModal = () => {
    setUserUpdationModal(false);
    setUserDetails({});
  };
  useEffect(() => {
    (async () => {
      fetchTickets();
      fetchUsers("");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTickets = () => {
    fetchTicket()
      .then(function (response) {
        setTicketDetails(response.data);
        updateTicketCount(response.data);
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  };
  const fetchUsers = (userId) => {
    getAllUser(userId)
      .then(function (response) {
        if (response.status === 200) {
          if (userId) {
            setUserDetails(response.data[0]);
            showUserModal();
          } else setUserList(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
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

  const editTicket = (ticketDetails) => {
    const ticket = {
      assignee: ticketDetails.assignee,
      description: ticketDetails.description,
      title: ticketDetails.title,
      id: ticketDetails.id,
      reporter: ticketDetails.reporter,
      status: ticketDetails.status,
      priority: ticketDetails.ticketPriority,
    };
    setTicketUpdationModal(true);
    setSelectedCurrTicket(ticket);
  };
  const onTicketUpdate = (e) => {
    if (e.target.name === "ticketPriority")
      SelectedCurrTicket.ticketPriority = e.target.value;
    else if (e.target.name === "status")
      SelectedCurrTicket.status = e.target.value;
    else if (e.target.name === "description")
      SelectedCurrTicket.description = e.target.value;
    updateSelectedCurrTicket(Object.assign({}, SelectedCurrTicket));
    // console.log(SelectedCurrTicket);
  };
  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(SelectedCurrTicket.id, SelectedCurrTicket)
      .then(function (response) {
        console.log(response);
        setTicketUpdationModal(false);
        fetchTickets();
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  };
  const updateUserDetail = () => {
    const data = {
      userType: userDetails.userTypes,
      userStatus: userDetails.userStatus,
      userName: userDetails.name,
    };
    userUpdation(userDetails.userId, data)
      .then(function (response) {
        if (response.status === 200) {
          setMessage(response.message);
          let idx = userList.findIndex(
            (obj) => obj.userId === userDetails.userId
          );
          userList[idx] = userDetails;
          closeUserModal();
          setMessage("user detail update successfully");
        }
      })
      .catch(function (error) {
        if (error.status === 400) setMessage(error.message);
        else console.log(error);
      });
  };

  const changeUserDetail = (e) => {
    if (e.target.name === "status") userDetails.userStatus = e.target.value;
    else if (e.target.name === "name") userDetails.name = e.target.value;
    else if (e.target.name === "type") userDetails.userTypes = e.target.value;
    setUserDetails(userDetails);
    setUserUpdationModal(e.target.value);
  };
  return (
    <div>
      <div>
        <Sidebar />
        <div className="container p-5">
          <h3 className="text-center" style={{ color: "#ff0054" }}>
            Welcome, {localStorage.getItem("name")}!
          </h3>
          <p className="text-muted text-center">
            Take a quick look at your admin stats below
          </p>
          <div className="row">
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
        </div>
        <h5 className="text-primary text-center">{Message}</h5>
        <div className="container">
          <MaterialTable
            onRowClick={(event, rowData) => editTicket(rowData)}
            title="TICKET"
            columns={columns}
            data={TicketDetails}
            options={{
              filtering: true,
              headerStyle: {
                backgroundColor: "#ff0054",
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
          <br />

          {TicketUpdationModal ? (
            <Modal
              show={TicketUpdationModal}
              onHide={closeTicketUpdationModal}
              backdrop="static"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Update Ticket</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={updateTicket}>
                  <div className="p-1">
                    <h5 className="card-subtitle mb-2 text-danger ">
                      User ID:{SelectedCurrTicket.id}
                    </h5>
                  </div>
                  <div className="input-group mb-2">
                    <label className="label input-group-text label-md">
                      Title
                    </label>
                    <input
                      type="text"
                      disabled
                      value={SelectedCurrTicket.title}
                      className="form-control"
                    />
                  </div>
                  <div className="input-group mb-2">
                    <label className="label input-group-text label-md">
                      Reporter
                    </label>
                    <input
                      type="text"
                      disabled
                      value={SelectedCurrTicket.reporter}
                      className="form-control"
                    />
                  </div>
                  <div className="input-group mb-2">
                    <label className="label input-group-text label-md">
                      Assignee
                    </label>
                    <select className="form-control" name="assignee">
                      <option>Yogesh</option>
                    </select>
                  </div>
                  <div className="input-group mb-2">
                    <label className="label input-group-text label-md">
                      Priority
                    </label>
                    <input
                      type="text"
                      value={SelectedCurrTicket.priority}
                      name="ticketPriority"
                      onChange={onTicketUpdate}
                      className="form-control"
                    />
                  </div>
                  <div className="input-group mb-2">
                    <label className="label input-group-text label-md">
                      Status
                    </label>
                    <select
                      className="form-control"
                      onChange={onTicketUpdate}
                      value={SelectedCurrTicket.status}
                      name="status"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="CLOSED">CLOSED</option>
                      <option value="BLOCKED">BLOCKED</option>
                    </select>
                  </div>
                  <div className="input-group mb-2">
                    <label className="label input-group-text label-md">
                      DESCRIPTION
                    </label>
                    <textarea
                      type="text"
                      value={SelectedCurrTicket.description}
                      onChange={onTicketUpdate}
                      className="md-textarea form-control"
                      row="3"
                      name="description"
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="secondary"
                      className="m-1"
                      onClick={() => closeTicketUpdationModal}
                    >
                      Cancal
                    </Button>
                    <Button variant="danger" className="m-1" type="submit">
                      Update
                    </Button>
                  </div>
                </form>
              </Modal.Body>
            </Modal>
          ) : null}

          <MaterialTable
            onRowClick={(event, rowData) => fetchUsers(rowData.userId)}
            title="USER TICKET"
            columns={usercolumns}
            data={userList}
            options={{
              filtering: true,
              headerStyle: {
                backgroundColor: "#ff0054",
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
          {UserUpdationModal ? (
            <Modal
              show={UserUpdationModal}
              onHide={closeUserModal}
              backdrop="static"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Update Ticket</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={updateUserDetail}>
                  <div className="p-1">
                    <h5 className="card-subtitle mb-2 text-danger ">
                      User ID:{userDetails.userId}
                    </h5>
                  </div>
                  <div className="input-group mb-2">
                    <label className="label input-group-text label-md">
                      NAME
                    </label>
                    <input
                      type="text"
                      disabled
                      value={userDetails.name}
                      className="form-control"
                    />
                  </div>
                  <div className="input-group mb-2">
                    <label className="label input-group-text label-md">
                      Email
                    </label>
                    <input
                      type="text"
                      disabled
                      value={userDetails.email}
                      className="form-control"
                    />
                  </div>
                  <div className="input-group mb-2">
                    <label className="label input-group-text label-md">
                      ROLE
                    </label>
                    <select
                      type="text"
                      value={userDetails.userTypes}
                      onChange={changeUserDetail}
                      name="type"
                      className="form-control"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="ENGINEER">ENGINEER</option>
                    </select>
                  </div>
                  <div className="input-group mb-2">
                    <label className="label input-group-text label-md">
                      Status
                    </label>
                    <select
                      className="form-control"
                      onChange={changeUserDetail}
                      value={userDetails.userStatus}
                      name="status"
                    >
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                    <Button
                      variant="secondary"
                      className="m-1"
                      onClick={() => closeUserModal()}
                    >
                      Cancal
                    </Button>
                    <Button
                      variant="danger"
                      className="m-1"
                      onClick={() => updateUserDetail()}
                    >
                      Update
                    </Button>
                  </div>
                </form>
              </Modal.Body>
            </Modal>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Admin;
