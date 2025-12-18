const IUserRepository = require('../../domain/repositories/IUserRepository');
const User = require('../../domain/entities/User');

class SqliteUserRepository extends IUserRepository {
    constructor(db){
        super();
        this.db = db;
    }

    async findAll(id) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM Users ORDER BY created_at DESC',
                [],
                (err, rows) => {
                    if (err) return reject(err);
                    if (!rows) return resolve(null);

                    const users = rows.map((row) => new User({
                        id: row.id,
                        username: row.username,
                        password: row.password,
                        email: row.email,
                        fullName: row.full_name,
                        role: row.role,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at
                    }));
                    resolve(users);
                }
            );
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM Users WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) return reject(err);
                    if (!row) return resolve(null);

                    const user = new User({
                        id: row.id,
                        username: row.username,
                        password: row.password,
                        email: row.email,
                        fullName: row.full_name,
                        role: row.role,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at
                    });
                    resolve(user);
                }
            );
        });
    }

    async findByUsername(username) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM users WHERE username = ?',
                [username],
                (err, row) => {
                    if (err) return reject(err);
                    if (!row) return resolve(null);

                    const user = new User({
                        id: row.id,
                        username: row.username,
                        password: row.password,
                        email: row.email,
                        fullName: row.full_name,
                        role: row.role,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at
                    });
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

                    const user = new User({
                        id: row.id,
                        username: row.username,
                        password: row.password,
                        email: row.email,
                        fullName: row.full_name,
                        role: row.role,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at
                    });
                    resolve(user);
                }
            );
        });
    }

    async create(user) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO users (username, password, email, full_name, role) 
         VALUES (?, ?, ?, ?, ?)`,
                [user.username, user.password, user.email, user.fullName, user.role],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

    async update(id, user) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `UPDATE users 
                SET username = ?, email = ?, full_name = ?, role = ?
                WHERE id = ?`,
                [user.username, user.email, user.fullName, user.role, id],
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
                'DELETE FROM users WHERE id = ?',
                [id],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.changes > 0);
                }
            );
        });
    }
}