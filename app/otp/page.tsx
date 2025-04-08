'use client';
import Link from "next/link"
import { useRef, useState } from "react"

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
                    errorContent.current.textContent = "Invalid Credientials";
                }
            }
        } else {
            console.log(userOtp);
            
        }
    }
    return (
        <div className="my-42">
            <div id="error-block" ref={errorBlock} className="hidden mx-auto mb-4 w-fit border border-stone-800 rounded-lg px-2.5 py-1.5 transition-all">
                <span ref={errorContent} className="font-medium"></span>
            </div>
            <title>OTP Verfication</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <div id="main-wrapper" className="w-fit border border-stone-800 rounded-lg p-4 mx-auto">
                <div>
                    <h2 className="text-xl text-center">Verify OTP</h2>
                </div>
                {/* User Inputs */}
                <div className="flex flex-col justify-start gap-2.5 mt-1.5 text-white">
                    <div className="flex flex-col">
                        <label htmlFor="otp">OTP</label>
                        <input value={userOtp.otp} onChange={handleInput} type="text" required id="otp" name="otp" className="focus:ring-2 focus:ring-blue-500 focus:outline-none border border-stone-600 outline-none rounded-lg px-1.5 py-0.5" />
                    </div>
                    <div className="w-full">
                        <button className="w-full bg-blue-500 text-white py-1.5 rounded-lg cursor-pointer hover:bg-blue-600" onClick={() => returnOtp()}>Verify</button>
                    </div>
                    <div className="text-center">
                        <Link href="/" className="text-md underline text-blue-500">Go Home</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}