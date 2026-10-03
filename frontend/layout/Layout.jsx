import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../src/components/Navbar";

export default function Layout(){
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [location.pathname]);

    return(
        <div className="min-h-screen bg-[#f7f6f2] text-[#1c1c1a]">
            <Navbar />
            <main className="overflow-hidden">
                <div key={location.pathname} className="page-transition">
                    <Outlet />
                </div>
            </main>
            <footer className="border-t border-black/10 bg-[#1c1c1a] px-5 py-8 text-[#f7f6f2]">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-lg font-bold tracking-tight">VividVistaa</p>
                    <p className="text-white/60">Everyday finds, picked with care.</p>
                </div>
            </footer>
        </div>
    )
}
