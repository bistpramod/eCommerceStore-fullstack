import { Link, useParams } from "react-router-dom";

export default function OrderSuccess() {
    const { id } = useParams();

    return (
        <div className="flex min-h-[75vh] items-center justify-center px-5 py-14">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-[#dfe8d2] p-7 text-center sm:p-12">
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#f4b942]" />
                <div className="relative">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#4f7b53] text-3xl text-white">✓</div>
                    <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-black/45">Order confirmed</p>
                    <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">Thank you for your order</h1>
                    <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/55">
                        Your order has been placed successfully. Keep the order number below for your reference.
                    </p>
                    <div className="mx-auto mt-7 max-w-lg rounded-2xl border border-black/10 bg-white/70 p-5 backdrop-blur">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Order number</p>
                        <p className="mt-2 break-all font-mono text-sm font-bold">{id}</p>
                    </div>
                    <Link to="/" className="mt-8 inline-block rounded-full bg-[#1c1c1a] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#e4572e]">
                        Continue shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
