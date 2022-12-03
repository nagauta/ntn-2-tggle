"use strict";
/**
 * toggl timeEntries
 */
module.exports = class TimeEntrie {
    constructor(taskName, startDate, wid, pid, teId) {
        this._teId = teId;
        this._wid = wid;
        this._pid = pid;
        this._taskName = taskName;
        this._startDate = startDate;
    }
    get workspaceId(){
        return this._wid
    }
    get projectId(){
        return this._pid
    }
    get id(){
        return this._teId
    }
    get taskName(){
        return this._taskName
    }
    get startDate(){
        return this._startDate
    }
}
