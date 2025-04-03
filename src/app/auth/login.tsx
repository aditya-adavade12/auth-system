'use client';

import React, { useState } from "react";

export default function Login() {
    interface userLoginType {
        username: string;
        password: string | number;
    }
    const [LogValues, setLogValues] = useState<userLoginType>({
        username: "",
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
    // Return LogValues 
    const returnLogValues = () => {
        if (!LogValues.password || !LogValues.username) {
            alert("Invalid !");
        } else {
            console.log(LogValues);
        }
    }
    return (
        <div className="my-42">
            <title>Login Page</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <div id="main-wrapper" className="w-fit border border-stone-800 rounded-lg p-4 mx-auto">
                <div>
                    <h2 className="text-xl text-center">Login</h2>
                </div>
                <div className="flex flex-col justify-start gap-2.5 text-white">
                    <div className="flex flex-col">
                        <label htmlFor="username">Username</label>
                        <input type="text" required id="username" name="username" className="border border-stone-600 outline-none rounded-lg px-1.5 py-0.5" value={LogValues.username} onChange={handleInput} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password">Password</label>
                        <div className="flex flex-row gap-1.5 items-center">
                            <input type="text" required id="password" name="passsword" className="border border-stone-600 outline-none rounded-lg px-1.5 py-0.5" value={LogValues.password} onChange={handleInput} />
                            <button className="flex bg-stone-900 p-1 cursor-pointer rounded-lg"><span className="flex material-symbols-outlined">
                                visibility_off
                            </span></button>
                        </div>
                    </div>
                    <div className="flex text-[15px]">
                        <a href="#" className="underline text-blue-600">Forgot Password</a>
                    </div>
                    <div className="w-full">
                        <button className="w-full bg-blue-500 text-white py-1.5 rounded-lg cursor-pointer hover:bg-blue-600" onClick={() => returnLogValues()}>Login Me</button>
                    </div>
                    <div className="text-center">
                        <p>Not a Member? <a href="/login" className="underline text-blue-600">Register</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}