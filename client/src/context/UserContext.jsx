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
      }).catch(err => {
        // This catch block handles the 401 error gracefully
        // when a user is not logged in.
        console.log("Not logged in or session expired.");
      }).finally(() => {
        setReady(true);
      });
    } else {
        setReady(true);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}