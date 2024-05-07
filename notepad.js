const { Client } = require('@notionhq/client');

// Initializing a client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Defining an async wrapper function for error handling
const signal = fn => (req, res, next) =>
    Promise
        .resolve(fn(req, res, next))
        .catch(next);

class Notepad {

    // Method for searching a query
    search = signal(async (query) => {
        const response = await notion.search({ query });
        return response;
    });

    // Method for querying a database
    queryDatabase = signal(async (databaseId) => {
        const response = await notion.databases.query({ database_id: databaseId });
        return response;
    });
	  // Method for creating a page
    plan = signal(async (parentId, properties) => {
        const response = await notion.pages.create({ parent: { id: parentId }, properties });
        return response;
    });
   
    // Method for retrieving a page
    find = signal(async (pageId) => {
        const response = await notion.pages.retrieve({ page_id: pageId });
        return response;
    });

    // Method for updating a page
    updatePage = signal(async (pageId, properties) => {
        const response = await notion.pages.update({ page_id: pageId, properties });
        return response;
    });

    // Method for retrieving a database
    retrieveDatabase = signal(async (databaseId) => {
        const response = await notion.databases.retrieve({ database_id: databaseId });
        return response;
    });

    // Method for retrieving block children
    getkin = signal(async (blockId) => {
        const response = await notion.blocks.children.list({ block_id: blockId });
        return response;
    });

    // Method for appending block children
    addkin = signal(async (blockId, children) => {
        const response = await notion.blocks.children.append({ block_id: blockId, children });
        return response;
    });

    // Method for retrieving a block
   seeblock = signal(async (blockId) => {
        const response = await notion.blocks.retrieve({ block_id: blockId });
        return response;
    });

    // Method for updating a block
    fixblock = signal(async (blockId, block) => {
        const response = await notion.blocks.update({ block_id: blockId, block });
        return response;
    });

    // Method for retrieving a user
    retrieveUser = signal(async (userId) => {
        const response = await notion.users.retrieve({ user_id: userId });
        return response;
    });

    // Method for retrieving all users
    listUsers = signal(async () => {
        const response = await notion.users.list();
        return response;
    });
}

module.exports = new Notepad();
