
import { use } from 'react';

function UseHookDemo({ usersPromise }) {
  const users = use(usersPromise);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UseHookDemo;
