import { Link } from "react-router"

const Error = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Page not found</h1>
                <p className="text-gray-700 mb-2">Sorry, we could not find the page you are looking for.</p>
                <p>
                    <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded">Go back to the homepage</Link>
                </p>
            </div>
        </div>
    )
}

export default Error