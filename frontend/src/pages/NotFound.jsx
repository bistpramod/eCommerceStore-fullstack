import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center overflow-hidden px-5 text-center">
      <div className="relative">
        <p className="text-[9rem] font-bold leading-none tracking-[-0.1em] text-[#e6e1d6] sm:text-[13rem]">404</p>
        <div className="relative -mt-8 sm:-mt-12">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e4572e]">Wrong turn</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">This page wandered off</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/50">The page you are looking for does not exist, but there are plenty of good things back at the shop.</p>
          <Link to="/" className="mt-7 inline-block rounded-full bg-[#1c1c1a] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#e4572e]">
            Return to shop
          </Link>
        </div>
      </div>
    </div>
  );
}
