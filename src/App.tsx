export default function App() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
            <header className="border-b border-slate-800 px-6 py-4">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <span className="text-sm font-semibold tracking-wider text-slate-300">
                        Oleksandr Misiuk
                    </span>
                    <span className="text-xs text-slate-400">Software Engineer</span>
                </div>
            </header>
            <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-6 py-16">
                <section aria-labelledby="hero-heading" className="space-y-6 text-center">
                    <h1 id="hero-heading" className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        Oleksandr Misiuk
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-slate-300 sm:text-xl">
                        I build fast, thoughtful interfaces that people enjoy using.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="inline-flex items-center rounded-md bg-blue-600/20 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-blue-500/30 ring-inset">
                            Wrocław, Poland · Open to opportunities
                        </span>
                    </div>
                </section>
            </main>
            <footer className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-400">
                © {new Date().getFullYear()} Oleksandr Misiuk. All rights reserved.
            </footer>
        </div>
    );
}
