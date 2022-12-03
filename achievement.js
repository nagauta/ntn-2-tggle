"use strict";
/**
 * デートを同期するための実績クラス
 */
module.exports = class Achivement {
    constructor(taskName, startDate, endDate, projectName) {
        this._taskName = taskName;
        this._startDate = startDate;
        this._endDate = endDate;
        this._projectName = projectName;
    }
    get taskName(){
        return this._taskName
    }
    get startDate(){
        return this._startDate
    }
    get endDate(){
        return this._endDate
    }
    get projectId(){
        return this._projectName
    }
    get projectName(){
        return this._projectName
    }
}
