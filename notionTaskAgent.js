"use strict";
const { Client } = require("@notionhq/client")
const Achivement = require("./achievement")

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});
/**
 * NotionタスクDB周りの操作を行う
 */
module.exports = class NotionTaskAgent {
    constructor() {

    }
    async getProjects() {
        const ret = await notion.databases.query(
            { database_id: process.env.NOTION_PJ_DB_ID }
        );
        const projects = [];
        for (const p in ret.results) {
            if (Object.hasOwnProperty.call(ret.results, p)) {
                const e = ret.results[p]["properties"]["Name"]["title"][0]["plain_text"];
                if (e === undefined) {
                    console.log(`got undefined projects`);
                }
                projects.push(e);
            }
        }
        return projects;
    }
    async getAchivements(date) {
        const achievement_pages = await notion.databases.query(
            { database_id: process.env.NOTION_ACIEVEMENTS_DB_ID ,
                filter: {
                    property: "見積もり日時",
                    date:{
                        equals:date
                    }
                  },
                },
        );
        const tasks_pages = await notion.databases.query(
            { database_id: process.env.NOTION_TASKS_DB_ID }
        );
        const achievements = [];
        for (const p in achievement_pages.results) {
            if (Object.hasOwnProperty.call(achievement_pages.results, p)) {
                try {
                    const start = achievement_pages.results[p].properties.実績日.date?.start
                    const end = achievement_pages.results[p].properties.実績日.date?.end
                    const relationId = achievement_pages.results[p]["properties"]["tasks"]["relation"][0]["id"];
                    if(start === undefined || end === undefined){
                        console.log(`実績日なし : ${relationId}`);
                        continue;
                    }
                    const startDate = new Date(achievement_pages.results[p].properties.実績日.date?.start)
                    const endDate = new Date(achievement_pages.results[p].properties.実績日.date?.end)
                    if (relationId === undefined) {
                        console.log(`got undefined projects`);
                    }
                    const taskPage =  await notion.pages.retrieve(
                        { page_id: relationId }
                        );
                    const projectRelationId = taskPage["properties"]["projects"]["relation"][0]["id"]
                    console.log(`projectRelationId ${projectRelationId}`);
                    const pjPage =  await notion.pages.retrieve(
                        { page_id: projectRelationId }
                    );
                    const taskName = taskPage["properties"]["タスク名"]["title"][0]["plain_text"];
                    const pjName = pjPage["properties"]["Name"]["title"][0]["plain_text"];
                    achievements.push(new Achivement(taskName, startDate, endDate, pjName));
                } catch (error) {
                    console.log(`${error}`);
                }
            }
        }
        return achievements;
    }
    updateAchivement(achivement) {

    }
}