class GetAllLinks {
  constructor(linkRepository) {
    this.linkRepository = linkRepository;
  }

  async execute(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const links = await this.linkRepository.findAll(userId);

    return links.map(link => link.toJSON());
  }
}

module.exports = GetAllLinks;