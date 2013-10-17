/*
* Process results from webtrends
*
* @param {String} jsondata
*/
var parseResults = function(jsondata){
  var subrows = "microsoft internet explorer,google chrome,firefox,safari,android browser";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  jsondata = Utilities.jsonParse(jsondata);

  if(!jsondata.data){Browser.msgBox("No data available");return;}
  
  var navs = jsondata.data[0].SubRows[0];
  var sorted,sorted2,nav,nav2;
  var totalH=0;
  
  var sortObj = function(a,setTotal){
    var s = []
    for(var x in a){
      if(!a[x] || !a[x].measures) continue;
      s.push([x, a[x].measures.Hits]);
      if(setTotal){
        totalH = totalH + parseInt(a[x].measures.Hits);
      }
    }
    return s.sort(function(a, b){return b[1] - a[1];});
  }
  sorted = sortObj(navs, true);

  ss.getRange("A1:H500").setValue("");
  ss.getRange("A1:H500").setFontWeight("normal");
  var c=5;
  ss.getRange("A"+c).setValue("Browser");
  ss.getRange("B"+c).setValue("Version");
  ss.getRange("C"+c).setValue("%");
  
  c++;
  var percent, sub_percent, sum_percent=0, sum_sub_percent=0;
  
  for(var i=0,z=sorted.length;i<z;i++){
    nav = sorted[i][0];
    percent = (navs[nav].measures.Hits/totalH)*100;

    if(percent<1){continue;}
    sum_percent += percent;
    
    ss.getRange("A"+c).setValue(nav);
    ss.getRange("A"+c).setFontWeight("bold");
    ss.getRange("C"+c).setValue(roundN(percent));
    
    c++;
    
    if(subrows.indexOf(nav.toLowerCase())>-1){
      sorted2 = sortObj(navs[nav].SubRows);
      sum_sub_percent = 0;
      for(var k=0,x=sorted2.length;k<x;k++){
        nav2 = sorted2[k][0];
        sub_percent = (navs[nav].SubRows[nav2].measures.Hits/totalH)*100;
        if(sub_percent<1){continue;}
        sum_sub_percent+=sub_percent;
        ss.getRange("B"+c).setValue(nav2);
        ss.getRange("C"+c).setValue(roundN(sub_percent));
        c++;
      }

      if(roundN(percent-sum_sub_percent)>0){
        ss.getRange("B"+c).setValue("Others <1%");
        ss.getRange("C"+c).setValue(roundN(percent-sum_sub_percent));
        c++;
      }
    }
  }

  if(roundN(100-sum_percent)<100){
    ss.getRange("A"+c).setValue("Others");
    ss.getRange("A"+c).setFontWeight("bold");
    ss.getRange("C"+c).setValue(roundN(100-sum_percent));
  }
  
  ss.getRange("A1").setValue("From");
  ss.getRange("B1").setValue("To");
  ss.getRange("A2").setValue(jsondata.data[0].start_date);
  ss.getRange("B2").setValue(jsondata.data[0].end_date);
  
  var email = ScriptProperties.getProperty("email");
  
  if(email){
    var pdf = DocsList.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId()).getAs('application/pdf').getBytes();
    var attach = {fileName:'browsers.pdf',content:pdf, mimeType:'application/pdf'};
    MailApp.sendEmail(email, "Browser statistics", "", {attachments:[attach]});
  }
  
  return;
}

/*
* Round numbers accurately to 2 decimals
*
* @param {Number} n
*/
var roundN = function(n){
  return Math.round((parseInt(n*1000)/1000)*100)/100;
}

function main(){
  var token = webtrends.getToken(ScriptProperties.getProperty("account"),ScriptProperties.getProperty("user"),ScriptProperties.getProperty("password"));
  webtrends.fetchData("7012",token,"current_day-91","current_day-1","https://ws.webtrends.com/v3/Reporting/profiles/%profile%/reports/95df19b6d9e/?start_period=%dateini%&end_period=%datefi%&language=en-US&format=json",parseResults);
}