const { Client } = require('@notionhq/client');

// Initialize the client
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Check if keys exist
const checkKeysExist = () => {
  const keysExist = process.env.NOTION_TOKEN && process.env.PROJ_DB && process.env.TASK_DB;
  if (!keysExist) {
    console.error('Error: Required keys do not exist.');
  }
  return keysExist;
};

// Check if keys are valid
const checkKeysValidity = async () => {
  try {
    // Test validity of NOTION_TOKEN
    await notion.search({ query: '' });

    // Test validity of PROJ_DB and TASK_DB
    const databases = [process.env.PROJ_DB, process.env.TASK_DB];
    const testPromises = databases.map(databaseId => notion.databases.retrieve({ database_id: databaseId }));
    await Promise.all(testPromises);

    return true;
  } catch (error) {
    console.error('Error: Invalid keys. Ensure that NOTION_TOKEN, PROJ_DB, and TASK_DB are correct.', error);
    return false;
  }
};

// Check if Projects and Tasks databases have the required properties
const checkDatabaseProperties = async () => {
  const databases = [process.env.PROJ_DB, process.env.TASK_DB];
  const requiredProperties = {
    [process.env.PROJ_DB]: ['PPID', 'TIDs', 'Point'],
    [process.env.TASK_DB]: ['PPID', 'TID']
  };

  for (let databaseId of databases) {
    const database = await notion.databases.retrieve({ database_id: databaseId });
    const properties = database.properties;
    for (let requiredProperty of requiredProperties[databaseId]) {
      if (!properties[requiredProperty]) {
        console.error(`Error: Missing property "${requiredProperty}" in database with ID "${databaseId}"`);
        return false;
      }
    }
  }

  return true;
};

// Boot check
const bootcheck = async () => {
  if (!checkKeysExist() || !await checkKeysValidity() || !await checkDatabaseProperties()) {
    console.error('Boot check failed.');
    return;
  }

  console.log('Boot check passed.');
};

bootcheck();
