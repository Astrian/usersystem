var sqlite = require('sqlite3')
exports.write = function (statements, back) {
  var db = new sqlite.Database('./data.db', function () {
    db.run(statements, back)
  })
}
exports.read = function (statements, back) {
  var db = new sqlite.Database('./data.db', function () {
    db.all(statements, back)
  })
}
