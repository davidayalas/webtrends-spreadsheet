From Webtrends web services to Google SpreadSheets
====================================================

With this simple script you can connect your Google Drive Spreadsheets with Webtrends OnDemand Services.

Steps:

1. Create a Google Spreadsheet and go to Script Editor
2. Copy webtrends.js inside a new script file. This script manages the communication and auth.
3. Copy main.js. This is the custom script for the report we are consuming (Browsers by version). The callback is the custom function to parse the results and to fill the spreadsheet. In this case, we only need browsers with more than 1%. You have to put your account, user and password into ScriptProperties and schedule execution of "main" function.

	[<img src="https://raw.github.com/davidayalas/webtrends-spreadsheet/master/img/screenshot1.png">](https://raw.github.com/davidayalas/webtrends-spreadsheet/master/img/screenshot1.png) <br /><br />

5. You can consume Google Spreadsheet data with Google Data API and put the data in any webpage. A sample [here](http://htmlpreview.github.io/?https://github.com/davidayalas/webtrends-spreadsheet/master/sample/index.html) 
