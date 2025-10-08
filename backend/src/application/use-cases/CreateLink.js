const Link = require('../../domain/entities/Link');

class CreateLink {
  constructor(linkRepository) {
    this.linkRepository = linkRepository;
  }

  async execute(userId, { label, url, icon }) {
    // Create with entity.
    const link = new Link({
      userId,
      label,
      url,
      icon
    });

    // Valid.
    const errors = link.validate();
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Persist
    const id = await this.linkRepository.create(link);
    
    return { id, ...link.toJSON() };
  }
}

module.exports = CreateLink;