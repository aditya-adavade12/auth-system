export default function Login() {
    return (
        <div>
            <title>Login Page</title>
            <div id="main-wrapper" className="text-black w-fit rounded-lg p-2 mx-auto">
                <div>
                    <h2 className="text-xl text-center">Login</h2>
                </div>
                <div className="flex flex-col justify-start gap-2.5">
                    <div className="flex flex-col">
                        <label htmlFor="username">Username</label>
                        <input type="text" required className="border border-black outline-none rounded-lg px-1.5 py-0.5 focus:ring-1" />
                    </div>
                    <div className="flex flex-row items-center justify-center">
                        <div className="flex flex-col">
                        <label htmlFor="username">Password</label>
                        <input type="password" required className="border border-black outline-none rounded-lg px-1.5 py-0.5 focus:ring-1"/>
                        </div>
                        <div><button>Show</button></div>
                    </div>
                    <div>
                        <a href="#">Forgot Password</a>
                    </div>
                    <div>
                        <button>Login Me</button>
                    </div>
                    <div>
                        <p>Not a Member? <a href="#">Register</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}