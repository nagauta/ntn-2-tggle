"use strict";
require('dotenv').config();
const NotionTaskAgent = require('./notionTaskAgent')
const TogglAgent = require('./togglAgent')

const ntnTskAgnt = new NotionTaskAgent();
const togglAgent = new TogglAgent();
async function main() {
    syncProjectsToToggle();
    syncAcheivementsToToggle();
}
async function syncProjectsToToggle() {
    let ret = await ntnTskAgnt.getProjects();
    console.log(`${JSON.stringify(ret)}`);
    togglAgent.syncProjects(ret);
}
async function syncAcheivementsToToggle() {
    const acievements = await ntnTskAgnt.getAchivementsToday();
    console.log(`acievements ${acievements}`);
    const updated = togglAgent.syncAchivements(acievements);
    console.log(`updated ${updated}`);
}
main();