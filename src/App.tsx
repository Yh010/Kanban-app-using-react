import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./components/Card";
import Modal from "react-modal";
import ReactDropdownSelect from "react-dropdown-select";

interface Ticket {
  id: string;
  title: string;
  status: string;
  userId: string;
  priority: number;
  favicon: string;
}

interface User {
  id: string;
  name: string;
  available: boolean;
}

interface DropdownOption {
  label: string;
  value: string;
}

const AppContainer = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #eeeded; /* Set the background color to grey */
`;

const Navbar = styled.div`
  display: flex;
  justify-content: flex-start; /* Align items to the left */
  align-items: center; /* Align items vertically centered */
  background-color: #fff; /* White background for the Navbar */
  padding: 10px;
  margin-bottom: 10px;
  height: 60px;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

Modal.setAppElement("#root");

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [newTicketPriority, setNewTicketPriority] = useState<number>(0);
  const [newTicketUser, setNewTicketUser] = useState<User | null>(null);
  const [sortOption, setSortOption] = useState<string>(""); // Default: no sorting
  const [sortOrder, setSortOrder] = useState<string>("asc"); // Default: ascending
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch data from the API
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => response.json())
      .then((data) => {
        const ticketsWithFavicons = data.tickets.map((ticket: Ticket) => ({
          ...ticket,
          favicon: "URL_TO_FAVICON", // Replace with the actual URL
        }));

        setTickets(ticketsWithFavicons);
        setUsers(data.users);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleModalOpen = (
    user: User | null,
    status: string,
    priority: number
  ) => {
    setIsModalOpen(true);
    setNewTicketUser(user);
    setSelectedOption(status);
    setNewTicketPriority(priority);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewTicketTitle("");
    setNewTicketPriority(0);
    setNewTicketUser(null);
  };

  const handleNewTicketSubmit = () => {
    const newTicket: Ticket = {
      id: "NEW-ID",
      title: newTicketTitle,
      status: selectedOption,
      userId: newTicketUser ? newTicketUser.id : "",
      priority: newTicketPriority,
      favicon: "",
    };

    setTickets([...tickets, newTicket]);

    setIsModalOpen(false);
    setNewTicketTitle("");
    setNewTicketPriority(0);
    setNewTicketUser(null);
  };

  const getColumnOptions = () => {
    if (selectedOption === "status") {
      return ["Backlog", "Todo", "In Progress", "Done", "Cancelled"];
    } else if (selectedOption === "user") {
      return users.map((user) => user.name);
    } else if (selectedOption === "priority") {
      return ["No Priority", "Urgent", "High", "Medium", "Low"];
    }
    return [];
  };

  const DisplayButton = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    background-color: #ff0000; /* Set the background color to red */
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
      background-color: red; /* Darker red for hover effect */
    }
  `;

  const DropdownContent = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    width: 250px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1;
    display: none;

    ${DisplayButton}:hover & {
      display: block;
    }
  `;

  const SubDropdown = styled.div`
    padding: 10px;
    border-bottom: 1px solid #ccc;

    &:last-child {
      border-bottom: none;
    }

    a {
      display: block;
      padding: 5px 0;
      text-decoration: none;
      color: #333;
      font-size: 14px;

      &:hover {
        color: #007bff;
      }
    }
  `;
  const DropdownButton = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    background-color: #ff0000;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
      background-color: #e00000;
    }
  `;

  return (
    <AppContainer>
      <Navbar>
        <h1>Kanban Board</h1>
        <div className="dropdown"></div>
      </Navbar>

      <button className="dropdown-button">
        Display
        <div className="dropdown-content">
          <div className="sub-dropdown">
            <span></span>
            <ReactDropdownSelect<DropdownOption>
              placeholder="Select Grouping"
              options={[
                { label: "Status", value: "status" },
                { label: "User", value: "user" },
                { label: "Priority", value: "priority" },
              ]}
              values={[]} // Provide an empty array for values
              onChange={(values: DropdownOption[]) => {
                if (values.length > 0) {
                  setSelectedOption(values[0].value);
                }
              }}
            />
          </div>

          <div className="sub-dropdown">
            <span>Sort By:</span>
            <ReactDropdownSelect<DropdownOption>
              placeholder="Sort By"
              options={[
                { label: "Priority", value: "priority" },
                { label: "Title", value: "title" },
              ]}
              values={[]} // Provide an empty array for values
              onChange={(values: DropdownOption[]) => {
                if (values.length > 0) {
                  setSortOption(values[0].value);
                }
              }}
            />
            {sortOption && (
              <button
                className="sort-button"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            )}
          </div>
        </div>
      </button>
      <div className="columns-container" style={{ display: "flex" }}>
        <div className="row" style={{ display: "flex" }}>
          {getColumnOptions().map((columnName) => (
            <div className="column" key={columnName}>
              <h3>
                {columnName}{" "}
                <button
                  className="add-button"
                  onClick={() => handleModalOpen(null, "status", 0)}
                >
                  +
                </button>
              </h3>
              {tickets
                .filter((ticket) => {
                  if (selectedOption === "status") {
                    return (
                      ticket.status.toLowerCase() === columnName.toLowerCase()
                    );
                  } else if (selectedOption === "user") {
                    const user = users.find(
                      (user) => user.id === ticket.userId
                    );
                    return user && user.name === columnName;
                  } else if (selectedOption === "priority") {
                    const priorityMap = [
                      "No Priority",
                      "Urgent",
                      "High",
                      "Medium",
                      "Low",
                    ];
                    return priorityMap[ticket.priority] === columnName;
                  }
                  return false;
                })
                .sort((a, b) => {
                  if (sortOption === "priority") {
                    return sortOrder === "asc"
                      ? a.priority - b.priority
                      : b.priority - a.priority;
                  } else if (sortOption === "title") {
                    return sortOrder === "asc"
                      ? a.title.localeCompare(b.title)
                      : b.title.localeCompare(a.title);
                  }
                  return 0;
                })
                .map((filteredTicket) => {
                  const user = users.find(
                    (user) => user.id === filteredTicket.userId
                  );
                  return (
                    <Card
                      key={filteredTicket.id}
                      ticket={filteredTicket}
                      user={user}
                    />
                  );
                })}
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Add New Ticket"
        className="modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <ModalContainer>
          <h2>Add New Ticket</h2>
          <input
            type="text"
            value={newTicketTitle}
            onChange={(e) => setNewTicketTitle(e.target.value)}
            placeholder="Enter ticket title"
          />
          {selectedOption !== "user" && (
            <>
              <label>Status:</label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="Backlog">Backlog</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <label>Priority:</label>
              <select
                value={newTicketPriority}
                onChange={(e) => setNewTicketPriority(Number(e.target.value))}
              >
                <option value={0}>No Priority</option>
                <option value={1}>Urgent</option>
                <option value={2}>High</option>
                <option value={3}>Medium</option>
                <option value={4}>Low</option>
              </select>
            </>
          )}
          {selectedOption === "user" && (
            <>
              <label>Title:</label>
              <input
                type="text"
                value={newTicketTitle}
                onChange={(e) => setNewTicketTitle(e.target.value)}
                placeholder="Enter user name"
              />
              <label>Status:</label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="Backlog">Backlog</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <label>Priority:</label>
              <select
                value={newTicketPriority}
                onChange={(e) => setNewTicketPriority(Number(e.target.value))}
              >
                <option value={0}>No Priority</option>
                <option value={1}>Urgent</option>
                <option value={2}>High</option>
                <option value={3}>Medium</option>
                <option value={4}>Low</option>
              </select>
            </>
          )}
          <button onClick={handleNewTicketSubmit}>Submit</button>
          <button onClick={handleModalClose}>Cancel</button>
        </ModalContainer>
      </Modal>
    </AppContainer>
  );
}

export default App;
