import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../app/features/authSlice";

const Navbar =()=>{
    const {user}=useSelector(state=>state.auth);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const navigate = useNavigate()
    const location = useLocation();
    const dispatch = useDispatch();
    const isBuilderPage = location.pathname.startsWith('/app/builder/');

    const initials = (user?.name || "U")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const logoutUser =()=>{
        setMenuOpen(false);
        navigate('/')
        dispatch(logout());
    }

    const handleNavbarNavigation = (target) => {
        setMenuOpen(false);

        if (isBuilderPage) {
            window.dispatchEvent(
                new CustomEvent("resume-builder-navigation-request", {
                    detail: { target },
                })
            );
            return;
        }

        navigate(target);
    };

    return (
        <>
            <header className='sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/70'>
                <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-3.5 text-slate-800 transition-all">
                    <button onClick={() => handleNavbarNavigation('/app')} className="flex items-center gap-2" aria-label="Go to dashboard">
                        <img src="/logo.svg" alt="logo" className="h-11 w-auto"/>
                    </button>

                    <div className="hidden md:flex items-center gap-8 text-sm text-slate-700">
                        <button onClick={() => handleNavbarNavigation('/app#dashboard-top')} className="hover:text-green-600 transition">Dashboard</button>
                        <button onClick={() => handleNavbarNavigation('/app#resume-library')} className="hover:text-green-600 transition">Resumes</button>
                        <button onClick={() => handleNavbarNavigation('/app#dashboard-tips')} className="hover:text-green-600 transition">Tips</button>
                    </div>

                    <div className='hidden md:flex items-center gap-3 text-sm'>
                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
                            <span className="inline-flex items-center justify-center size-7 rounded-full bg-green-100 text-green-700 font-semibold text-xs">{initials}</span>
                            <span className="text-slate-700">{user?.name}</span>
                        </div>
                        <button onClick={logoutUser} className="inline-flex items-center gap-2 bg-white hover:bg-green-50 border border-slate-200 px-4 py-2 rounded-full active:scale-95 transition-all text-slate-700 hover:text-green-700">
                            <LogOut className="size-4" />
                            Logout
                        </button>
                    </div>

                    <button onClick={() => setMenuOpen(true)} className="md:hidden active:scale-95 transition p-2 rounded-lg border border-slate-200 bg-white" aria-label="Open menu">
                        <Menu className="size-5" />
                    </button>
                </nav>

                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
            </header>

            <div className={`fixed inset-0 z-[100] bg-black/35 backdrop-blur-sm flex flex-col items-center justify-center gap-6 md:hidden transition-all ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <button
                    onClick={() => setMenuOpen(false)}
                    className="absolute top-6 right-6 inline-flex items-center justify-center size-10 rounded-lg bg-white text-slate-700"
                    aria-label="Close menu"
                >
                    <X className="size-5" />
                </button>

                <button onClick={() => handleNavbarNavigation('/app#dashboard-top')} className="text-white text-xl font-medium">Dashboard</button>
                <button onClick={() => handleNavbarNavigation('/app#resume-library')} className="text-white text-xl font-medium">Resumes</button>
                <button onClick={() => handleNavbarNavigation('/app#dashboard-tips')} className="text-white text-xl font-medium">Tips</button>

                <button onClick={logoutUser} className="mt-4 px-6 py-2.5 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
                    Logout
                </button>
            </div>
        </>
    )
}

export default Navbar
