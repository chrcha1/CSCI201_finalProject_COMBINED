"use client";
import React, { useState } from "react";
import "../css/login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event: any) => {
    event.preventDefault();
    setErrorMessage("");

    // Sending a POST request to the login servlet
    try {
      console.log(username);
      console.log(password);
      const domain = `${window.location.protocol}//${window.location.hostname}`;
      const port = 8080;
      const response = await fetch(
        `${domain}:${port}/smartScheduler/LoginServlet`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `username=${encodeURIComponent(
            username
          )}&password=${encodeURIComponent(password)}`,
        }
      );

      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
      } else if (data.success) {
        localStorage.setItem('userId', data.userId);
        window.location.href = data.redirect;
      }
    } catch (error) {
      setErrorMessage("Failed to connect to the server.");
      console.log(error);
    }
  };

  return (
    <main>
      <div className="container-fluid main-container">
        <div className="row d-flex justify-content-center align-items-center main-container">
          <div className="col-12 login-position">
            <div className="text-white text-center login-headline pb-4">
              Smart Scheduler
            </div>
            <div className="container py-5 px-5 login-startup-shadow login-container">
              <div className={"w-100"}>
                <div className="row text-center">
                  <div className="col-12 text-center sign-in pt-5">Sign In</div>
                </div>
                <form
                  className="container px-md-5 w-md-75"
                  onSubmit={handleLogin}
                >
                  <div className="row text-center pt-3">
                    <div className="col-12 text-center">
                      <div className="input-wrapper">
                        <div className={"col-2"}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1.5rem"
                            height="1.5rem"
                            fill="rgb(117, 117, 117)"
                            className="bi bi-person"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                          </svg>
                        </div>
                        <div className={"col-10"}>
                          <input
                            type="text"
                            name="username"
                            placeholder="username"
                            className="sign-in-field w-100"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row text-center pt-3">
                    <div className="col-12 text-center">
                      <div className="input-wrapper">
                        <div className={"col-2"}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1.5rem"
                            height="1.5rem"
                            fill="rgb(117, 117, 117)"
                            className="bi bi-lock"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                          </svg>
                        </div>
                        <div className={"col-10"}>
                          <input
                            type="password"
                            name="password"
                            placeholder="password"
                            className="sign-in-field w-100"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row text-center pt-4 d-flex align-items-center justify-content-center">
                    <div className="col-12 text-center">
                      <button className="btn login-button w-100" type="submit">
                        Login
                      </button>
                      <div className="text-end pt-2 pb-5 forgot-password-text">
                        Forgot Password?
                      </div>
                      {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
