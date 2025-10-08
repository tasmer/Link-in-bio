const db = require('../config/db');
const bcrypt = require('bcrypt');


const seedData = async () => {
    const salRounds = 10;
    const hashedPassword = await bcrypt.hash('pwdAdmin123', salRounds);

    db.serialize(() =>{
        console.log('Starting database seeding... 🌱');

        db.run(`
            INSERT OR REPLACE INTO users (id, username, email, password, full_name)
            VALUES ( 1, 'admin', 'admin@mail.com',?,'Administrator')
            `,[hashedPassword], function(err) {
                    if(err){
                        console.error('Error seeding admin user:', err);
                    } else {
                        console.log();
                    }
                }
            );
        
        db.run(
            `INSERT OR REPLACE INTO profiles (id, user_id, title, bio, avatar_url, background_color, text_color, meta_title, meta_description)
            VALUES (1, 1, 'Developpeur fullstack', 'Bienvenue sur mon profil !', 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Robert', '#1a1a2e', '#ffffff', 'John Doe - Développeur Full Stack', 'Portfolio et liens de John Doe, développeur full stack spécialisé en React et Node.js'
            )`, function(err) {
                if(err){
                    console.error('Error seeding profile:', err);
                } else {
                    console.log('Profile seeded successfully! ✅');
                }
            }
        );

        const demoLinks = [
            {
                label: '🌐 Mon Portfolio',
                url: 'https://johndoe-portfolio.com',
                position: 1
            },
            {
                label: '📱 Application Mobile',
                url: 'https://myapp.johndoe.com',
                position: 2
            },
            {
                label: '📝 Mon Blog Tech',
                url: 'https://blog.johndoe.com',
                position: 3
            },
            {
                label: '☕ M\'offrir un café',
                url: 'https://buymeacoffee.com/johndoe',
                position: 4
            },
            {
                label: '📧 Me contacter',
                url: 'mailto:john@example.com',
                position: 5
            }
        ];

        demoLinks.forEach(link => {
            db.run(`
                INSERT OR REPLACE INTO links (
                user_id, label, url, position, click_count
                ) VALUES (1, ?, ?, ?, ?)
                 `, [
                link.label,
                link.url,
                link.position,
                Math.floor(Math.random() * 50) // Clics aléatoires pour la démo
            ],
                function (err) {
                    if (err) {
                        console.error('Error seeding link:', err);
                    } else {
                        console.log(`Link "${link.label}" seeded successfully! ✅`);
                    }
                }
            );
        });

        const demoSocialLinks = [
            { platform: 'github', url: 'https://github.com/johndoe', position: 1 },
            { platform: 'twitter', url: 'https://twitter.com/johndoe_dev', position: 2 },
            { platform: 'linkedin', url: 'https://linkedin.com/in/johndoe', position: 3 },
            { platform: 'youtube', url: 'https://youtube.com/@johndoe', position: 4 },
            { platform: 'instagram', url: 'https://instagram.com/johndoe_dev', position: 5 }
        ];

        demoSocialLinks.forEach((social, index) => {
            db.run(`
        INSERT OR REPLACE INTO social_links (user_id, platform, url, position, is_visible) 
        VALUES (1, ?, ?, ?, 1)
      `, [social.platform, social.url, social.position], function (err) {
                if (err) {
                    console.error(`Error seeding Social link ${ social.platform}`, err);
                } else {
                    console.log(`✅ Social link "${social.platform}" seeded successfully!`);
                }
            });
        });

        const generateAnalytics = () => {
            const envents = ['profile_view', 'link_click'];
            const countries = ['FR', 'US', 'CA', 'DE', 'GB'];
            const agents = [ 
                'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36',
                'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
                'Mozilla/5.0 (iPad; CPU OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12F69 Safari/600.1.4'
                ];
            const referers = ['https://www.google.com/search?', null, 'https://www.facebook.com/']

            for (let i= 0; i < 100; i++) {
                const isLinkClick = Math.random() < 0.3;
                const eventType = isLinkClick ? 'link_click' : 'profile_view';
                const linkId = isLinkClick ? Math.floor(Math.random() * 5) + 1 : null;
                const country = countries[Math.floor(Math.random() * countries.length)];
                const userAgent = agents[Math.floor(Math.random()*agents.length)];
                const referer = referers[Math.floor(Math.random()*referers.length)];

                const date = new Date();
                date.setDate(date.getDate() - Math.floor(Math.random() * 30));

                db.run(`
                    INSERT INTO analytics (link_id, event_type, ip_address, user_agent, referer, country, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    `,[
                        linkId,
                        eventType,
                        `192.168.1.${Math.floor(Math.random() * 255)}`, // alator IP
                        userAgent,
                        referer,
                        country,
                        date.toISOString(),
                    ]);
            }
            console.log('✅ 100 event analytics generated successfully!');
        }
        setTimeout(generateAnalytics, 1000); // Delay to ensure previous inserts are committed

        setTimeout(() => {
            console.log('🌱 Database seeding completed successfully!');
            console.log('📋 Resume :');
            console.log('  - 1 admin (admin/admin123)');
            console.log('  - 1 demo profile');
            console.log('  - 5 demos links');
            console.log('  - 5 Social links');
            console.log('  - 100 event analytics (profile views and link clicks)');
            console.log('\n🚀 Now you can start your app !');

            db.close();
        }, 2000);
    });
}

seedData().catch(console.error);