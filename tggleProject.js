
"use strict";
/**
 * デートを同期するための実績クラス
 */
module.exports = class TogglProject {
    constructor(id, name) {
        this._id = id;
        this._name = name;
    }
    get id(){
        return this._id
    }
    get name(){
        return this._name
    }
}
