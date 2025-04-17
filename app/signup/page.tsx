"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import React from "react";

export default function SignUp() {
    interface userSignType {
        username: string;
        email: string | any;
        password: string | number;
    }
    const router = useRouter();
    const errorBlock = useRef<HTMLDivElement | null>(null);
    const errorContent = useRef<HTMLSpanElement | null>(null);
    const passwordCheck = useRef<HTMLInputElement>(null);
    const btnref = useRef<HTMLButtonElement | null>(null);
    // Password toggler
    const togglePassword = () => {
        if (passwordCheck.current) {
            if (passwordCheck.current.type === "password") {
                passwordCheck.current.type = "text";
            } else {
                passwordCheck.current.type = "password";
            }
        }
    };
    const [SignValues, setSignValues] = useState<userSignType>({
        username: "",
        email: "",
        password: "",
    });
    // Input handler
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
 
    // Signup Values
    const returnSignValues = async () => {
        if (!SignValues.username || !SignValues.email || !SignValues.password) {
            if (errorBlock.current) {
                errorBlock.current.style.display = "block";
                if (errorContent.current) {
                    errorContent.current.textContent = "Invalid Credientials!";
                }
            }
        } else {
            try {
                // Blocks the Button
                if (btnref.current) {
                    btnref.current.textContent = "Please Wait...";
                    btnref.current.style.opacity = "0.8";
                    btnref.current.disabled = true;
                }
                // Fetch the request to server
                let req = await fetch("https://localhost:8999/api/signup", {
                    method: "POST",
                    body: JSON.stringify(SignValues),
                    headers: { "Content-Type": "application/json" },
                });
                // Response of server to manage UI
                let res = await req.json();
                if (req.ok) {
                    if (btnref.current) {
                        btnref.current.disabled = true;
                        btnref.current.textContent = "Please Wait...";
                        btnref.current.style.opacity = "0.9";
                    }
                    router.push(`/otp?email=${SignValues.email}&fromSignup=1`);
                } else {
                    if (errorBlock.current) {
                        errorBlock.current.style.display = "block";
                        if (errorContent.current) {
                            errorContent.current.textContent = res.message;
                        }
                    }
                    if (btnref.current) {
                        btnref.current.textContent = "Register Me";
                        btnref.current.style.opacity = "1";
                        btnref.current.disabled = false;
                    }
                }
            } catch (e) {
                // If Server Failed to Fetch the request
                if (errorBlock.current) {
                    errorBlock.current.style.display = "block";
                    if (errorContent.current) {
                        errorContent.current.textContent = "Internal Server Error!";
                    }
                }
                if (btnref.current) {
                    btnref.current.disabled = false;
                    btnref.current.textContent = "Register Me";
                    btnref.current.style.opacity = "1";
                }
            }
        }
    };
    // Close the modal
    const closeBlock = () => {
        if (errorBlock.current) {
            errorBlock.current.style.display = "none";
        }
    };
    return (
        <div className="my-42">
            {/* Error Block */}
            <div
                id="error-block"
                ref={errorBlock}
                className="hidden mx-auto mb-4 w-fit border border-stone-700 rounded-lg px-2.5 py-1.5 transition-all"
            >
                <span className="flex flex-row items-center justify-between gap-4">
                    <span ref={errorContent} className="font-medium"></span>
                    <button
                        onClick={() => closeBlock()}
                        className="flex cursor-pointer text-stone-500"
                    >
                        <span className="flex material-symbols-outlined">close</span>
                    </button>
                </span>
            </div>
            {/* Content  */}
            <title>Register Page</title>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
            />
            <div
                id="main-wrapper"
                className="w-fit border border-stone-800 rounded-lg p-4 mx-auto shadow-2xl"
            >
                <div>
                    <h2 className="text-xl text-center">Register</h2>
                </div>
                {/* User Inputs */}
                <div className="flex flex-col justify-start gap-2.5">
                    <div className="flex flex-col">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            required
                            id="username"
                            name="username"
                            className="focus:ring-2 focus:ring-blue-500 focus:outline-none border border-stone-600 outline-none rounded-lg px-1.5 py-0.5"
                            value={SignValues.username}
                            onChange={handleInput}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            required
                            id="email"
                            name="email"
                            className="focus:ring-2 focus:ring-blue-500 focus:outline-none border border-stone-600 outline-none rounded-lg px-1.5 py-0.5"
                            value={SignValues.email}
                            onChange={handleInput}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password">Password</label>
                        <div className="flex flex-row gap-1.5 items-center">
                            <input
                                ref={passwordCheck}
                                type="text"
                                required
                                id="password"
                                name="password"
                                className="border border-stone-600 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-lg px-1.5 py-0.5"
                                value={SignValues.password}
                                onChange={handleInput}
                            />
                            <button
                                onClick={() => togglePassword()}
                                className="flex bg-stone-900 p-1 cursor-pointer rounded-lg"
                            >
                                <span className="flex material-symbols-outlined">
                                    visibility_off
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="w-full">
                        <button
                            ref={btnref}
                            className="w-full bg-blue-500 text-white py-1.5 rounded-lg cursor-pointer hover:bg-blue-600"
                            onClick={() => returnSignValues()}
                        >
                            Register Me
                        </button>
                    </div>
                    <div className="text-center">
                        <p>
                            Already a Member?{" "}
                            <Link href="/login" className="underline text-blue-600">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
