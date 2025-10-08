class DeleteLink {
  constructor(linkRepository) {
    this.linkRepository = linkRepository;
  }

  async execute(id) {
    const link = await this.linkRepository.findById(id);
    if (!link) {
      throw new Error('Link not found');
    }

    const deleted = await this.linkRepository.delete(id);
    return deleted;
  }
}

module.exports = DeleteLink;