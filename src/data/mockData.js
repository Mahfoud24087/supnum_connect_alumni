// Minimal mock data for development/testing only
// In production, all data will come from the backend API

export const stats = {
    totalUsers: 0,
    students: 0,
    graduates: 0,
    events: 0
};

// Mock users for testing authentication
// REMOVE THIS when backend is connected
export const users = [
    {
        id: 'admin-1',
        name: 'Admin User',
        role: 'admin',
        supnumId: 'ADMIN001',
        email: 'admin@supnum.mr',
        bio: 'System Administrator',
        avatar: null,
        social: {
            linkedin: '',
            github: '',
            facebook: ''
        }
    },
    {
        id: 'student-1',
        name: 'Test Student',
        role: 'student',
        supnumId: '2Y001',
        email: 'student@supnum.mr',
        bio: 'Computer Science student',
        avatar: null,
        social: {
            linkedin: '',
            github: '',
            facebook: ''
        }
    },
    {
        id: 'graduate-1',
        name: 'Test Graduate',
        role: 'graduate',
        supnumId: '1G001',
        email: 'graduate@supnum.mr',
        bio: 'Software Engineer',
        avatar: null,
        social: {
            linkedin: '',
            github: '',
            facebook: ''
        }
    }
];

// Mock events - will be replaced by API data
export const events = [];
