"use client";
import '../css/navbar.css'
import React, { useState, useEffect } from "react";

export default function Navbar() {
    const [domain, setDomain] = useState("");

    useEffect(() => {
        setDomain(`${window.location.protocol}//${window.location.hostname}`);
    }, []);
    
    let port = 8080;
    return (
        <div className={"navbar-main"}>
            <div className={"row d-flex align-items-center justify-content-center h-100 w-100 px-5"}>
                <div className={"col-8 text-white header-text"}>
                    Smart Scheduler
                </div>
                <div className={"col-4 text-end"}>
                    <a href={`${domain}:${port}/smartScheduler/LogoutServlet`} className={"logout"}>Log Out</a>
                </div>
            </div>
        </div>
    )
}
