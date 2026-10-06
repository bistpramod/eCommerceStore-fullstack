import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useOutlet } from "react-router-dom";
import Navbar from "../src/components/Navbar";

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();
  const nextPage = useRef(outlet);
  const currentRoute = useRef(location.pathname + location.search);
  const [currentPage, setCurrentPage] = useState(outlet);
  const [transition, setTransition] = useState("page-visible");

  useEffect(() => { nextPage.current = outlet; }, [outlet]);
  useEffect(() => {
    const newRoute = location.pathname + location.search;
    if (newRoute === currentRoute.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leaveTime = reduceMotion ? 0 : 180;
    let enterFrame;
    let visibleFrame;
    const leaveFrame = requestAnimationFrame(() => setTransition("page-leave"));
    const pageTimer = setTimeout(() => {
      currentRoute.current = newRoute;
      window.scrollTo(0, 0);
      setCurrentPage(nextPage.current);
      setTransition("page-enter");
      enterFrame = requestAnimationFrame(() => { visibleFrame = requestAnimationFrame(() => setTransition("page-visible")); });
    }, leaveTime);
    return () => { cancelAnimationFrame(leaveFrame); cancelAnimationFrame(enterFrame); cancelAnimationFrame(visibleFrame); clearTimeout(pageTimer); };
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-white text-[#100e17]">
      <Navbar />
      <main className="overflow-hidden"><div className={`page-transition ${transition}`}>{currentPage}</div></main>
      <footer className="border-t border-[#2d2937] bg-[#100e17] px-5 py-12 text-white">
        <div className="mx-auto grid max-w-[1160px] gap-9 sm:grid-cols-[1fr_auto] sm:items-end">
          <div><p className="text-2xl font-bold tracking-[-0.04em]">VividVistaa<span className="text-[#ff6a4c]">.</span></p><p className="mt-3 max-w-sm text-sm leading-6 text-white/55">A considered collection of useful things for real life.</p></div>
          <div className="flex flex-wrap gap-6 text-sm font-semibold text-white/65"><Link to="/" className="hover:text-white">Shop</Link><Link to="/cart" className="hover:text-white">Cart</Link><Link to="/login" className="hover:text-white">Account</Link></div>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1160px] flex-col gap-2 border-t border-white/12 pt-5 font-mono text-[10px] uppercase tracking-[0.09em] text-white/40 sm:flex-row sm:justify-between"><p>© 2026 VividVistaa</p><p>Selected slowly · Delivered simply</p></div>
      </footer>
    </div>
  );
}
