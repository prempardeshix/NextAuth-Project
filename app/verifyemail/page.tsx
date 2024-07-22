"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function () {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  async function verifier() {
    try {
      const decodedToken = decodeURIComponent(token);
      await axios.post("/api/user/verifyemail", decodedToken);
      setVerified(true);
      setError(false);
    } catch (error: any) {
      console.log(error.response.data);
    }
  }

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    console.log(token);
  }, [token]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-2">
      {!verified && (
        <button
          onClick={verifier}
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-white"
        >
          Verify
        </button>
      )}

      <h2 className="p-2 bg-orange-500 text-black">
        {verified && (
          <div>
            <h2>Verified</h2>
            <Link href="/signin">Sign In</Link>
          </div>
        )}
      </h2>
      <h2 className="p-2 bg-orange-500 text-black">
        {error && (
          <div>
            <h2>Error</h2>
            <Link href="/signup">Sign Up</Link>
          </div>
        )}
      </h2>
    </div>
  );
}
