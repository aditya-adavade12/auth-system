'use client';
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function OTP() {
    interface otpVerify {
        otp: number | string;
    }
    const errorBlock = useRef<HTMLDivElement | null>(null);
    const errorContent = useRef<HTMLSpanElement | null>(null);
    const [userOtp, setOtp] = useState<otpVerify>({
        otp: "",
    });
    // Input handler
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOtp((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    // Return OTP to verify
    const returnOtp = () => {
        if (!userOtp.otp) {
            if (errorBlock.current) {
                errorBlock.current.style.display = "block";
                if (errorContent.current) {
                    errorContent.current.textContent = "Invalid OTP";
                }
            }
        } else {
            console.log(userOtp);
        }
    }
    // Close the modal
    const closeBlock = () => {
        if (errorBlock.current) {
            errorBlock.current.style.display = "none";
        }
    }
    // Managing the resend otp
    const otpBtn = useRef<HTMLButtonElement | null>(null);
    const [Seconds, setSeconds] = useState(30);
    useEffect(() => {
        if (Seconds == 0) return;
        const timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [Seconds]);
    // Blocking the reload
    useEffect(() => {
        const handleLoad = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };
        window.addEventListener("beforeunload", handleLoad);
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (nav?.type === 'reload') {
            window.location.href = "/";
        }
        return () => {
            window.removeEventListener("beforeunload", handleLoad);
        }
    }, []);
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
            <title>OTP Verfication</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <div id="main-wrapper" className="w-fit border border-stone-800 rounded-lg p-4 mx-auto shadow-2xl">
                <div className="mx-auto mb-4 w-fit border border-stone-800 rounded-lg px-2.5 py-1.5 transition-all">
                    <span className="flex flex-row items-center gap-4">
                        <span className="font-medium text-stone-300">We've emailed you a 4-digit OTP.</span>
                    </span>
                </div>
                <div>
                    <h2 className="text-xl text-center">OTP Verfication</h2>
                </div>
                {/* User Inputs */}
                <div className="flex flex-col justify-start gap-2.5 mt-7.5">
                    <div className="flex flex-col">
                        <label htmlFor="otp">Enter OTP</label>
                        <input value={userOtp.otp} onChange={handleInput} type="text" required id="otp" name="otp" className="focus:ring-2 focus:ring-blue-500 focus:outline-none border border-stone-600 outline-none rounded-lg px-1.5 py-0.5" />
                    </div>
                    <div className="w-full">
                        <button className="w-full bg-blue-500 text-white py-1.5 rounded-lg cursor-pointer hover:bg-blue-600" onClick={() => returnOtp()}>Confirm</button>
                    </div>
                    <div className="text-center flex flex-row justify-center gap-1.5">
                        <Link href="/" className="text-md underline text-blue-500">Go Home</Link>
                        <button className="underline cursor-pointer" ref={otpBtn}>Resend OTP {Seconds}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}