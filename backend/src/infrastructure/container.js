const sqlite3 = require('sqlite3').verbose();

// Infrastructure - Repositories
const SqliteLinkRepository = require('./database/SqliteLinkRepository');
const SqliteProfileRepository = require('./database/SqliteProfileRepository');
const SqliteSocialLinkRepository = require('./database/SqliteSocialLinkRepository');
const SqliteAuthRepository = require('./database/SqliteAuthRepository');

// Application - Use Cases - Links
const GetAllLinks = require('../application/use-cases/GetAllLinks');
const CreateLink = require('../application/use-cases/CreateLink');
const UpdateLink = require('../application/use-cases/UpdateLink');
const DeleteLink = require('../application/use-cases/DeleteLink');

// Application - Use Cases - Profiles
const GetProfileByUserId = require('../application/use-cases/GetProfileByUserId');
const GetProfileByUsername = require('../application/use-cases/GetProfileByUsername');
const CreateProfile = require('../application/use-cases/CreateProfile');
const UpdateProfile = require('../application/use-cases/UpdateProfile');
const DeleteProfile = require('../application/use-cases/DeleteProfile');

// Application - Use Cases - Social Links
const GetAllSocialLinks = require('../application/use-cases/GetAllSocialLinks');
const GetSocialLinkById = require('../application/use-cases/GetSocialLinkById');
const CreateSocialLink = require('../application/use-cases/CreateSocialLink');
const UpdateSocialLink = require('../application/use-cases/UpdateSocialLink');
const DeleteSocialLink = require('../application/use-cases/DeleteSocialLink');

// Application - Use Cases - Auth
const Login = require('../application/use-cases/Login');

// HTTP - Controllers
const LinkController = require('./http/controllers/LinkController');
const ProfileController = require('./http/controllers/ProfileController');
const SocialLinkController = require('./http/controllers/SocialLinkController');
const AuthController = require('./http/controllers/AuthController');

// HTTP - Routes
const createLinkRoutes = require('./http/routes/linkRoutes');
const createProfileRoutes = require('./http/routes/profileRoutes');
const createSocialLinkRoutes = require('./http/routes/socialLinkRoutes');
const createAuthRoutes = require('./http/routes/authRoutes');
const createPublicRoutes = require('./http/routes/publicRoutes');

// HTTP - Middleware
const authMiddleware = require('./http/middlewares/authMiddleware');

class Container {
  constructor() {
    this.dependencies = {};
  }

  // Initialize the database.
  initDatabase() {
    const db = new sqlite3.Database('./db/database.sqlite', (err) => {
      if (err) {
        console.error('DB connection error:', err.message);
        throw err;
      }
      console.log('✅ Connected to SQLite database');
    });
    this.dependencies.db = db;
    return this;
  }

  // Initialize repositories.
  initRepositories() {
    this.dependencies.linkRepository = new SqliteLinkRepository(this.dependencies.db);
    this.dependencies.profileRepository = new SqliteProfileRepository(this.dependencies.db);
    this.dependencies.socialLinkRepository = new SqliteSocialLinkRepository(this.dependencies.db);
    this.dependencies.authRepository = new SqliteAuthRepository(this.dependencies.db);
    return this;
  }

  // Initialize the use cases.
  initUseCases() {
    const { linkRepository, profileRepository, socialLinkRepository, authRepository } = this.dependencies;
    
    // Link use cases
    this.dependencies.getAllLinks = new GetAllLinks(linkRepository);
    this.dependencies.createLink = new CreateLink(linkRepository);
    this.dependencies.updateLink = new UpdateLink(linkRepository);
    this.dependencies.deleteLink = new DeleteLink(linkRepository);
    
    // Profile use cases
    this.dependencies.getProfileByUserId = new GetProfileByUserId(profileRepository);
    this.dependencies.getProfileByUsername = new GetProfileByUsername(profileRepository);
    this.dependencies.createProfile = new CreateProfile(profileRepository);
    this.dependencies.updateProfile = new UpdateProfile(profileRepository);
    this.dependencies.deleteProfile = new DeleteProfile(profileRepository);
    
    // Social Link use cases
    this.dependencies.getAllSocialLinks = new GetAllSocialLinks(socialLinkRepository);
    this.dependencies.getSocialLinkById = new GetSocialLinkById(socialLinkRepository);
    this.dependencies.createSocialLink = new CreateSocialLink(socialLinkRepository);
    this.dependencies.updateSocialLink = new UpdateSocialLink(socialLinkRepository);
    this.dependencies.deleteSocialLink = new DeleteSocialLink(socialLinkRepository);
    
    // Auth use cases
    this.dependencies.login = new Login(authRepository);
    
    return this;
  }

  // Initialize the controllers
  initControllers() {
    const { 
      getAllLinks, createLink, updateLink, deleteLink,
      getProfileByUserId, getProfileByUsername, createProfile, updateProfile, deleteProfile,
      getAllSocialLinks, getSocialLinkById, createSocialLink, updateSocialLink, deleteSocialLink,
      login
    } = this.dependencies;
    
    this.dependencies.linkController = new LinkController(
      getAllLinks,
      createLink,
      updateLink,
      deleteLink
    );
    
    this.dependencies.profileController = new ProfileController(
      getProfileByUserId,
      getProfileByUsername,
      createProfile,
      updateProfile,
      deleteProfile
    );
    
    this.dependencies.socialLinkController = new SocialLinkController(
      getAllSocialLinks,
      getSocialLinkById,
      createSocialLink,
      updateSocialLink,
      deleteSocialLink
    );
    
    this.dependencies.authController = new AuthController(login);
    
    return this;
  }

  // Initialize routes.
  initRoutes() {
    const { linkController, profileController, socialLinkController, authController } = this.dependencies;
    const { getProfileByUsername, getAllLinks, getAllSocialLinks } = this.dependencies;
    
    this.dependencies.linkRoutes = createLinkRoutes(linkController);
    this.dependencies.profileRoutes = createProfileRoutes(profileController, authMiddleware);
    this.dependencies.socialLinkRoutes = createSocialLinkRoutes(socialLinkController, authMiddleware);
    this.dependencies.authRoutes = createAuthRoutes(authController);
    this.dependencies.publicRoutes = createPublicRoutes(
      { getProfileByUsername },
      { getAllLinks },
      { getAllSocialLinks }
    );
    
    return this;
  }

  // Recovering from an addiction.
  get(name) {
    return this.dependencies[name];
  }

  // Initialize all.
  async initialize() {
    this.initDatabase();
    this.initRepositories();
    this.initUseCases();
    this.initControllers();
    this.initRoutes();
    
    console.log('✅ Container initialized');
    return this;
  }
}

module.exports = Container;