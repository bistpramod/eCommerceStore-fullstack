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
    <div className="min-h-screen bg-[#fffdf9] text-[#19203a]">
      <Navbar />
      <main className="overflow-hidden"><div className={`page-transition ${transition}`}>{currentPage}</div></main>
      <footer className="border-t border-[#dfe2ed] bg-[#f0efff] px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr_0.6fr]">
            <div><div className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#ff5b57] to-[#7958e6] text-sm font-black text-white">V</span><p className="text-xl font-extrabold tracking-[-0.04em]">VividVistaa</p></div><p className="mt-4 max-w-sm text-sm font-medium leading-6 text-[#66708f]">Useful products, clear choices, and a checkout that gets out of your way.</p></div>
            <div><p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8991a8]">Shop</p><div className="mt-4 grid gap-3 text-sm font-bold"><Link to="/" className="hover:text-[#5368ef]">All products</Link><a href="/#categories" className="hover:text-[#5368ef]">Categories</a><Link to="/cart" className="hover:text-[#5368ef]">Your cart</Link></div></div>
            <div><p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8991a8]">Account</p><div className="mt-4 grid gap-3 text-sm font-bold"><Link to="/login" className="hover:text-[#5368ef]">Log in</Link><Link to="/signup" className="hover:text-[#5368ef]">Create account</Link></div></div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-[#d9d8ed] pt-5 text-xs font-semibold text-[#8991a8] sm:flex-row sm:items-center sm:justify-between"><p>© 2026 VividVistaa. All rights reserved.</p><p>Made for simple, confident shopping.</p></div>
        </div>
      </footer>
    </div>
  );
}
