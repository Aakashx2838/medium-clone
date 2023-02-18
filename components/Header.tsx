import Link from "next/link"

function Header() {
    return (
        <header className="flex justify-between items-center p-5 max-w-7xl mx-auto">
            <div className="flex items-center space-x-5">
                <Link href="/">
                    <img src="https://links.papareact.com/yvf" className="w-44 object-contain cursor-pointer" alt="medium-logo" />
                </Link>
                <div className="hidden md:inline-flex items-center space-x-5">
                    <h1 className="">About</h1>
                    <h1 className="">Contact</h1>
                    <h1 className="text-white bg-green-600 px-4 py-1 rounded-full hover:bg-green-700">Follow</h1>
                </div>
            </div>
            <div className="flex items-center space-x-5 text-green-500">
                <h3>
                    Sign In
                </h3>
                <h3 className="border px-4 py-1 rounded-full">
                    Get Started
                </h3>
            </div>
        </header>
    )
}

export default Header