"use client";
import { redirect } from 'next/navigation';
import '../css/navbar.css'
import React, { useState, useEffect } from "react";

export default function Navbar() {
    const [domain, setDomain] = useState("");

    useEffect(() => {
        setDomain(`${window.location.protocol}//${window.location.hostname}`);
    }, []);

    const handleLogout = async (event) => {
        localStorage.removeItem('userId');
        window.location.href = '/login';
    }

    let port = 8080;
    return (
        <div className={"navbar-main"}>
            <div className={"row d-flex align-items-center justify-content-center h-100 w-100 px-5"}>
                <div className={"col-8 text-white header-text"}>
                    Smart Scheduler
                </div>
                <div className={"col-4 text-end"}>
                    <button onClick={handleLogout} className={"logout bg-none bg-transparent"}>Log Out</button>
                </div>
            </div>
        </div>
    )
}
