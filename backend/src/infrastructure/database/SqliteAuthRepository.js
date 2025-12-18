const IAuthRepository = require('../../domain/repositories/IAuthRepository');
const User = require('../../domain/entities/User');

class SqliteAuthRepository extends IAuthRepository {
    constructor(db) {
        super();
        this.db = db;
    }

    async findByUsername(username) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM users WHERE username = ?',
                [username],
                (err, row) => {
                    if (err) return reject(err);
                    if (!row) return resolve(null);

                    const user = new User(
                        row.id,
                        row.username,
                        row.password,
                        row.email,
                        row.full_name,
                        row.role,
                        row.created_at,
                        row.updated_at
                    );
                    resolve(user);
                }
            );
        });
    }

    async findByEmail(email) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM users WHERE email = ?',
                [email],
                (err, row) => {
                    if (err) return reject(err);
                    if (!row) return resolve(null);

                    const user = new User(
                        row.id,
                        row.username,
                        row.password,
                        row.email,
                        row.full_name,
                        row.role,
                        row.created_at,
                        row.updated_at
                    );
                    resolve(user);
                }
            );
        });
    }
}

module.exports = SqliteAuthRepository;
