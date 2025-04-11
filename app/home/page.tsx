export default function Home() {
    return (
       <div>
        <div className="mx-auto flex flex-col justify-center items-center gap-1.5 mt-24 rounded-lg border border-stone-800 shadow-2xl w-fit p-2">
            <h2 className="text-4xl font-semibold">You're on Home</h2>
            <p className="text-stone-500 font-medium">*This page only fetches when your login.</p>
            <div>
                <button className="hover:underline font-medium text-xl cursor-pointer text-blue-500">Logout</button>
            </div>
        </div>
       </div>
    )
}
