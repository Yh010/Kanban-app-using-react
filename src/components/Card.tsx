import React from "react";
import styled from "styled-components";

interface Ticket {
  id: string;
  title: string;
  status: string;
  userId: string;
  priority: number;
}

interface User {
  id: string;
  name: string;
  available: boolean;
}

interface CardProps {
  ticket: Ticket;
  user: User | undefined;
}

const CardContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  font-size: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CardContent = styled.div`
  font-size: 10px;
  color: #333;

  p {
    margin: 4px 0;
  }
`;
const getPriorityText = (priority: number) => {
  switch (priority) {
    case 4:
      return "Urgent";
    case 3:
      return "High";
    case 2:
      return "Medium";
    case 1:
      return "Low";
    default:
      return "No priority";
  }
};

const getPriorityFavicon = (priority: number) => {
  switch (priority) {
    case 4:
      return "../../assets/urgent.png";
    case 3:
      return "../../assets/high.png";
    case 2:
      return "../../assets/medium.png";
    case 1:
      return "../../assets/low.png";
    default:
      return "../../assets/default-favicon.png";
  }
};

const Card: React.FC<CardProps> = ({ ticket, user }) => {
  const getFaviconImage = (status: string) => {
    switch (status.toLowerCase()) {
      case "backlog":
        return "../../assets/backlog.png";
      case "todo":
        return "../../assets/to-do-list.png";
      case "in progress":
        return "../../assets/progress.png";
      case "done":
        return "../../assets/correct.png";
      case "cancelled":
        return "../../assets/cancel.png";
      default:
        return "../../assets/default-favicon.png";
    }
  };

  const faviconImage = getFaviconImage(ticket.status);
  const priorityText = getPriorityText(ticket.priority);
  const priorityFavicon = getPriorityFavicon(ticket.priority);
  return (
    <CardContainer>
      <CardHeader>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={faviconImage}
            alt="Favicon"
            style={{ marginRight: "8px" }}
          />
          <h3>{ticket.title}</h3>
        </div>
        <div style={{ marginLeft: "8px", display: "flex" }}>
          {user && <p> {user.name}</p>}
        </div>
      </CardHeader>
      <CardContent>
        <p>{ticket.status}</p>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={priorityFavicon}
            alt={`Priority: ${priorityText}`}
            style={{ marginRight: "4px" }}
          />
          Priority: {priorityText}
        </div>
      </CardContent>
    </CardContainer>
  );
};

export default Card;
