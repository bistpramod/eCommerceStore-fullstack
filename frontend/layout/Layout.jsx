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
    <div className="min-h-screen bg-[#f7f6f2] text-[#171813]">
      <Navbar />
      <main className="overflow-hidden"><div className={`page-transition ${transition}`}>{currentPage}</div></main>
      <footer className="border-t border-[#deddd6] bg-[#efeee9] px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr_0.6fr]">
            <div><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#171813] text-xs font-bold text-white">VV</span><p className="text-xl font-semibold tracking-[-0.04em]">VividVistaa</p></div><p className="mt-4 max-w-sm text-sm leading-6 text-[#686960]">A considered selection of useful products for everyday life.</p></div>
            <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a8b82]">Shop</p><div className="mt-4 grid gap-3 text-sm font-medium"><Link to="/" className="hover:text-[#6f7655]">All products</Link><a href="/#categories" className="hover:text-[#6f7655]">Categories</a><Link to="/cart" className="hover:text-[#6f7655]">Your cart</Link></div></div>
            <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a8b82]">Account</p><div className="mt-4 grid gap-3 text-sm font-medium"><Link to="/login" className="hover:text-[#6f7655]">Log in</Link><Link to="/signup" className="hover:text-[#6f7655]">Create account</Link></div></div>
          </div>
          <div className="mt-12 flex flex-col gap-2 border-t border-[#d8d7d0] pt-5 text-xs text-[#85867e] sm:flex-row sm:items-center sm:justify-between"><p>© 2026 VividVistaa. All rights reserved.</p><p>Considered goods. Straightforward shopping.</p></div>
        </div>
      </footer>
    </div>
  );
}
