const db = require('../config/db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      full_name VARCHAR(255),
      role VARCHAR(255) DEFAULT 'user', -- 'admin', 'user'
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title VARCHAR(255) NOT NULL,
      bio TEXT,
      avatar_url VARCHAR(500),
      background_color VARCHAR(7) DEFAULT '#FFFFFF',
      text_color VARCHAR(7) DEFAULT '#000000',
      meta_title VARCHAR(255),
      meta_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

  db.run(`
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      label VARCHAR(255) NOT NULL,
      url VARCHAR(500) NOT NULL,
      icon VARCHAR(100),
      position INTEGER NOT NULL DEFAULT 0,
      click_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    db.run(`
      CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      platform VARCHAR(50) NOT NULL,
      url VARCHAR(500) NOT NULL,
      is_visible INTEGER DEFAULT 1,
      position INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CHECK(is_visible IN (0,1))
      )`);

      db.run(`
        CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link_id INTEGER,
        event_type VARCHAR(50) NOT NULL, -- 'profile_view', 'link_click'
        ip_address VARCHAR(45),
        user_agent TEXT,
        referer VARCHAR(500),
        country VARCHAR(2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
        )`);


        // =========================================
        // CREATE TRIGGER for auto update updated_at
        // =========================================

        // For users
        db.run(`
          CREATE TRIGGER update_user_updated_at
          AFTER UPDATE ON users
          BEGIN
            UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
          END;`);

        // Profiles
        db.run(`
          CREATE TRIGGER update_profile_updated_at
          AFTER UPDATE ON users
          BEGIN
            UPDATE profiles SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
          END;`);

        // Links
        db.run(`
          CREATE TRIGGER update_links_updated_at
          AFTER UPDATE ON users
          BEGIN
            UPDATE links SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
          END;`);

        // =================================
        // CREATE INDEX for faster lookups
        // =================================

        // index for performance for repeated queries
        db.run(`CREATE INDEX IF NOT EXISTS idx_links_position ON links(position)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_social_links_position ON social_links(position)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_social_links_visible ON social_links(is_visible)`);

        db.run(`CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_social_links_user_id ON social_links(user_id)`);
        
        // Index pour les analytics (requests by date, type, event)
        db.run(`CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_analytics_link_id ON analytics(link_id)`);
        
        // Index for admin authentication.
        db.run(`CREATE INDEX IF NOT EXISTS idx_admin_username ON users(username)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_admin_email ON users(email)`);

        console.log('Database initialized successfully with all tables and indexes.');
        console.log('Run "npm run seed" to populate the database with initial data test');

});

db.close();
