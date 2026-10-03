import { useEffect, useRef, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import Navbar from "../src/components/Navbar";

export default function Layout(){
    const location = useLocation();
    const outlet = useOutlet();
    const nextPage = useRef(outlet);
    const currentRoute = useRef(location.pathname + location.search);

    const [currentPage, setCurrentPage] = useState(outlet);
    const [transition, setTransition] = useState("page-visible");

    useEffect(() => {
        nextPage.current = outlet;
    }, [outlet]);

    useEffect(() => {
        const newRoute = location.pathname + location.search;

        if (newRoute === currentRoute.current) {
            return;
        }

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const leaveTime = reduceMotion ? 0 : 180;
        let enterFrame;
        let visibleFrame;

        const leaveFrame = requestAnimationFrame(() => {
            setTransition("page-leave");
        });

        const pageTimer = setTimeout(() => {
            currentRoute.current = newRoute;
            window.scrollTo(0, 0);
            setCurrentPage(nextPage.current);
            setTransition("page-enter");

            enterFrame = requestAnimationFrame(() => {
                visibleFrame = requestAnimationFrame(() => {
                    setTransition("page-visible");
                });
            });
        }, leaveTime);

        return () => {
            cancelAnimationFrame(leaveFrame);
            cancelAnimationFrame(enterFrame);
            cancelAnimationFrame(visibleFrame);
            clearTimeout(pageTimer);
        };
    }, [location.pathname, location.search]);

    return(
        <div className="min-h-screen bg-[#f7f6f2] text-[#1c1c1a]">
            <Navbar />
            <main className="overflow-hidden">
                <div className={`page-transition ${transition}`}>
                    {currentPage}
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
