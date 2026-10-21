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
      <main className="overflow-hidden">
        <div className={`page-transition ${transition}`}>{currentPage}</div>
      </main>

      <footer className="border-t border-[#deddd6] bg-[#efeee9] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-16">
            <div className="sm:col-span-2 lg:col-span-6 lg:pr-12">
              <div className="flex items-center gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#171813] text-xs font-bold text-white">
                  VV
                </span>
                <p className="text-xl font-semibold tracking-[-0.04em]">VividVistaa</p>
              </div>
              <p className="mt-6 max-w-md text-sm leading-7 text-[#686960]">
                A considered selection of useful products for everyday life.
              </p>
            </div>

            <div className="lg:col-span-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a8b82]">Shop</p>
              <nav className="mt-6 grid gap-4 text-sm font-medium" aria-label="Footer shop navigation">
                <Link to="/" className="w-fit transition-colors hover:text-[#6f7655]">All products</Link>
                <a href="/#categories" className="w-fit transition-colors hover:text-[#6f7655]">Categories</a>
                <Link to="/cart" className="w-fit transition-colors hover:text-[#6f7655]">Your cart</Link>
              </nav>
            </div>

            <div className="lg:col-span-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a8b82]">Account</p>
              <nav className="mt-6 grid gap-4 text-sm font-medium" aria-label="Footer account navigation">
                <Link to="/login" className="w-fit transition-colors hover:text-[#6f7655]">Log in</Link>
                <Link to="/signup" className="w-fit transition-colors hover:text-[#6f7655]">Create account</Link>
              </nav>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-3 border-t border-[#d8d7d0] pt-6 text-xs leading-5 text-[#85867e] sm:flex-row sm:items-center sm:justify-between lg:mt-20">
            <p>© 2026 VividVistaa. All rights reserved.</p>
            <p>Considered goods. Straightforward shopping.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
