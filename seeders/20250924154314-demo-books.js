"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const [authors] = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Authors" WHERE name IN ('Author A','Author B');`
    );
    const [pubs] = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Publishers" WHERE name IN ('Publisher X','Publisher Y');`
    );

    const authorMap = {};
    authors.forEach((a) => (authorMap[a.name] = a.id));
    const pubMap = {};
    pubs.forEach((p) => (pubMap[p.name] = p.id));

    await queryInterface.bulkInsert(
      "Books",
      [
        {
          title: "Book 1",
          authorId: authorMap["Author A"],
          publisherId: pubMap["Publisher X"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Book 2",
          authorId: authorMap["Author B"],
          publisherId: pubMap["Publisher Y"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Books", null, {});
  },
};
