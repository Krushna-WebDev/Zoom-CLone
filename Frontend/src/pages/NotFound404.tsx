import React from "react";
import { Link } from "react-router-dom";

const NotFound404 = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
        <img
          src="notfound.jpg"
          alt="404 Illustration"
          className="mb-8 w-64 max-w-full animate-bounce sm:w-96"
        />

        <h1 className="mb-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Oops! We couldn't find the page you were looking for.
        </p>

        <Link
          to="/"
          className="rounded-full bg-blue-600 px-8 py-3 text-sm font-medium text-white transition-transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Go Back Home
        </Link>
      </div>
    </>
  );
};

export default NotFound404;
