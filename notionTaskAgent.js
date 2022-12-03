"use strict";
const { Client } = require("@notionhq/client")

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
/**
 * NotionタスクDB周りの操作を行う
 */
 module.exports = class NotionTaskAgent {
    constructor(){
        
    }
    async getProjects(){
        const ret = await notion.databases.query(
            {database_id: process.env.NOTION_PJ_DB_ID}
            );
        const projects = [];
        for (const p in ret.results) {
            if (Object.hasOwnProperty.call(ret.results, p)) {
                const e = ret.results[p]["properties"]["Name"]["title"][0]["plain_text"];
                if(e === undefined) {
                    console.log(`got undefined projects`);
                }
                projects.push(e);
            }
        }
        return projects;
    }
    getAchivementsToday(){
        return[]
    }
    updateAchivement(achivement){

    }
}