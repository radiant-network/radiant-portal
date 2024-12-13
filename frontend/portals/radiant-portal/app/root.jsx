import {
    Links,
    Meta,
    Outlet,
    Scripts,
} from "@remix-run/react";
import Variant from "variant";

import styles from './styles/index.css?url';

export const links = () => [
    { rel: "stylesheet", href: styles },
];

export default function App() {
    return (
        <html>
            <head>
                <link
                    rel="icon"
                    href="data:image/x-icon;base64,AA"
                />
                <Meta />
                <Links />
            </head>
            <body className="h-screen flex flex-col">
                <header className="h-15 bg-gray-800 text-white flex items-center justify-between px-4">
                    <div className="flex space-x-3 items-center">
                        <div className="text-lg font-bold">My App</div>
                        <nav>
                            <a href="#" className="px-4 py-2 hover:bg-gray-700">Home</a>
                            <a href="#" className="px-4 py-2 hover:bg-gray-700">About</a>
                            <a href="#" className="px-4 py-2 hover:bg-gray-700">Contact</a>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <select className="text-white py-2 px-4">
                            <option>EN</option>
                            <option>FR</option>
                        </select>

                        <div className="relative">
                            <button className="py-2 px-3">Account</button>
                            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow hidden group-hover:block">
                                <a href="#" className="block px-4 py-2 hover:bg-gray-200">Profile</a>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-200">Settings</a>
                            </div>
                        </div>

                        <button className="text-white py-2 px-3 ">Logout</button>
                    </div>
                </header>
                <Variant api="test"/>
                <Outlet />

                <Scripts />
            </body>
        </html>
    );
}


