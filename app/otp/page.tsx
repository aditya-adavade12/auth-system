'use client';
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react"

export default function OTP() {
    const router = useRouter();
    interface otpVerify {
        otp: number | string;
    }
    const errorBlock = useRef<HTMLDivElement | null>(null);
    const errorContent = useRef<HTMLSpanElement | null>(null);
    const [userOtp, setOtp] = useState<otpVerify>({
        otp: ""
    });
    // Input handler
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOtp((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    // Close the modal
    const closeBlock = () => {
        if (errorBlock.current) {
            errorBlock.current.style.display = "none";
        }
    }
    // Managing the resend otp
    const otpBtn = useRef<HTMLButtonElement | null>(null);
    const newBtn = useRef<HTMLButtonElement | null>(null);
    const deleteblock = useRef<HTMLSpanElement | null>(null);
    const [Seconds, setSeconds] = useState(60);
    useEffect(() => {

        if (Seconds > 0) {
            if (newBtn.current) {
                newBtn.current.textContent = `Resend OTP ${Seconds}`;
                newBtn.current.style.color = "#6c757d";
                newBtn.current.disabled = true;
            }
            const timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        } else {
            if (newBtn.current) {
                newBtn.current.textContent = "Resend OTP";
                newBtn.current.disabled = false;
                newBtn.current.style.color = "white";
            }
        }
    }, [Seconds]);

    // Blocking the reload
    const searchParams = useSearchParams();
    const fromSignup = searchParams.get("fromSignup");
    const usermail = searchParams.get("email");

    useEffect(() => {
        if (!fromSignup) {
            router.push("/");
        }
    }, [router, fromSignup]);

    // Sending OTP to server to verify

    const authOTP = async () => {

        if (!userOtp.otp || userOtp.otp.toString().length < 6) {
            if (errorBlock.current) {
                errorBlock.current.style.display = "block";
                if (errorContent.current) {
                    errorContent.current.textContent = "Invalid OTP!";
                }
            }
        } else {
            try {
                // Blocks the Button
                if (otpBtn.current) {
                    otpBtn.current.textContent = "Please Wait...";
                    otpBtn.current.style.opacity = "0.8";
                    otpBtn.current.disabled = true;
                }
                // Fetch the request to server
                let req = await fetch(`https://localhost:8999/api/otp/${usermail}`, {
                    method: "POST",
                    body: JSON.stringify(userOtp),
                    headers: { "Content-Type": "application/json" },
                });
                // Response of server to manage UI
                let res = await req.json();
                if (req.ok) {
                    if (otpBtn.current) {
                        otpBtn.current.disabled = true;
                        otpBtn.current.textContent = "Please Wait..";
                        otpBtn.current.style.opacity = "0.9";
                    }
                    if (errorBlock.current) {
                        errorBlock.current.style.display = "block";
                        if (errorContent.current) {
                            errorContent.current.textContent = res.message;
                        }
                    }
                } else {
                    if (errorBlock.current) {
                        errorBlock.current.style.display = "block";
                        if (errorContent.current) {
                            errorContent.current.textContent = res.message;
                        }
                    }
                    if (otpBtn.current) {
                        otpBtn.current.textContent = "Confirm";
                        otpBtn.current.style.opacity = "1";
                        otpBtn.current.disabled = false;
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
                if (otpBtn.current) {
                    otpBtn.current.disabled = false;
                    otpBtn.current.textContent = "Confirm";
                    otpBtn.current.style.opacity = "1";
                }
            }
        }
    };

    // Resend OTP
    const sendnewOTP = async () => {
        let askuser = confirm("Are u sure to generate new OTP");
        if (askuser) {
            if (otpBtn.current) {
                otpBtn.current.textContent = "Confirm New OTP";
                otpBtn.current.style.opacity = "1";
                otpBtn.current.disabled = true;
            }
            if (newBtn.current) {
                newBtn.current.textContent = "Please Wait..";
                newBtn.current.style.opacity = "0.8";
                newBtn.current.disabled = true;
            }
            let mail = {
                email: usermail
            }
            try {
                let req = await fetch("https://localhost:8999/api/new", {
                    headers: { "Content-Type": "application/json" },
                    method: "POST",
                    body: JSON.stringify(mail),
                });
                let res = await req.json();
                if (req.ok) {
                    setSeconds(120);
                    if (deleteblock.current) {
                        deleteblock.current.textContent = res.message;
                    }
                    if (otpBtn.current) {
                        otpBtn.current.disabled = false;
                    }
                }
            } catch (e) {
                if (errorBlock.current) {
                    errorBlock.current.style.display = "block";
                    if (errorContent.current) {
                        errorContent.current.textContent = "Internal Server Error!" + e;
                    }
                }
            }
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
            <title>OTP Verfication</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <div id="main-wrapper" className="w-fit border border-stone-800 rounded-lg p-4 mx-auto shadow-2xl">
                <div className="mx-auto mb-4 w-fit border border-stone-800 rounded-lg px-2.5 py-1.5 transition-all">
                    <span className="flex flex-row items-center gap-4" ref={deleteblock}>
                        <span className="font-medium text-stone-300">We've emailed you a 6-digit OTP.</span>
                    </span>
                </div>
                <div>
                    <h2 className="text-xl text-center">OTP Verfication</h2>
                </div>
                {/* User Inputs */}
                <div className="flex flex-col justify-start gap-2.5 mt-7.5">
                    <div className="flex flex-col">
                        <label htmlFor="otp">Enter OTP</label>
                        <input value={userOtp.otp} maxLength={6} onChange={handleInput} type="text" required id="otp" name="otp" className="focus:ring-2 focus:ring-blue-500 focus:outline-none border border-stone-600 outline-none rounded-lg px-1.5 py-0.5" />
                    </div>
                    <div className="w-full">
                        <button className="w-full bg-blue-500 text-white py-1.5 rounded-lg cursor-pointer hover:bg-blue-600" ref={otpBtn} onClick={() => authOTP()}>Confirm</button>
                    </div>
                    <div className="text-center flex flex-row justify-center gap-1.5">
                        <Link href="/" className="text-md underline text-blue-500">Go Home</Link>
                        <button className="underline cursor-pointer" onClick={() => sendnewOTP()} ref={newBtn}>Resend OTP {Seconds}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}