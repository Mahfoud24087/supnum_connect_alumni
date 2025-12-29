import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { GraduationCap, User, Mail, Lock, Hash, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function SignUp() {
    const [formData, setFormData] = useState({
        fullName: '',
        supnumId: '',
        email: '',
        password: '',
        role: 'graduate'
    });
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(formData);
        navigate('/signin');
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-slate-900">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900 to-blue-800 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40" />

                <div className="relative z-10">
                    <div className="flex items-center space-x-3 text-white">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <GraduationCap className="h-8 w-8" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">SupNum Connect</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg space-y-8">
                    <h2 className="text-4xl font-bold text-white leading-tight">
                        Join the elite network of SupNum graduates.
                    </h2>
                    <div className="space-y-4">
                        {[
                            'Connect with alumni and industry leaders',
                            'Access exclusive job and internship opportunities',
                            'Participate in professional events and workshops',
                            'Mentor the next generation of students'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center space-x-3 text-blue-100">
                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-blue-200 text-sm">
                    © 2024 SupNum. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create your account</h1>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                            Start your journey with SupNum Connect today
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input name="fullName" placeholder="John Doe" required onChange={handleChange} className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SupNum ID</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input name="supnumId" placeholder="2YXXX" required onChange={handleChange} className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <Input name="email" type="email" placeholder="name@example.com" required onChange={handleChange} className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <Input name="password" type="password" placeholder="••••••••" required onChange={handleChange} className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button type="submit" className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]">
                                Create Account <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </form>

                    <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link to="/signin" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
