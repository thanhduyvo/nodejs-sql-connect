var Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var async = require("async");

// Create connection to database
var config = {
  server: "localhost",
  authentication: {
    type: "default",
    options: {
      userName: "sa", // update me
      password: "your_password" // update me
    }
  },
  options: {
    database: "SampleDB"
  }
};

var connection = new Connection(config);

function Read(callback) {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  request = new Request(
    "SELECT Id, Name, Location FROM TestSchema.Employees;",
    function(err, rowCount, rows) {
      if (err) {
        callback(err);
      } else {
        console.log(rowCount + " row(s) returned");
        callback(null);
      }
    }
  );

  // Print the rows read
  var result = "";
  request.on("row", function(columns) {
    columns.forEach(function(column) {
      if (column.value === null) {
        console.log("NULL");
      } else {
        result += column.value + " ";
      }
    });
    console.log(result);
    result = "";
  });

  // Execute SQL statement
  connection.execSql(request);
}

function Complete(err, result) {
  if (err) {
    callback(err);
  } else {
    console.log("Done!");
  }
}

// Attempt to connect and execute queries if connection goes through
connection.on("connect", function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected");

    // Execute all functions in the array serially
    async.waterfall([Read], Complete);
  }
});
