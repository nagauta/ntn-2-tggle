"use strict";
require('dotenv').config();
const {DateTime} = require("luxon")
const NotionTaskAgent = require('./notionTaskAgent')
const TogglAgent = require('./togglAgent')

const ntnTskAgnt = new NotionTaskAgent();
const togglAgent = new TogglAgent();
/**
 * 
 * @param {*} targetDate yyyy-MM-dd
 */
async function main(targetDate) {
    
    const tes = await togglAgent.getTimeEntries(targetDate);
    await togglAgent.deleteTimeEntries(tes);
    syncProjectsToToggle();
    syncAcheivementsToToggle(targetDate);
}
async function syncProjectsToToggle() {
    let ret = await ntnTskAgnt.getProjects();
    console.log(`${JSON.stringify(ret)}`);
    togglAgent.syncProjects(ret);
}
async function syncAcheivementsToToggle(targetDate) {
    const acievements = await ntnTskAgnt.getAchivements(DateTime.now().toFormat(targetDate));
    console.log(`acievements ${acievements}`);
    const updated = await togglAgent.syncAchivements(acievements);
    console.log(`updated ${updated}`);
}

if(process.argv[2] === undefined){
    throw new Error("日付(yyyy-MM-dd)を指定するように");
}
main(process.argv[2]);