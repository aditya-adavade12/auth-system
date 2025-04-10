'use client';
import Link from "next/link"
import { useRef, useState } from "react"

export default function Forgot() {
    interface changePassword {
        email: string | any;
    }
    const errorBlock = useRef<HTMLDivElement | null>(null);
    const errorContent = useRef<HTMLSpanElement | null>(null);
    const [Email, setEmail] = useState<changePassword>({
        email: ""
    });
    // Input handler
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmail((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    // Return OTP
    const returnOtp = () => {
        if (!Email.email) {
            if (errorBlock.current) {
                errorBlock.current.style.display = "block";
                if (errorContent.current) {
                    errorContent.current.textContent = "Invalid Credientials";
                }
            }
        } else {
            console.log(Email);

        }
    }
    // Close the modal 
    const closeBlock = () => {
        if (errorBlock.current) {
            errorBlock.current.style.display = "none";
        }
    }
    return (
        <div className="my-42">
            <div id="error-block" ref={errorBlock} className="hidden mx-auto mb-4 w-fit border border-stone-800 rounded-lg px-2.5 py-1.5 transition-all">
                <span className="flex flex-row items-center gap-4">
                    <span ref={errorContent} className="font-medium"></span>
                    <button onClick={() => closeBlock()} className="flex cursor-pointer text-stone-500"><span className="flex material-symbols-outlined">
                        close
                    </span></button>
                </span>
            </div>
            <title>Forgot Password</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <div id="main-wrapper" className="w-fit border border-stone-800 rounded-lg p-4 mx-auto shadow-2xl">
                <div>
                    <h2 className="text-xl text-center">Forgot Password</h2>
                </div>
                {/* User Inputs */}
                <div className="flex flex-col justify-start gap-2.5 mt-4.5">
                    <div className="flex flex-col">
                        <label htmlFor="email">Email</label>
                        <input value={Email.email} onChange={handleInput} type="text" required id="email" name="email" className="focus:ring-2 focus:ring-blue-500 focus:outline-none border border-stone-600 outline-none rounded-lg px-1.5 py-0.5" />
                    </div>
                    <div className="w-full">
                        <button className="w-full bg-blue-500 text-white py-1.5 rounded-lg cursor-pointer hover:bg-blue-600" onClick={() => returnOtp()}>Send OTP</button>
                    </div>
                    <div className="text-center">
                        <Link href="/" className="text-md underline text-blue-500">Go Home</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}