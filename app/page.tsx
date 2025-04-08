import Link from "next/link";

export default function Page() {
  return (
    <div>
      <title>Home</title>
      <div id="card" className="mt-24">
        <h1 className="text-center text-3xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">Use Below Links to Navigate.</h1>
          <div className="flex flex-row gap-4 text-xl mx-auto justify-center font-medium mt-8">
            <Link href="/login" className="hover:underline text-blue-500 hover:opacity-75">Login</Link>
            <Link href="/signup" className="hover:underline text-blue-500 hover:opacity-75">Signup</Link>
          </div>
        </div>      
    </div>
  )
}