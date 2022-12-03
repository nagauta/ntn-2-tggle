const { Client } = require("@notionhq/client")
require('dotenv').config();

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});