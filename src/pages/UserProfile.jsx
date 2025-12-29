import { useParams, useNavigate } from 'react-router-dom';
import { users } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Github, Linkedin, Facebook, ArrowLeft, MessageSquare, UserPlus, Mail, GraduationCap, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = users.find(u => u.id === id);

    if (!user) {
        return <div className="p-8 text-center text-slate-500 dark:text-slate-400">User not found</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-8 pb-12"
        >
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Search
            </Button>

            {/* Profile Header / Banner */}
            <div className="relative">
                <div className="h-48 md:h-64 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                </div>

                <div className="absolute -bottom-16 left-8 md:left-12 flex items-end">
                    <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-5xl font-bold text-slate-300 dark:text-slate-600 bg-slate-100 dark:bg-slate-800">
                                {user.name[0]}
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute top-4 right-4 md:top-auto md:bottom-4 md:right-8 flex gap-3">
                    <Button className="shadow-lg backdrop-blur-md bg-supnum-blue hover:bg-blue-600 text-white border-none">
                        <UserPlus className="mr-2 h-4 w-4" /> Connect
                    </Button>
                    <Button variant="outline" className="shadow-lg backdrop-blur-md bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 border-none text-slate-900 dark:text-white">
                        <MessageSquare className="mr-2 h-4 w-4" /> Message
                    </Button>
                </div>
            </div>

            <div className="pt-16 grid gap-8 lg:grid-cols-[1fr_350px]">
                {/* Main Content */}
                <div className="space-y-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{user.supnumId} • <span className="capitalize text-supnum-blue dark:text-blue-400">{user.role}</span></p>
                        <div className="flex items-center text-slate-400 dark:text-slate-500 text-sm pt-1">
                            <MapPin className="h-4 w-4 mr-1" /> Nouakchott, Mauritania
                        </div>
                    </div>

                    <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-white">About</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                {user.bio || "This user hasn't written a bio yet."}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-white">Academic Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Department</p>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200">Computer Science</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Entry Year</p>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                                        {user.supnumId?.startsWith('2') ? `20${user.supnumId.substring(0, 2)}` : 'Unknown'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-white">Contact Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                                    <Mail className="h-5 w-5 text-supnum-blue dark:text-blue-400" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Email</p>
                                    <p className="text-sm font-medium truncate text-slate-900 dark:text-slate-200" title={user.email}>{user.email}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-white">Social Profiles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-3">
                                {user.social?.linkedin && (
                                    <a href={user.social.linkedin} target="_blank" rel="noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                                        <Linkedin className="h-5 w-5 text-[#0077b5]" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-[#0077b5]">LinkedIn Profile</span>
                                    </a>
                                )}
                                {user.social?.github && (
                                    <a href={user.social.github} target="_blank" rel="noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                                        <Github className="h-5 w-5 text-slate-900 dark:text-white" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">GitHub Profile</span>
                                    </a>
                                )}
                                {user.social?.facebook && (
                                    <a href={user.social.facebook} target="_blank" rel="noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                                        <Facebook className="h-5 w-5 text-[#1877F2]" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-[#1877F2]">Facebook Profile</span>
                                    </a>
                                )}
                                {!user.social?.linkedin && !user.social?.github && !user.social?.facebook && (
                                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">No public social links.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
