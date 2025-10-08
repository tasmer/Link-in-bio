const ILinkRepository = require('../../domain/repositories/ILinkRepository');
const Link = require('../../domain/entities/Link');

class SqliteLinkRepository extends ILinkRepository {
    constructor(db) {
        super();
        this.db = db;
    }

    async findAll(userId) {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM links WHERE user_id = ? ',
                [userId],
                (err, rows) => {
                    if (err) return reject(err);

                    const links = rows.map(row => new Link({
                        id: row.id,
                        userId: row.user_id,
                        label: row.label,
                        url: row.url,
                        icon: row.icon,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at
                    }));
                    resolve(links);
                }
            );
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM links WHERE id = ?',
                [id],
                (err, row) => {
                    if(err) return reject(err);
                    if(!row) return resolve(null);

                    const link = new Link({
                        id: row.id,
                        userId: row.user_id,
                        label: row.label,
                        url: row.url,
                        icon: row.icon,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at
                    });
                    resolve(link);
                }
            );
        });
    }

    async create(link) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO links (user_id, label, url, icon) VALUES (?, ?, ?, ?)',
                [link.userId, link.label, link.url, link.icon],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

    async update(id, link) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE links SET label = ?, url = ?, icon = ? WHERE id = ?',
                [link.label, link.url, link.icon, id],
                function(err){
                    if (err) return reject(err);
                    resolve(this.changes > 0);
                }
            );
        });
    }
    async delete(id) {
        return  new Promise((resolve, reject) => {
            this.db.run(
                'DELETE FROM links WHERE id = ?', 
                [id],
                function(err) {
                    if (err) return reject(err);
                    resolve(this.changes > 0);
                }
            );
        });
    }
}

module.exports = SqliteLinkRepository;