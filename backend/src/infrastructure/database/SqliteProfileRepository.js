const IProfileRepository = require('../../domain/repositories/IProfileRepository');
const Profile = require('../../domain/entities/Profile');

class SqliteProfileRepository extends IProfileRepository {
    constructor(db) {
        super();
        this.db = db;
    }

    async findByUserId(userId) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM profiles WHERE user_id = ?',
                [userId],
                (err, row) => {
                    if (err) return reject(err);
                    if (!row) return resolve(null);

                    const profile = new Profile({
                        id: row.id,
                        userId: row.user_id,
                        title: row.title,
                        bio: row.bio,
                        avatarUrl: row.avatar_url,
                        backgroundColor: row.background_color,
                        textColor: row.text_color,
                        metaTitle: row.meta_title,
                        metaDescription: row.meta_description,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at
                    });
                    resolve(profile);
                }
            );
        });
    }

    async findByUsername(username) {
        return new Promise((resolve, reject) => {
            this.db.get(
                `SELECT p.* FROM profiles p 
                 INNER JOIN users u ON p.user_id = u.id 
                 WHERE u.username = ?`,
                [username],
                (err, row) => {
                    if (err) return reject(err);
                    if (!row) return resolve(null);

                    const profile = new Profile({
                        id: row.id,
                        userId: row.user_id,
                        title: row.title,
                        bio: row.bio,
                        avatarUrl: row.avatar_url,
                        backgroundColor: row.background_color,
                        textColor: row.text_color,
                        metaTitle: row.meta_title,
                        metaDescription: row.meta_description,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at
                    });
                    resolve(profile);
                }
            );
        });
    }

    async create(profile) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO profiles (user_id, title, bio, avatar_url, background_color, text_color, meta_title, meta_description) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    profile.userId,
                    profile.title,
                    profile.bio,
                    profile.avatarUrl,
                    profile.backgroundColor,
                    profile.textColor,
                    profile.metaTitle,
                    profile.metaDescription
                ],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

    async update(userId, profile) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `UPDATE profiles 
                 SET title = ?, bio = ?, avatar_url = ?, background_color = ?, text_color = ?, meta_title = ?, meta_description = ? 
                 WHERE user_id = ?`,
                [
                    profile.title,
                    profile.bio,
                    profile.avatarUrl,
                    profile.backgroundColor,
                    profile.textColor,
                    profile.metaTitle,
                    profile.metaDescription,
                    userId
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
                'DELETE FROM profiles WHERE id = ?',
                [id],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.changes > 0);
                }
            );
        });
    }
}

module.exports = SqliteProfileRepository;
