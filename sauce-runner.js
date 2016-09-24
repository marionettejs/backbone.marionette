const easySauce = require('easy-sauce');

easySauce({
  "name": "Marionette.js",
  "username": process.env.SAUCE_USERNAME,
  "key": process.env.SAUCE_ACCESS_KEY,
  "tests": "/test/runner.html",
  "port": "8080",
  "framework": "mocha",
  "platforms": [
    ["Windows 7", "internet explorer", "9.0"],
    ["Windows 8", "internet explorer", "10.0"],
    ["Windows 8.1", "internet explorer", "11.0"],
    ["Windows 10", "MicrosoftEdge", "latest"],
    ["Windows 10", "chrome", "latest"],
    ["Windows 10", "firefox", "latest"],
    ["OS X 10.11", "chrome", "latest"],
    ["OS X 10.11", "firefox", "latest"],
    ["OS X 10.11", "safari", "9.0"]
  ]
})
.on('message', function(message) {
  // A message has been emitted, inform the user.
  console.log(message);
})
.on('update', function(job) {
  // A job's status has been updated
  console.log(job.status);
})
.on('done', function(passed, jobs) {
  // All tests have completed!
  if (passed) {
    console.log('All tests passed!');
  }
  else {
    console.log('Oops, there were failures:\n' + jobs);
  }
})
.on('error', function(err) {
  // An error occurred at some point running the tests.
  console.error(err.message);
});