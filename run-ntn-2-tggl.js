#!#!/usr/bin/env node
// ディレクトリは絶対パスで書き直すこと
const ntn2togglAgent = require("/ntn2togglAgent")
// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title run ntn-2-tggl
// @raycast.mode fullOutput

// Optional parameters:
// @raycast.packageName ntn-2-tggl
// @raycast.argument1 { "type": "text", "placeholder": "yyyy-MM-dd"}
ntn2togglAgent.syncTogglAByNtn(process.argv[2]);