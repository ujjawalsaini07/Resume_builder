import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Lock, Mail, User } from "lucide-react";
import { useDispatch } from "react-redux";
import api from "../configs/api.js";
import { login } from "../app/features/authSlice.js";
import toast from "react-hot-toast";


const Login =()=>{

    const dispatch=useDispatch();//get the dispatch function from the redux store
    const location = useLocation();
    const navigate = useNavigate();

    const [state, setState] = React.useState('login')
    const isRegister = state === "register";

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })

    const [isDemoLoading, setIsDemoLoading] = React.useState(false);

    const demoAccount = {
        email: 'user@example.com',
        password: '12345678',
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            const {data} = await api.post(`/api/users/${state}`, formData);
            dispatch(login(data));
            localStorage.setItem('token', data.token);
            toast.success(data.message);

        }
        catch (error) {
            console.log(error.message);
            toast.error(error?.response?.data?.message || error.message || "Something went wrong");
        }

    }

    React.useEffect(() => {
        const query = new URLSearchParams(location.search);
        const urlState = query.get("state");
        setState(urlState === "register" ? "register" : "login");
    }, [location.search]);

    const switchMode = (nextMode) => {
        setState(nextMode);
        navigate(`/app?state=${nextMode}`);
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleDemoLogin = async () => {
        try {
            setIsDemoLoading(true);
            const { data } = await api.post('/api/users/login', demoAccount);
            dispatch(login(data));
            localStorage.setItem('token', data.token);
            toast.success('Logged in with demo account');
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || 'Demo login failed');
        } finally {
            setIsDemoLoading(false);
        }
    };


    return(
        <div id='login' className="min-h-screen bg-gradient-to-b from-white via-green-50/40 to-white">
            <div className="min-h-screen grid lg:grid-cols-2">
                <section className="hidden lg:flex items-center relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 text-white px-12 py-8 xl:px-16 xl:py-10">
                    <div className="absolute -top-16 -left-10 size-72 rounded-full bg-white/10"></div>
                    <div className="absolute bottom-8 right-6 size-72 rounded-full bg-white/10"></div>

                    <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col gap-7">
                        <div>
                            <a href="/" className="inline-flex">
                                <img src="/logo.svg" alt="Logo" className="h-11 w-auto"/>
                            </a>

                            <h2 className="text-5xl font-semibold leading-tight mt-6 max-w-lg">
                                {isRegister ? "Build interview-ready resumes faster" : "Welcome back to your resume workspace"}
                            </h2>

                            <p className="mt-5 text-lg text-white/90 max-w-lg leading-relaxed">
                                {isRegister
                                    ? "Create your account to write stronger summaries, improve experience bullets, and customize templates in minutes."
                                    : "Continue editing your resumes, track progress, and keep each application version ready to send."}
                            </p>

                            <div className="mt-7 space-y-4 text-white/95">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="size-5" />
                                    <span>ATS-friendly resume templates</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="size-5" />
                                    <span>AI-enhanced summaries and experience writing</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="size-5" />
                                    <span>Live preview and quick export workflow</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur px-6 py-5 max-w-xl">
                            <p className="text-lg italic leading-relaxed">
                                "This builder helped me turn scattered experience into a resume that got interview callbacks within a week."
                            </p>
                            <p className="text-sm mt-3 text-white/85">Ananya, Software Engineer Candidate</p>
                        </div>
                    </div>
                </section>

                <section className="flex items-center justify-center px-5 py-10 sm:px-8">
                    <div className="w-full max-w-md">
                        <div className="lg:hidden mb-8 text-center">
                            <a href="/" className="inline-flex justify-center">
                                <img src="/logo.svg" alt="Logo" className="h-11 w-auto"/>
                            </a>
                        </div>

                        <div className="rounded-2xl bg-white/90 p-6 sm:p-7 shadow-sm">
                            <div className="mb-6">
                                <h1 className="text-2xl font-semibold text-slate-900">
                                    {isRegister ? "Create your account" : "Sign in to your account"}
                                </h1>
                                <p className="text-slate-600 mt-1.5 text-sm">
                                    {isRegister
                                        ? "Start building resumes in minutes."
                                        : "Enter your details to continue."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => toast("Google sign-in will be available soon")}
                                className="w-full h-11 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 font-medium flex items-center justify-center gap-3"
                            >
                                <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.4 12 2.4 6.9 2.4 2.8 6.5 2.8 11.6S6.9 20.8 12 20.8c6.9 0 9.1-4.8 9.1-7.3 0-.5-.1-.9-.1-1.3H12z" />
                                    <path fill="#34A853" d="M3.8 7.4l3.2 2.3c.8-1.6 2.5-2.7 5-2.7 1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.4 12 2.4 8.4 2.4 5.3 4.4 3.8 7.4z" />
                                    <path fill="#FBBC05" d="M12 20.8c2.6 0 4.8-.9 6.4-2.5l-3-2.4c-.8.6-1.9 1.1-3.4 1.1-2.4 0-4.4-1.6-5.2-3.8l-3.3 2.5c1.5 3 4.6 5.1 8.5 5.1z" />
                                    <path fill="#4285F4" d="M21.1 13.5c0-.5-.1-.9-.1-1.3H12v3.9h5.5c-.3 1.2-1.1 2.2-2.1 2.8l3 2.4c1.7-1.5 2.7-3.8 2.7-6.8z" />
                                </svg>
                                Continue with Google
                            </button>

                            <p className="text-center text-sm text-slate-500 my-4">or continue with email</p>

                            <form onSubmit={handleSubmit} className="space-y-3.5">
                                {isRegister && (
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700">Full name</span>
                                        <div className="mt-1.5 flex items-center gap-2 px-3 h-11 bg-slate-100 rounded-lg transition-colors focus-within:bg-slate-50">
                                            <User className="size-4 text-slate-500" />
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Your full name"
                                                className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 shadow-none text-slate-800"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </label>
                                )}

                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">Email address</span>
                                    <div className="mt-1.5 flex items-center gap-2 px-3 h-11 bg-slate-100 rounded-lg transition-colors focus-within:bg-slate-50">
                                        <Mail className="size-4 text-slate-500" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 shadow-none text-slate-800"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </label>

                                <label className="block">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">Password</span>
                                        {!isRegister && (
                                            <button
                                                className="text-sm text-green-700 hover:text-green-800"
                                                type="button"
                                                onClick={()=>toast("Password reset feature is coming soon")}
                                            >
                                                Forgot password?
                                            </button>
                                        )}
                                    </div>

                                    <div className="mt-1.5 flex items-center gap-2 px-3 h-11 bg-slate-100 rounded-lg transition-colors focus-within:bg-slate-50">
                                        <Lock className="size-4 text-slate-500" />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Enter password"
                                            className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 shadow-none text-slate-800"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </label>

                                <button type="submit" className="w-full h-11 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors font-medium">
                                    {isRegister ? "Create account" : "Sign in"}
                                </button>
                            </form>

                            {!isRegister && (
                                <div className="mt-3 rounded-lg bg-slate-100 p-3">
                                    <p className="text-xs text-slate-500 mb-2 text-center">Demo Account Login</p>
                                    <button
                                        type="button"
                                        onClick={handleDemoLogin}
                                        disabled={isDemoLoading}
                                        className="w-full h-11 rounded-lg bg-white hover:bg-slate-50 transition-colors text-slate-700 font-medium border border-slate-200 disabled:opacity-60"
                                    >
                                        {isDemoLoading ? 'Logging in...' : 'Login with Demo Account'}
                                    </button>
                                </div>
                            )}

                            <div className="mt-4 flex items-center justify-center gap-1 text-sm text-slate-600">
                                <span>{isRegister ? "Already have an account?" : "Don't have an account?"}</span>
                                <button
                                    type="button"
                                    onClick={() => switchMode(isRegister ? "login" : "register")}
                                    className="text-green-700 hover:text-green-800 font-medium"
                                >
                                    {isRegister ? "Sign in" : "Create one"}
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 text-center text-sm text-slate-600">
                            <Link to="/" className="hover:text-slate-800">Back to home</Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Login
