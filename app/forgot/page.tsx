'use client';
import Link from "next/link"
import { useRef, useState } from "react"

export default function Forgot() {
    interface changePassword {
        email: string | any;
    }
    const errorContent = useRef(null);
    const errorBlock = useRef(null);
        const [LogValues, setLogValues] = useState<changePassword>({
            email: ""
        });
        // Input handler
        const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setLogValues((prevValues) => ({
                ...prevValues,
                [name]: value,
            }));
        };
    return (
        <div className="my-42">
            <div id="error-block" ref={errorBlock} className="hidden mx-auto mb-4 w-fit border border-stone-800 rounded-lg px-2.5 py-1.5 transition-all">
                <span ref={errorContent} className="font-medium"></span>
            </div>
            <title>Forgot Password</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <div id="main-wrapper" className="w-fit border border-stone-800 rounded-lg p-4 mx-auto">
                <div>
                    <h2 className="text-xl text-center">Forgot Password</h2>
                </div>
                {/* User Inputs */}
                <div className="flex flex-col justify-start gap-2.5 mt-4.5 text-white">
                    <div className="flex flex-col">
                        <label htmlFor="email">Email</label>
                        <input value={LogValues.email} onChange={handleInput} type="text" required id="email" name="email" className="focus:ring-2 focus:ring-blue-500 focus:outline-none border border-stone-600 outline-none rounded-lg px-1.5 py-0.5" />
                    </div>
                    <div className="w-full">
                        <button className="w-full bg-blue-500 text-white py-1.5 rounded-lg cursor-pointer hover:bg-blue-600">Send OTP</button>
                    </div>
                    <div className="text-center">
                        <Link href="/" className="text-md underline text-blue-500">Go Home</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}