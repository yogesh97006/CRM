import axios from "axios";

const BASE_URL = "https://ruby-crazy-bear.cyclic.app/"

export async function fetchTicket() {
  return await axios.get(
    `${BASE_URL}/crm/api/v1/tickets/`,
    {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    },
    {
      userId: localStorage.getItem("userId"),
    }
  );
}

export async function ticketCreation(data) {
  return await axios.post(`${BASE_URL}/crm/api/v1/tickets/`, data, {
    headers: {
      "x-access-token": localStorage.getItem("token"),
    },
  });
}

export async function ticketUpdation(id, SelectedCurrTicket) {
  return await axios.put(
    `${BASE_URL}/crm/api/v1/tickets/${id}`,
    SelectedCurrTicket,
    {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    },
    {
      userId: localStorage.getItem("userId"),
    }
  );
}
