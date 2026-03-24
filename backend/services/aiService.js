const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdf = require('pdf-parse');

// Load API Key from environment (checks for placeholder)
const API_KEY = process.env.GEMINI_API_KEY;
const isPlaceholder = !API_KEY || API_KEY === 'your_api_key_here' || API_KEY.startsWith('your_');
const genAI = !isPlaceholder ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Parses text from a PDF Buffer
 * @param {Buffer} buffer 
 * @returns {Promise<string>}
 */
const extractTextFromPDF = async (buffer) => {
    try {
        console.log(`[AI SERVICE] Parsing PDF. Buffer size: ${buffer.length} bytes`);
        
        // Basic PDF Validation: Check if it starts with %PDF
        const header = buffer.toString('utf8', 0, 4);
        console.log(`[AI SERVICE] File header: ${header}`);
        if (header !== '%PDF') {
            console.error('[AI SERVICE] Invalid PDF header. Check base64 decoding.');
        }

        let extractedText = "";
        if (typeof pdf === 'function') {
            // Classic pdf-parse (v1.1.1)
            const data = await pdf(buffer);
            extractedText = data.text || "";
        } else if (pdf && pdf.PDFParse) {
            // Modern pdf-parse (v2.x)
            const parser = new pdf.PDFParse({ data: buffer });
            const result = await parser.getText();
            extractedText = result.text || "";
            await parser.destroy();
        } else {
            console.error('[AI SERVICE] PDF Parsing library not correctly initialized.');
        }

        extractedText = extractedText.replace(/\0/g, '').trim();
        console.log(`[AI SERVICE] Extracted text length: ${extractedText.length} characters`);
        return extractedText;
    } catch (error) {
        console.error('[AI SERVICE] CRITICAL PDF Parsing Error:', error);
        return ""; 
    }
};

/**
 * AI Resume Parser - Extract Skills and Professional Summary
 */
const parseResume = async (pdfBuffer) => {
    let text = "";
    try {
        if (typeof pdf === 'function') {
            // Classic pdf-parse (v1.1.1)
            const data = await pdf(pdfBuffer);
            text = data.text || "";
        } else if (pdf && pdf.PDFParse) {
            // Modern pdf-parse (v2.x)
            const parser = new pdf.PDFParse({ data: pdfBuffer });
            const result = await parser.getText();
            text = result.text || "";
            await parser.destroy();
        }

        text = text.replace(/\0/g, '').trim();
        console.log(`[AI SERVICE] Extracted text length: ${text.length} characters`);
        
        if (!text || text.length < 10) {
            return { 
                skills: [], 
                bio: "Le texte du CV n'a pas pu être extrait (le PDF est peut-être une image)." 
            };
        }

        if (!genAI) {
            console.log('AI Key missing or placeholder, using keyword fallback');
            const commonSkills = [
                'React', 'Node.js', 'Node', 'Python', 'Java', 'SQL', 'JavaScript', 'JS', 'TypeScript', 'TS',
                'HTML', 'CSS', 'Tailwind', 'Git', 'Cisco', 'Linux', 'Ubuntu', 'Bash', 'Networking', 'Cybersecurity',
                'Docker', 'Kubernetes', 'K8s', 'AWS', 'Azure', 'GCP', 'Cloud', 'Machine Learning', 'ML', 'AI',
                'Deep Learning', 'Data Science', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Express', 'Angular',
                'Vue', 'PHP', 'Laravel', 'Django', 'Flask', 'C#', 'C++', 'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter',
                'Native', 'Redux', 'GraphQL', 'REST', 'API', 'Jenkins', 'CI/CD', 'Agile', 'Scrum', 'Management',
                'Leadership', 'Consulting', 'Security', 'Design', 'UI', 'UX', 'Figma', 'Sketch', 'Photoshop',
                'DevOps', 'Frontend', 'Backend', 'Fullstack', 'Full-stack', 'Mobile', 'Unity', 'TensorFlow', 'PyTorch',
                'Pandas', 'NumPy', 'Scikit-learn', 'Spring', 'Hibernate', 'Spring Boot', 'Next.js', 'Nuxt.js', 'Svelte',
                'Redux-Saga', 'MobX', 'WebSockets', 'Socket.io', 'OAuth', 'JWT', 'Firebase', 'Supabase', 'Vercel',
                'Netlify', 'Terraform', 'Ansible', 'Puppet', 'Chef', 'Prometheus', 'Grafana', 'ELK', 'Splunk',
                'Kali Linux', 'Wireshark', 'Metasploit', 'Nmap', 'Burp Suite', 'Cloud Computing', 'Big Data',
                'Spark', 'Hadoop', 'Kafka', 'Elasticsearch', 'Software Engineering', 'System Design', 'Algorithms',
                'Data Structures', 'Embedded Systems', 'IoT', 'Arduino', 'Raspberry Pi', 'Testing', 'QA', 'Cypress',
                'Jest', 'Selenium', 'English', 'French', 'Arabic', 'Spanish', 'German', 'Problem Solving',
                'Critical Thinking', 'Communication', 'Teamwork', 'Project Management', 'Presentation'
            ];
            const foundSkills = commonSkills.filter(skill => {
                const regex = new RegExp(`\\b${skill}\\b`, 'i');
                return regex.test(text);
            });
            
            // Clean bio: remove the "Skills:" section from the bio summary
            let cleanBio = text;
            const skillPrefixes = [/skills:/i, /compétences:/i, /competences:/i, /skills\s*&/i];
            skillPrefixes.forEach(prefix => {
                const matchIndex = cleanBio.search(prefix);
                if (matchIndex !== -1 && matchIndex < 100) {
                    // Try to extract only the part BEFORE the skills or AFTER it?
                    // Usually we just want to remove the specific header and the words following it if it's a list.
                }
            });

            return {
                skills: [...new Set(foundSkills)], 
                bio: text.slice(0, 300).replace(/\s+/g, ' ').trim() + '...'
            };
        }

        // Use gemini-pro (more stable across different key versions)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `
            Analyze the following resume text and extract:
            1. Professional skills (as a list of strings).
            2. A brief, professional bio/summary (as a single string).
            
            Resume Text:
            ${text}
            
            Return the result ONLY as a JSON object with two fields: "skills" (array) and "bio" (string).
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text().replace(/```json|```/g, '').trim();
        return JSON.parse(responseText);

    } catch (error) {
        console.error('AI Text-Only Parsing Error:', error);
        // Better debug Bio
        return { 
            skills: [], 
            bio: text ? text.slice(0, 300).replace(/\s+/g, ' ').trim() + '...' : `Erreur : ${error.message}` 
        };
    }
};

/**
 * AI Job Matcher - Calculate compatibility percentage
 */
const getJobMatchScore = async (userSkills, internship) => {
    try {
        if (!userSkills || userSkills.length === 0) return 0;
        const jobRequirements = internship.requirements || internship.description;
        
        if (!genAI) {
            const matchCount = userSkills.filter(skill => jobRequirements.toLowerCase().includes(skill.toLowerCase())).length;
            return Math.round((matchCount / userSkills.length) * 100);
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Rate match % (0-100) between skills: [${userSkills.join(', ')}] and job: [${jobRequirements}]. Return ONLY the number.`;
        const result = await model.generateContent(prompt);
        const score = parseInt((await result.response).text().trim());
        return isNaN(score) ? 0 : score;
    } catch (error) {
        console.error('Match Score Error:', error);
        return 0;
    }
};

module.exports = {
    parseResume,
    getJobMatchScore
};
