'use client';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ChangePassword() {
    const router = useRouter();
    interface changePasswordType {
        password: number | string;
    }
    const errorBlock = useRef<HTMLDivElement | null>(null);
    const errorContent = useRef<HTMLSpanElement | null>(null);
    const [Password, setPassword] = useState<changePasswordType>({
        password: "",
    });
    // Input handler
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPassword((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    useEffect(() => {
        if (!email) router.push("/");
    }, [router]);
    // Return a new password
    const btnref = useRef<HTMLButtonElement | null>(null);
    const loginBlock = useRef<HTMLDivElement | null>(null);
    let userObject = {
        ...Password, 
        email: email,
    }
    const returnPassword = async () => {
        if (!Password.password || Password.password.toString().trim().length < 8) {
            if (errorBlock.current) {
                errorBlock.current.style.display = "block";
                if (errorContent.current) {
                    errorContent.current.textContent = "Invalid Password (Password length must be 8 or greater than)";
                }
            }
        } else {
            if (btnref.current) {
                btnref.current.textContent = "Please Wait..";
                btnref.current.style.opacity = "0.8";
                btnref.current.disabled = true;
            }
            console.log(userObject);
            
            try {
                let req = await fetch("https://localhost:8999/api/change", {
                    headers: { "Content-Type": "application/json" },
                    method: "POST",
                    body: JSON.stringify(userObject)
                });
                let res = await req.json();
                if (req.ok) {
                    if (errorBlock.current) {
                        errorBlock.current.style.display = "block";
                        if (errorContent.current) {
                            errorContent.current.textContent = "Password has been changed";
                        }
                    }
                    if (loginBlock.current) {
                        loginBlock.current.style.display = "block";
                    }
                    if (btnref.current) {
                        btnref.current.textContent = "Change Password";
                        btnref.current.style.opacity = "0.8";
                        btnref.current.disabled = true;
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
                    btnref.current.textContent = "Change Password";
                    btnref.current.style.opacity = "1";
                    btnref.current.disabled = false;
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
            <title>Password</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <div id="main-wrapper" className="w-fit border border-stone-800 rounded-lg p-4 mx-auto shadow-2xl">
                <div>
                    <h2 className="text-xl text-center">Change Password</h2>
                </div>
                {/* User Inputs */}
                <div className="flex flex-col justify-start gap-2.5 mt-8.5">
                    <div className="flex flex-col">
                        <label htmlFor="password">New Password</label>
                        <input value={Password.password} onChange={handleInput} type="text" required id="password" name="password" className="focus:ring-2 focus:ring-blue-500 focus:outline-none border border-stone-600 outline-none rounded-lg px-1.5 py-0.5" />
                    </div>
                    <div className="w-full">
                        <button className="w-full bg-blue-500 text-white py-1.5 rounded-lg cursor-pointer hover:bg-blue-600" ref={btnref} onClick={() => returnPassword()}>Change</button>
                    </div>
                    <div className="text-center">
                        <Link href="/" className="text-md underline text-blue-500">Go Home</Link>
                    </div>
                    <div ref={loginBlock} className="hidden">
                        <Link href="/login" className="text-md underline text-blue-500">Login Now</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}