const Link = require('../../domain/entities/Link');

class UpdateLink {
  constructor(linkRepository) {
    this.linkRepository = linkRepository;
  }

  async execute(id, { label, url, icon }) {
    // Check that the link exists.
    const existingLink = await this.linkRepository.findById(id);
    if (!existingLink) {
      throw new Error('Link not found');
    }

    // Create the entity with the new values.
    const updatedLink = new Link({
      ...existingLink,
      label: label ?? existingLink.label,
      url: url ?? existingLink.url,
      icon: icon ?? existingLink.icon
    });

    // To validate.
    const errors = updatedLink.validate();
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // To update.
    await this.linkRepository.update(id, updatedLink);
    
    return updatedLink.toJSON();
  }
}

module.exports = UpdateLink;