import axios from "axios";
import React, { useEffect } from "react";

const TestCookie = () => {
  useEffect(() => {
    const test = async () => {
      await axios.get("http://localhost:5000/api/v1/auth/check", {
        withCredentials: true,
      });
    };
    test();
  }, []);
  return null;
};

export default TestCookie;
