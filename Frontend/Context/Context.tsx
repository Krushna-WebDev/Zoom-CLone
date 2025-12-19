import axios from "axios";
import { createContext, useEffect, useState } from "react";
interface User {
  _id: string;
  name: string;
  email: string;
  profilePic: string;
}

interface UserContextInterface {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  joinType: string;
  setJoinType: React.Dispatch<React.SetStateAction<string>>;
}

export const UserContext = createContext<UserContextInterface | null>(null);
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [joinType, setJoinType] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/auth/getuser",
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data.user);
      } catch (error: any) {
        const status = error?.response?.status;
        if (status === 403) {
          try {
            const refreshRes = await axios.get(
              "http://localhost:5000/api/v1/auth/refresh",
              {
                withCredentials: true,
              }
            );
            const newToken = refreshRes.data.accessToken;
            localStorage.setItem("token", newToken);
            setToken(newToken);
          } catch (refreshError) {
            console.error("Refresh failed:", refreshError);
          }
        } else {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchUser();
  }, [token]);
  return (
    <UserContext.Provider
      value={{ user, setUser, token, setToken, joinType, setJoinType }}
    >
      {children}
    </UserContext.Provider>
  );
};
