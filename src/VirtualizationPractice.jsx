import { List } from "react-window";

const users = Array.from({ length: 10000 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
}));

function UserRow({ index, style }) {
  const user = users[index];

  return (
    <div style={style}>
      <strong>{user.name}</strong>
      <p>{user.email}</p>
    </div>
  );
}

export default function VirtualizationPractice() {
  return (
    <List
      rowComponent={UserRow}
      rowCount={users.length}
      rowHeight={60}
      rowProps={{}}
      style={{ height: 400, width: "100%" }}
    />
  );
}