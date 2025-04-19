'use client';
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useRef, useState } from "react"

export default function Forgot() {
    const router = useRouter();
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
    const btnref = useRef<HTMLButtonElement | null>(null);
    // Return OTP
    const returnOtp = async () => {
        if (!Email.email) {
            if (errorBlock.current) {
                errorBlock.current.style.display = "block";
                if (errorContent.current) {
                    errorContent.current.textContent = "Invalid Credientials";
                }
            }
        } else {
            if (btnref.current) {
                btnref.current.textContent = "Please Wait..";
                btnref.current.disabled = true;
                btnref.current.style.opacity = "0.8";
            }
            try {
                let req = await fetch("https://localhost:8999/api/forgot", {
                    headers: {"Content-Type" : "application/json"},
                    method: "POST",
                    body: JSON.stringify(Email),
                });
                let res = await req.json();
                if (req.ok) {
                    if (errorBlock.current) {
                        errorBlock.current.style.display = "block";
                        if (errorContent.current) {
                            errorContent.current.textContent = res.message;
                        }
                    }
                    if (btnref.current) {
                        btnref.current.textContent = "Send OTP";
                        btnref.current.disabled = false;
                        btnref.current.style.opacity = "0.8";
                    }
                    router.push(`/otp?email=${Email.email}&fromPassword=true`);
                } else {
                    if (errorBlock.current) {
                        errorBlock.current.style.display = "block";
                        if (errorContent.current) {
                            errorContent.current.textContent = res.message;
                        }
                    }
                    if (btnref.current) {
                        btnref.current.textContent = "Send OTP";
                        btnref.current.disabled = false;
                        btnref.current.style.opacity = "1";
                    }
                }
            } catch (error) {
                if (errorBlock.current) {
                    errorBlock.current.style.display = "block";
                    if (errorContent.current) {
                        errorContent.current.textContent = "Internal Server Error! " + error;
                    }
                }
                if (btnref.current) {
                    btnref.current.textContent = "Send OTP";
                    btnref.current.disabled = false;
                    btnref.current.style.opacity = "1";
                }
            }
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
                        <button className="w-full bg-blue-500 text-white py-1.5 rounded-lg cursor-pointer hover:bg-blue-600" ref={btnref} onClick={() => returnOtp()}>Send OTP</button>
                    </div>
                    <div className="text-center">
                        <Link href="/" className="text-md underline text-blue-500">Go Home</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}