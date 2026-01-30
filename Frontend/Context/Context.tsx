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
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  isCaller: string;
  setIsCaller: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextInterface | null>(null);
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isCaller, setIsCaller] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        // If no token try to refresh first
        if (!token) {
          try {
            const refreshRes = await axios.get(
              "http://localhost:5000/api/v1/auth/refresh",
              { withCredentials: true },
            );
            if (refreshRes?.data?.accessToken) {
              setToken(refreshRes.data.accessToken);
              return;
            }
          } catch (refreshError) {
            console.error("Refresh failed:", refreshError);
            setIsLoading(false);
            return;
          }
        }

        // Only include Authorization header if token exists
        const res = await axios.get(
          "http://localhost:5000/api/v1/auth/getuser",
          {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          },
        );
        setUser(res.data.user);
      } catch (error: any) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        isCaller,
        setIsCaller,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
