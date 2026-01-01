import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { FileText, User as UserIcon, Calendar, Building, Link as LinkIcon, CheckCircle, XCircle, Clock, Phone, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../services/api';

export function ManageApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/applications');
            setApplications(response.applications);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await apiClient.patch(`/applications/${id}/status`, { status });
            fetchApplications();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const filteredApplications = applications.filter(app =>
        filter === 'all' || app.status === filter
    );

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Job Applications</h1>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    {['all', 'pending', 'accepted', 'rejected'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === s ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6">
                {filteredApplications.length > 0 ? filteredApplications.map((app) => (
                    <Card key={app.id} className="bg-white dark:bg-slate-800 border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                        <CardHeader className="border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                            {app.internship?.title}
                                        </CardTitle>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <Building className="h-4 w-4" /> {app.internship?.company}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-end gap-1">
                                        <UserIcon className="h-4 w-4" /> {app.user?.name}
                                    </p>
                                    <p className="text-xs text-slate-400 flex items-center justify-end gap-1">
                                        <Clock className="h-3 w-3" /> {new Date(app.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Applicant Contact & Message</h4>
                                    <div className="flex flex-wrap gap-4 mb-3">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg">
                                            <Mail className="h-4 w-4 text-blue-500" /> {app.email}
                                        </div>
                                        {app.phone && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg">
                                                <Phone className="h-4 w-4 text-blue-500" /> {app.phone}
                                            </div>
                                        )}
                                    </div>
                                    {app.message && (
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl italic">
                                            "{app.message}"
                                        </p>
                                    )}
                                </div>

                                {app.customAnswers && Object.keys(app.customAnswers).length > 0 && (
                                    <div className="pt-4 space-y-3">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Additional Questions</h4>
                                        <div className="grid gap-3">
                                            {Object.entries(app.customAnswers).map(([question, answer]) => (
                                                <div key={question} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{question}</p>
                                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                                        {typeof answer === 'string' && answer.startsWith('http') ? (
                                                            <a href={answer} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                                                                {answer} <LinkIcon className="h-3 w-3" />
                                                            </a>
                                                        ) : answer}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                                    {app.cvUrl ? (
                                        <a
                                            href={app.cvUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm group"
                                        >
                                            <div className="p-2 bg-blue-50 group-hover:bg-blue-100 rounded-lg transition-colors">
                                                <LinkIcon className="h-4 w-4" />
                                            </div>
                                            View CV / Portfolio
                                        </a>
                                    ) : (
                                        <div className="text-slate-400 text-sm italic">No CV provided</div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 border-red-100 hover:bg-red-50"
                                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                            disabled={app.status === 'rejected'}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleStatusUpdate(app.id, 'accepted')}
                                            disabled={app.status === 'accepted'}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" /> Accept
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No applications found</h3>
                        <p className="text-slate-500">Applications for internships and jobs will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
