"use strict";
require('dotenv').config();
async function main() {
    const NotionTaskAgent = require('./notionTaskAgent')
    const TogglAgent = require('./togglAgent')

    const ntnTskAgnt = new NotionTaskAgent();
    const togglAgent = new TogglAgent();
    let ret = await ntnTskAgnt.getProjects();
    console.log(`${JSON.stringify(ret)}`);

    togglAgent.syncProjects(ret);
}
main();