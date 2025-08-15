import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from "./UserContext.js";

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      axios.get('/api/profile').then(({ data }) => {
        setUser(data);
      }).finally(() => {
        setReady(true);
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}