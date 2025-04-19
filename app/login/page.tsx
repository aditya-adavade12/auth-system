'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useRef, useState } from "react";

export default function Login() {
    const router = useRouter();
    interface userLoginType {
        email: string;
        password: string;
    }
    const [LogValues, setLogValues] = useState<userLoginType>({
        email: "",
        password: "",
    });
    // Input handler
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLogValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    const btnref = useRef<HTMLButtonElement | null>(null);
    // Return LogValues  
    const returnLogValues = async () => {
        if (!LogValues.password || !LogValues.email) {
            if (errorBlock.current) {
                errorBlock.current.style.display = "block";
                if (errorContent.current) {
                    errorContent.current.textContent = "Email and Password are required.";
                }
            }
            return;
        }
        else {
            if (btnref.current) {
                btnref.current.textContent = "Please Wait...";
                btnref.current.disabled = true;
                btnref.current.style.opacity = "0.8";
            }
            try {
                let req = await fetch("https://localhost:8999/api/login", {
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify(LogValues),
                });
                let res = await req.json();
                if (req.ok) {
                    if (errorBlock.current) {
                        errorBlock.current.style.display = "block";
                        if (errorContent.current) {
                            errorContent.current.textContent = res.message;
                        }
                    }
                    router.push("/home");
            
                } else {
                    if (errorBlock.current) {
                        errorBlock.current.style.display = "block";
                        if (errorContent.current) {
                            errorContent.current.textContent = res.message;
                        }
                    }
                    if (btnref.current) {
                        btnref.current.textContent = "Login Me";
                        btnref.current.style.opacity = "1";
                        btnref.current.disabled = false;
                    }
                }
            } catch (e) {
                if (btnref.current) {
                    btnref.current.disabled = false;
                    btnref.current.textContent = "Login Me";
                    btnref.current.style.opacity = "1";
                }
                if (errorBlock.current) {
                    errorBlock.current.style.display = "block";
                    if (errorContent.current) {
                        errorContent.current.textContent = "Internal Server Error! " + e; 
                    }
                }
            }

        }
    }
    const errorBlock = useRef<HTMLDivElement>(null);
    const errorContent = useRef<HTMLSpanElement>(null);
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
    // Close Modal
    const closeBlock = () => {
        if (errorBlock.current) {
            errorBlock.current.style.display = "none";
        }
    }
    return (
        <div className="my-42">
            <div id="error-block" ref={errorBlock} className="hidden mx-auto mb-4 w-fit border border-stone-800 rounded-lg px-2.5 py-2.5 transition-all">
                <span className="flex flex-row items-center gap-8">
                    <span ref={errorContent} className="font-medium"></span>
                    <button onClick={() => closeBlock()} className="flex cursor-pointer text-stone-500"><span className="flex material-symbols-outlined">
                        close
                    </span></button>
                </span>
            </div>
            <title>Login Page</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <div id="main-wrapper" className="w-fit border border-stone-800 rounded-lg p-4 mx-auto shadow-2xl">
                <div>
                    <h2 className="text-xl text-center">Login</h2>
                </div>
                {/* User Inputs */}
                <div className="flex flex-col justify-start gap-2.5">
                    <div className="flex flex-col">
                        <label htmlFor="email">Email</label>
                        <input type="email" required id="email" pattern="^[A-Za-z]+$" title="Email here." name="email" className="focus:ring-2 focus:ring-blue-500 focus:outline-none border border-stone-600 outline-none rounded-lg px-1.5 py-0.5" value={LogValues.email} onChange={handleInput} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password">Password</label>
                        <div className="flex flex-row gap-1.5 items-center">
                            <input ref={passwordCheck} type="password" required id="password" title="Password here." name="password" className="border border-stone-600 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-lg px-1.5 py-0.5" value={LogValues.password} onChange={handleInput} />
                            <button onClick={() => togglePassword()} className="flex bg-stone-900 p-1 cursor-pointer rounded-lg"><span className="flex material-symbols-outlined">
                                visibility_off
                            </span></button>
                        </div>
                    </div>
                    <div className="flex text-[15px]">
                        <Link href="/forgot" className="underline text-blue-600">Forgot Password</Link>
                    </div>
                    <div className="w-full">
                        <button className="w-full bg-blue-500 text-white py-1.5 rounded-lg cursor-pointer hover:bg-blue-600" onClick={() => returnLogValues()} ref={btnref}>Login Me</button>
                    </div>
                    <div className="text-center">
                        <p>Not a Member? <Link href="/signup" className="underline text-blue-600">Register</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}