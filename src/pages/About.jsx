export function About() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-center mb-8 text-slate-900 dark:text-white">About SupNum Connect</h1>
            <div className="prose prose-slate dark:prose-invert mx-auto lg:prose-lg">
                <p className="lead text-xl text-slate-600 dark:text-slate-300 text-center mb-12">
                    SupNum Connect is the official social-academic network for the Institut Supérieur Numérique (SupNum).
                </p>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Our Mission</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            To create a vibrant, interconnected community where students, graduates, and administrators can collaborate, share knowledge, and grow together. We believe in the power of networking to unlock new opportunities and foster academic excellence.
                        </p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-2xl">
                        <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Key Goals</h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                            <li>Connect current students with alumni</li>
                            <li>Facilitate mentorship and guidance</li>
                            <li>Centralize campus events and news</li>
                            <li>Showcase student achievements</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-supnum-blue text-white p-12 rounded-3xl text-center shadow-xl">
                    <h2 className="text-3xl font-bold mb-6">Built by Students, for Students</h2>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        This platform was created as a project by SupNum students, demonstrating the technical skills and innovation fostered at our institute.
                    </p>
                    <div className="mt-8 pt-8 border-t border-blue-400/30 flex justify-center space-x-12">
                        <div>
                            <div className="text-3xl font-bold">2024</div>
                            <div className="text-blue-200 text-sm">Founded</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">SupNum</div>
                            <div className="text-blue-200 text-sm">Institute</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
