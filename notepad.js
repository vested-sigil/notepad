const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const work = process.env.TASK_DB;
const home = process.env.PROJ_DB;

const Notepad = {};

Notepad.search = async (query) => {
  try {
    return await notion.search({ query });
  } catch (error) {
    console.error("Error in search: ", error);
  }
};

Notepad.queryDatabase = async (databaseId) => {
  try {
    return await notion.databases.query({ database_id: databaseId });
  } catch (error) {
    console.error("Error in queryDatabase: ", error);
  }
};

Notepad.createPage = async (parentId, properties) => {
  try {
    return await notion.pages.create({ parent: { id: parentId }, properties });
  } catch (error) {
    console.error("Error in createPage: ", error);
  }
};

Notepad.retrievePage = async (pageId) => {
  try {
    return await notion.pages.retrieve({ page_id: pageId });
  } catch (error) {
    console.error("Error in retrievePage: ", error);
  }
};

Notepad.updatePage = async (pageId, properties) => {
  try {
    return await notion.pages.update({ page_id: pageId, properties });
  } catch (error) {
    console.error("Error in updatePage: ", error);
  }
};

Notepad.retrieveDatabase = async (databaseId) => {
  try {
    return await notion.databases.retrieve({ database_id: databaseId });
  } catch (error) {
    console.error("Error in retrieveDatabase: ", error);
  }
};

Notepad.retrieveBlockChildren = async (blockId) => {
  try {
    return await notion.blocks.children.list({ block_id: blockId });
  } catch (error) {
    console.error("Error in retrieveBlockChildren: ", error);
  }
};

Notepad.appendBlockChildren = async (blockId, children) => {
  try {
    return await notion.blocks.children.append({ block_id: blockId, children });
  } catch (error) {
    console.error("Error in appendBlockChildren: ", error);
  }
};

Notepad.retrieveBlock = async (blockId) => {
  try {
    return await notion.blocks.retrieve({ block_id: blockId });
  } catch (error) {
    console.error("Error in retrieveBlock: ", error);
  }
};

Notepad.updateBlock = async (blockId, block) => {
  try {
    return await notion.blocks.update({ block_id: blockId, block });
  } catch (error) {
    console.error("Error in updateBlock: ", error);
  }
};

Notepad.retrieveUser = async (userId) => {
  try {
    return await notion.users.retrieve({ user_id: userId });
  } catch (error) {
    console.error("Error in retrieveUser: ", error);
  }
};

Notepad.listUsers = async () => {
  try {
    return await notion.users.list();
  } catch (error) {
    console.error("Error in listUsers: ", error);
  }
};

Notepad.addTaskToProject = async (taskName, projectId) => {
  const taskProps = {
    title: { title: taskName },
    Projects: { relation: [{ id: projectId }] }
  };
  try {
    return await Notepad.createPage(work, taskProps);
  } catch (error) {
    console.error("Error in addTaskToProject: ", error);
  }
};

Notepad.retrieveProjectProperties = async (projectId, startCursor, pageSize = 100) => {
  try {
    return await Notepad.retrievePage(projectId, startCursor, pageSize);
  } catch (error) {
    console.error("Error in retrieveProjectProperties: ", error);
  }
};

Notepad.retrieveProjectPage = async (projectId, startCursor, pageSize = 100) => {
  try {
    return await Notepad.retrieveBlockChildren(projectId, startCursor, pageSize);
  } catch (error) {
    console.error("Error in retrieveProjectPage: ", error);
  }
};

Notepad.listPoints = async (startCursor, pageSize = 100) => {
  try {
    return await notion.databases.query({
      database_id: home,
      start_cursor: startCursor,
      page_size: pageSize,
      filter: {
        property: "Point",
        number: {
          is_not_empty: true
        }
      }
    });
  } catch (error) {
    console.error("Error in listPoints: ", error);
  }
};

Notepad.retrieveTasks = async (pageId, startCursor, pageSize = 100) => {
  try {
    return await notion.databases.query({
      database_id: work,
      start_cursor: startCursor,
      page_size: pageSize,
      filter: {
        property: "PPID",
        text: {
          equals: pageId
        }
      }
    });
  } catch (error) {
    console.error("Error in retrieveTasks: ", error);
  }
};

Notepad.markTaskAsComplete = async (taskId) => {
  try {
    return await notion.pages.update({ page_id: taskId, properties: { Status: { name: "Completed" } } });
  } catch (error) {
    console.error("Error in markTaskAsComplete: ", error);
  }
};

Notepad.identifyProject = async (projectId) => {
  try {
    return (await Notepad.retrievePage(projectId)).id;
  } catch (error) {
    console.error("Error in identifyProject: ", error);
  }
};

Notepad.createTask = async (taskName) => {
  const taskProps = {
    title: { title: taskName }
  };
  try {
    return await Notepad.createPage(work, taskProps);
  } catch (error) {
    console.error("Error in createTask: ", error);
  }
};
