import React, { useState, useEffect } from 'react';
import { Briefcase, Building, X, Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { DatePicker } from './ui/DatePicker';

const DEFAULT_FORM_DATA = {
    title: '',
    company: '',
    type: 'Internship',
    location: '',
    active: true,
    description: '',
    customQuestions: [],
    requireCv: true,
    requireMessage: true,
    requirePhone: true,
    targetAudience: 'All',
    startDate: '',
    endDate: '',
    workplaceType: 'On-site'
};

export default function InternshipForm({ 
    initialData, 
    onSubmit, 
    onClose, 
    t, 
    isCompany = false,
    isGraduate = false,
    companyName = '',
    companyDisabled = false
}) {
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...DEFAULT_FORM_DATA,
                ...initialData,
                startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
                endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : ''
            });
        } else if ((isCompany || isGraduate) && companyName) {
            setFormData(prev => ({ ...prev, company: companyName }));
        }
    }, [initialData, isCompany, isGraduate, companyName]);

    if (!t) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isEditing = !!initialData;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {isEditing ? t.admin.manageInternships.editOpportunity : t.admin.manageInternships.postOpportunity}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.admin.manageInternships.form.basicInfo}</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.jobTitle}</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                    <Input
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Lead Developer"
                                        className="pl-10 bg-white dark:bg-slate-900 border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.company}</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <Building className="h-4 w-4" />
                                    </div>
                                    <Input
                                        required
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="e.g. SupNum Tech"
                                        disabled={companyDisabled}
                                        className="pl-10 bg-white dark:bg-slate-900 border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.admin.manageInternships.form.details}</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.type}</label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    >
                                        <option value="Internship">{t.admin.manageInternships.filterTypes?.internship || 'Stage'}</option>
                                        <option value="Job">{t.admin.manageInternships.filterTypes?.job || 'Emploi'}</option>
                                        <option value="Training">{t.admin.manageInternships.filterTypes?.training || 'Formation'}</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.targetAudience}</label>
                                    <select
                                        className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        value={formData.targetAudience}
                                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                    >
                                        <option value="All">{t.admin.manageInternships.form.audiences?.all}</option>
                                        <option value="Students">{t.admin.manageInternships.form.audiences?.students}</option>
                                        <option value="Graduates">{t.admin.manageInternships.form.audiences?.graduates}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.workplaceType}</label>
                                    <select
                                        className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        value={formData.workplaceType}
                                        onChange={(e) => setFormData({ ...formData, workplaceType: e.target.value })}
                                    >
                                        <option value="On-site">{t.admin.manageInternships.form.workplace?.onSite}</option>
                                        <option value="Remote">{t.admin.manageInternships.form.workplace?.remote}</option>
                                        <option value="Hybrid">{t.admin.manageInternships.form.workplace?.hybrid}</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.location}</label>
                                    <Input
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g. Nouakchott"
                                        className="bg-white dark:bg-slate-900 border-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.startDate}</label>
                                    <DatePicker
                                        value={formData.startDate}
                                        onChange={(date) => setFormData({ ...formData, startDate: date })}
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.endDate}</label>
                                    <DatePicker
                                        value={formData.endDate}
                                        onChange={(date) => setFormData({ ...formData, endDate: date })}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-4">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t.admin.manageInternships.form.appRequirements}</label>
                            <div className="grid grid-cols-2 gap-y-3">
                                {[
                                    ['requireCv', t.admin.manageInternships.form.requireCv],
                                    ['requireMessage', t.admin.manageInternships.form.requireMessage],
                                    ['requirePhone', t.admin.manageInternships.form.requirePhone],
                                    ['active', t.admin.manageInternships.form.activeListing, true]
                                ].map(([id, label, isBlue]) => (
                                    <div key={id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={id}
                                            checked={formData[id]}
                                            onChange={(e) => setFormData({ ...formData, [id]: e.target.checked })}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor={id} className={`text-sm ${isBlue ? 'font-bold text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t.admin.manageInternships.form.customQuestions}</label>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setFormData({ ...formData, customQuestions: [...(formData.customQuestions || []), { label: '', type: 'text', required: true }] })}
                                    className="h-8 text-xs"
                                >
                                    <Plus className="h-3 w-3 mr-1" /> {t.admin.manageInternships.form.addQuestion}
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {(formData.customQuestions || []).map((q, idx) => (
                                    <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl space-y-2 relative group border border-slate-100 dark:border-slate-800">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newQs = [...formData.customQuestions];
                                                newQs.splice(idx, 1);
                                                setFormData({ ...formData, customQuestions: newQs });
                                            }}
                                            className="absolute -right-2 -top-2 h-6 w-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                        <Input
                                            required
                                            placeholder={t.admin.manageInternships.form.questionLabel}
                                            value={q.label}
                                            onChange={(e) => {
                                                const newQs = [...formData.customQuestions];
                                                newQs[idx].label = e.target.value;
                                                setFormData({ ...formData, customQuestions: newQs });
                                            }}
                                            className="h-9 text-sm"
                                        />
                                        <div className="flex gap-2">
                                            <select
                                                className="flex-1 h-8 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs"
                                                value={q.type}
                                                onChange={(e) => {
                                                    const newQs = [...formData.customQuestions];
                                                    newQs[idx].type = e.target.value;
                                                    setFormData({ ...formData, customQuestions: newQs });
                                                }}
                                            >
                                                <option value="text">Short Text</option>
                                                <option value="url">URL Link</option>
                                                <option value="textarea">Long Text</option>
                                                <option value="select">Dropdown Choice</option>
                                            </select>
                                            {q.type === 'select' && (
                                                <Input
                                                    placeholder={t.admin.manageInternships.form.options}
                                                    value={q.options || ''}
                                                    onChange={(e) => {
                                                        const newQs = [...formData.customQuestions];
                                                        newQs[idx].options = e.target.value;
                                                        setFormData({ ...formData, customQuestions: newQs });
                                                    }}
                                                    className="h-8 text-[10px] mt-1"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {(!formData.customQuestions || formData.customQuestions.length === 0) && (
                                    <p className="text-xs text-slate-400 italic text-center py-2">No custom questions added.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">{t.admin.manageInternships.form.cancel}</Button>
                        <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                            {isEditing ? t.admin.manageInternships.form.saveChanges : t.admin.manageInternships.postOpportunity}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
