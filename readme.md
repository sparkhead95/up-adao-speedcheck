**Website Speed Check API**
==


**To Run:**

`npm install`

`npm start`

The client is able to request speed data for any amount of URL's at the /api endpoint. 
The body of the request must be raw JSON, containing a `urls` variable that can be a string url or an array of string urls.
######The server is set to run on port 3000 by default.

**To Test:**

`npm test`

######The test script also creates a coverage file, where you can see how thorough I was in the unit tests.
######This can be found in ./coverage/lcov-report/index.html

