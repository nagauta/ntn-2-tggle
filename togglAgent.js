"use strict";
const {DateTime} = require("luxon")
const TogglClient = require('toggl-api');
const TogglProject = require('./tggleProject');
const TimeEntrie = require('./timeEntrie');

console.log(`process.env.TOGGL_TRACK_TOKEN ${process.env.TOGGL_TRACK_TOKEN}`);

const toggl = new TogglClient({ apiToken: process.env.TOGGL_TRACK_TOKEN });
/**
 * Toggleタスク周りの操作を行う
 */
module.exports = class TogglAgent {
    constructor() {

    }
    async getProjects() {
        return await new Promise((resolve, reject) => {
            toggl.getWorkspaceProjects(process.env.TOGGL_TRACK_WORKSPACE_ID, function (err, ret) {
                console.log(ret);
                const pjs = [];
                for (const pj in ret) {
                    if (Object.hasOwnProperty.call(ret, pj)) {
                        const id = ret[pj]["id"];
                        const name = ret[pj]["name"];
                        const togglProject = new TogglProject(id, name);
                        pjs.push(togglProject);
                    }
                }
                resolve(pjs);
            })
        });
    }
    async syncProjects(pjs) {
        const tgglPjs = await this.getProjects();
        console.log(`tgglPjs ${tgglPjs}`);
        console.log(`notion Pjs ${pjs}`);
        for (const pj of pjs) {
            console.log(`is ${pj} in is ...  ${tgglPjs.includes(pj)}`);
            if (!tgglPjs.some(tPj => tPj.name === pj)) {
                this.addPj(pj);
            }
        }
    }
    async addPj(pj) {
        return await new Promise((resolve, reject) => {
            const data = {
                "name": pj,
                "wid": process.env.TOGGL_TRACK_WORKSPACE_ID,
                "template_id": -1,
                "is_private": true,
                "cid": -1
            };
            console.log(`adding ${JSON.stringify(data)}`);
            toggl.createProject(data, function (err, pjData) {
                console.log(err);
                console.log(`added ${JSON.stringify(pjData)}`);
                resolve(true);
            })
        });

    }
    async getTimeEntries(date) {
        return await new Promise((resolve, reject) => {
            const startDate = DateTime.fromISO(date);
            const endDate = (startDate.plus({ days: 1 }).minus({seconds: 1}));
            toggl.getTimeEntries(startDate.toISO(), endDate.toISO(), function (err, ret) {
                const tes = [];
                for (const te of ret) {
                    tes.push(new TimeEntrie(te["description"], te["start"], te["wid"], te["pid"], te["id"]));
                }
                resolve(tes);
            });
        });
        return []
    }
    async deleteTimeEntries(timeEntries){
        return await new Promise((resolve, reject) => {
            const deleteIds = []
            for (const te of timeEntries) {
                deleteIds.push(this.deleteTimeEntrie(te.id));
            }
            resolve(deleteIds);
        });
    }
    async deleteTimeEntrie(timeEntrieId){
        return await new Promise((resolve, reject) => {
            toggl.deleteTimeEntry(timeEntrieId, function (err, ret) {
                console.log(`ret ${ret}`);
                resolve(ret);
            });
        });
    }
    async syncAchivements(achivements){
        const ret = [];
        for (const achivement of achivements) {
            ret.push(await this.syncAchivement(achivement));
        }
        return ret;
    }
    async syncAchivement(achivement) {
        const tgglPjs = await this.getProjects();
        const tgglPj = tgglPjs.find(pj => pj.name === achivement.projectName);
        const duration = (achivement.endDate - achivement.startDate) / (1000)
        const data = {
            "description": achivement.taskName,
            "wid": process.env.TOGGL_TRACK_WORKSPACE_ID,
            "duration": duration,
            "start": achivement.startDate,
            "pid":tgglPj.id
        };
        return await new Promise((resolve, reject) => {
            toggl.createTimeEntry(data, function (err, ret) {
                console.log(ret);
                console.log(`added ${JSON.stringify(ret)}`);
                resolve(true);
            })
        });
    }
}