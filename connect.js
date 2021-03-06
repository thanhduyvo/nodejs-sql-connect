var Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var async = require("async");

// update me
const SERVER_NAME = "<server>";
const USERNAME = "<username>";
const PASSWORD = "<password>";
const DATABASE_NAME = "<database>";

// update me
var select_statement = "<select_statement>";

// Create connection to database
var config = {
  server: SERVER_NAME,
  authentication: {
    type: "default",
    options: {
      userName: USERNAME,
      password: PASSWORD
    }
  },
  options: {
    database: DATABASE_NAME
  }
};

var connection = new Connection(config);

function Read(callback) {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  request = new Request(select_statement, (err, rowCount, rows) => {
    if (err) callback(err);
    else {
      console.log(rowCount + " row(s) returned");
      callback(null);
    }
  });

  // Print the rows read
  var result = "";
  request.on("row", columns => {
    columns.forEach(column => {
      if (column.value === null) console.log("NULL");
      else result += column.value + " ";
    });

    console.log(result);
    result = "";
  });

  // Execute SQL statement
  connection.execSql(request);
}

function Complete(err, result) {
  if (err) callback(err);
  else console.log("Done!");
}

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) console.log(err);
  else {
    console.log("Connected");

    // Execute all functions in the array serially
    async.waterfall([Read], Complete);
  }
});
