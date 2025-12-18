const ISocialLinkRepository = require('../../domain/repositories/ISocialLinkRepository');
const SocialLink = require('../../domain/entities/SocialLink');

class SqliteSocialLinkRepository extends ISocialLinkRepository {
    constructor(db) {
        super();
        this.db = db;
    }

    async findAllByUserId(userId) {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM social_links WHERE user_id = ? ORDER BY position ASC',
                [userId],
                (err, rows) => {
                    if (err) return reject(err);

                    const socialLinks = rows.map(row => new SocialLink({
                        id: row.id,
                        userId: row.user_id,
                        platform: row.platform,
                        url: row.url,
                        isVisible: row.is_visible === 1,
                        position: row.position,
                        createdAt: row.created_at
                    }));
                    resolve(socialLinks);
                }
            );
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM social_links WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) return reject(err);
                    if (!row) return resolve(null);

                    const socialLink = new SocialLink({
                        id: row.id,
                        userId: row.user_id,
                        platform: row.platform,
                        url: row.url,
                        isVisible: row.is_visible === 1,
                        position: row.position,
                        createdAt: row.created_at
                    });
                    resolve(socialLink);
                }
            );
        });
    }

    async create(socialLink) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO social_links (user_id, platform, url, is_visible, position) VALUES (?, ?, ?, ?, ?)',
                [
                    socialLink.userId,
                    socialLink.platform,
                    socialLink.url,
                    socialLink.isVisible ? 1 : 0,
                    socialLink.position
                ],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

    async update(id, socialLink) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE social_links SET platform = ?, url = ?, is_visible = ?, position = ? WHERE id = ?',
                [
                    socialLink.platform,
                    socialLink.url,
                    socialLink.isVisible ? 1 : 0,
                    socialLink.position,
                    id
                ],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.changes > 0);
                }
            );
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'DELETE FROM social_links WHERE id = ?',
                [id],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.changes > 0);
                }
            );
        });
    }

    async updatePosition(id, position) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE social_links SET position = ? WHERE id = ?',
                [position, id],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.changes > 0);
                }
            );
        });
    }
}

module.exports = SqliteSocialLinkRepository;
