"use strict";
const path = require('node:path');
require('dotenv').config({path: path.resolve(__dirname, '.env')});
const {DateTime} = require("luxon")
const NotionTaskAgent = require('./notionTaskAgent')
const TogglAgent = require('./togglAgent')

const ntnTskAgnt = new NotionTaskAgent();
const togglAgent = new TogglAgent();
/**
 * 
 * @param {*} targetDate yyyy-MM-dd
 */
 exports.syncTogglAByNtn = async function(targetDate) {
    if(!isValidDate(targetDate)){
        throw new Error("日付(yyyy-MM-dd)を指定するように");
    }
    
    const tes = await togglAgent.getTimeEntries(targetDate);
    await togglAgent.deleteTimeEntries(tes);
    syncProjectsToToggle();
    syncAcheivementsToToggle(targetDate);
}
function isValidDate(targetDate){
    console.log(`targetDate ${targetDate}`);
    return targetDate.search(/\d{4}\-\d{2}\-\d{2}$/) ==! -1;
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
