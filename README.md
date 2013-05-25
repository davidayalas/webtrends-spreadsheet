From Webtrends web services to Google SpreadSheets
====================================================

With this simple script you can connect your Google Drive Spreadsheets with Webtrends OnDemand Services.

Steps:

1. Create a Google Spreadsheet and go to Script Editor
2. Copy webtrends.js inside a new script file. This script manages the communication and auth.
3. Copy main.js. This is the custom script for the report we are consuming (Browsers by version). The callback is the custom function to parse the results and to fill the spreadsheet.
4. In this case, account, password and credentials are stored into ScriptProperties 
