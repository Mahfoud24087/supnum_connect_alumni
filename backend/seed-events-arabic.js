const { Event, User } = require('./models');

async function seedEvents() {
    try {
        await Event.destroy({ where: {} });
        const user = await User.findOne({ where: { role: 'admin' } }) || await User.findOne();
        if (!user) {
            console.log('No user found');
            return;
        }

        const d1 = new Date(); d1.setDate(d1.getDate() + 5);
        const d2 = new Date(); d2.setDate(d2.getDate() + 12);
        const d3 = new Date(); d3.setDate(d3.getDate() + 20);
        const d4 = new Date(); d4.setDate(d4.getDate() + 25);

        await Event.create({
            title: 'قمة التقنية السنوية لخريجي SupNum',
            type: 'Event',
            date: d1,
            description: 'انضم إلينا في القمة السنوية التي تجمع بين خريجي وطلاب المعهد العالي للرقمنة لتبادل الخبرات ومناقشة مستقبل التكنولوجيا والرقمنة في موريتانيا.',
            color: 'bg-blue-600',
            createdById: user.id
        });

        await Event.create({
            title: 'هاكاثون الابتكار المفتوح',
            type: 'Challenge',
            date: d2,
            description: 'تحدي برمجي لمدة 48 ساعة متواصلة لبناء حلول رقمية مبتكرة تخدم المجتمع. ستتلقى الفرق الفائزة تمويلاً أولياً لمشاريعها من قبل الرعاة.',
            color: 'bg-emerald-500',
            createdById: user.id
        });

        await Event.create({
            title: 'مسابقة تحدي الخوارزميات',
            type: 'Contest',
            date: d3,
            description: 'تنافس مع زملائك في حل أصعب المشاكل الخوارزمية وأكثرها تعقيدا في أسرع وقت ممكن. أظهر مهاراتك البرمجية الاستثنائية واربح!',
            color: 'bg-fuchsia-600',
            createdById: user.id
        });

        await Event.create({
            title: "Atelier d'Intelligence Artificielle",
            type: 'Event',
            date: d4,
            description: "Un atelier intensif et pratique axé sur les réseaux de neurones et l'apprentissage automatique. Découvrez comment intégrer l'IA dans vos différents projets.",
            color: 'bg-indigo-600',
            createdById: user.id
        });

        console.log('Successfully re-seeded 4 linguistic events!');
    } catch (e) {
        console.error('Error:', e);
    }
    process.exit();
}

seedEvents();
