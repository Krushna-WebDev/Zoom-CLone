import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface formdatainterface {
  name: string;
  email: string;
  password: string;
  // confirmPassword: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState<formdatainterface>({
    name: "", //krushna
    email: "", // test123@gmail.com
    password: "", //123
    // confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        formdata
      );
      toast.success(res.data.message);
      setFormdata({
        name: "", 
        email: "", 
        password: "",
      });
      // navigate("/login");
    } catch (error: any) {
      const errors = error.response.data.errors;
      errors.map((e: any) => toast.error(e));
    }
  };
  return (
    <>
      <div className="flex justify-center items-center mx-auto mt-10 max-w-3xl">
        <div className="bg-gray-200 p-6 rounded-lg w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className=" cursor-pointer hover:underline">
              Already have an account? Sign In
            </p>
          </div>
          <div className="flex justify-between  w-full">
            <form action="" className="w-80 mt-10" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="name"
                  value={formdata.name}
                  className="block w-full py-2 px-3 border font-semibold border-gray-400"
                  placeholder="Name"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="email"
                  value={formdata.email}
                  className="block w-full py-2 px-3 border font-semibold border-gray-400"
                  placeholder="Email"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="password"
                  value={formdata.password}
                  className="block w-full py-2 px-3 border font-semibold border-gray-400"
                  placeholder="Password"
                  onChange={handleChange}
                />
                {/* <input
                  type="text"
                  value={formdata.confirmPassword}
                  className="block w-full py-2 px-3 border font-semibold border-gray-400"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                /> */}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 mt-5 rounded-2xl py-2 text-white font-semibold"
              >
                Create Account
              </button>
            </form>
            <div className="">
              <img className="w" src="Group 3.png" alt="" sizes="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
