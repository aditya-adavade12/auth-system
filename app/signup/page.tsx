'use client';
import Link from "next/link";
import { useRef, useState } from "react";
import React from "react";

export default function SignUp() {
    interface userSignType {
        username: string;
        email: string | any;
        password: string | number;
    }
    const errorBlock = useRef<HTMLDivElement | null>(null);
    const errorContent = useRef<HTMLSpanElement | null>(null);
    const passwordCheck = useRef<HTMLInputElement>(null);
    // Password toggler
    const togglePassword = () => {
        if (passwordCheck.current) {
            if (passwordCheck.current.type === "password") {
                passwordCheck.current.type = "text";
            } else {
                passwordCheck.current.type = "password";
            }
        }
    }
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
    const returnSignValues = () => {
        if (!SignValues.username || !SignValues.email || !SignValues.password) {
            if (errorBlock.current) {
                errorBlock.current.style.display = "block";
                if (errorContent.current) {
                    errorContent.current.textContent = "Invalid Credientials!";
                }
            }
        } else {
            if (errorBlock.current) {
                errorBlock.current.style.display = "block"
                if (errorContent.current) {
                    errorContent.current.textContent = "Success";
                }
            }
        }
    }
    return (
        <div className="my-42">
            <div id="error-block" ref={errorBlock} className="hidden mx-auto mb-4 w-fit border border-stone-800 rounded-lg px-2.5 py-1.5 transition-all">
                <span ref={errorContent} className="font-medium"></span>
            </div>
            <title>Register Page</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <div id="main-wrapper" className="w-fit border border-stone-800 rounded-lg p-4 mx-auto">
                <div>
                    <h2 className="text-xl text-center">Register</h2>
                </div>
                {/* User Inputs */}
                <div className="flex flex-col justify-start gap-2.5 text-white">
                    <div className="flex flex-col">
                        <label htmlFor="username">Username</label>
                        <input type="text" required id="username" name="username" className="focus:ring-2 focus:ring-blue-500 focus:outline-none border border-stone-600 outline-none rounded-lg px-1.5 py-0.5" value={SignValues.username} onChange={handleInput} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email">Email</label>
                        <input type="text" required id="email" name="email" className="focus:ring-2 focus:ring-blue-500 focus:outline-none border border-stone-600 outline-none rounded-lg px-1.5 py-0.5" value={SignValues.email} onChange={handleInput} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password">Password</label>
                        <div className="flex flex-row gap-1.5 items-center">
                            <input ref={passwordCheck} type="text" required id="password" name="password" className="border border-stone-600 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-lg px-1.5 py-0.5" value={SignValues.password} onChange={handleInput} />
                            <button onClick={() => togglePassword()} className="flex bg-stone-900 p-1 cursor-pointer rounded-lg"><span className="flex material-symbols-outlined">
                                visibility_off
                            </span></button>
                        </div>
                    </div>
                    <div className="w-full">
                        <button className="w-full bg-blue-500 text-white py-1.5 rounded-lg cursor-pointer hover:bg-blue-600" onClick={() => returnSignValues()}>Register Me</button>
                    </div>
                    <div className="text-center">
                        <p>Already a Member? <Link href="/login" className="underline text-blue-600">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}