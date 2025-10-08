const sqlite3 = require('sqlite3').verbose();

// Domain
const ILinkRepository = require('../domain/repositories/ILinkRepository');

// Infrastructure
const SqliteLinkRepository = require('./database/SqliteLinkRepository');

// Application (Use Cases)
const GetAllLinks = require('../application/use-cases/GetAllLinks');
const CreateLink = require('../application/use-cases/CreateLink');
const UpdateLink = require('../application/use-cases/UpdateLink');
const DeleteLink = require('../application/use-cases/DeleteLink');

// HTTP
const LinkController = require('./http/controllers/LinkController');
const createLinkRoutes = require('./http/routes/linkRoutes');

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
    return this;
  }

  // Initialize the use cases.
  initUseCases() {
    const { linkRepository } = this.dependencies;
    
    this.dependencies.getAllLinks = new GetAllLinks(linkRepository);
    this.dependencies.createLink = new CreateLink(linkRepository);
    this.dependencies.updateLink = new UpdateLink(linkRepository);
    this.dependencies.deleteLink = new DeleteLink(linkRepository);
    
    return this;
  }

  // Initialize the controllers
  initControllers() {
    const { getAllLinks, createLink, updateLink, deleteLink } = this.dependencies;
    
    this.dependencies.linkController = new LinkController(
      getAllLinks,
      createLink,
      updateLink,
      deleteLink
    );
    
    return this;
  }

  // Initialize routes.
  initRoutes() {
    const { linkController } = this.dependencies;
    
    this.dependencies.linkRoutes = createLinkRoutes(linkController);
    
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