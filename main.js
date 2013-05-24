/*
* Process results from webtrends
*
* @param {String} jsondata
*/
function parseResults(jsondata){
  
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
  ss.getRange("A"+c).setValue("Navegador");
  ss.getRange("B"+c).setValue("Versió");
  ss.getRange("C"+c).setValue("%");
  
  c++;
  var percent;
  
  for(var i=0,z=sorted.length;i<z;i++){
    nav = sorted[i][0];
    percent = (navs[nav].measures.Hits/totalH)*100;
    if(percent<1){continue;}
    
    ss.getRange("A"+c).setValue(nav);
    ss.getRange("A"+c).setFontWeight("bold");
    ss.getRange("C"+c).setValue(parseInt(percent*100)/100);
    
    c++;
    
    if(subrows.indexOf(nav.toLowerCase())>-1){
      sorted2 = sortObj(navs[nav].SubRows);
      for(var k=0,x=sorted2.length;k<x;k++){
        nav2 = sorted2[k][0]
        percent = (navs[nav].SubRows[nav2].measures.Hits/totalH)*100;
        if(percent<1){continue;}
        ss.getRange("B"+c).setValue(nav2);
        ss.getRange("C"+c).setValue(parseInt(percent*100)/100);
        c++;
      }      
    }
  }
  
  ss.getRange("A1").setValue("Des de");
  ss.getRange("B1").setValue("Fins a");
  ss.getRange("A2").setValue(jsondata.data[0].start_date);
  ss.getRange("B2").setValue(jsondata.data[0].end_date);
  
  var pdf = DocsList.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId()).getAs('application/pdf').getBytes();
  var attach = {fileName:'navegadors.pdf',content:pdf, mimeType:'application/pdf'};
  MailApp.sendEmail("davixyz@gmail.com", "Estadístiques navegadors", "", {attachments:[attach]});  
  
  return;
}

function main(){
  var token = webtrends.getToken(ScriptProperties.getProperty("user"),ScriptProperties.getProperty("password"));
  webtrends.fetchData("7012",token,"current_day-91","current_day-1","https://ws.webtrends.com/v3/Reporting/profiles/%profile%/reports/95df19b6d9e/?start_period=%dateini%&end_period=%datefi%&language=en-US&format=json",parseResults);
  //webtrends.fetchData("7012",token,webtrends.processDate("05/23/2013"),webtrends.processDate("05/23/2013"),"https://ws.webtrends.com/v3/Reporting/profiles/%profile%/reports/95df19b6d9e/?start_period=%dateini%&end_period=%datefi%&language=en-US&format=json",parseResults);
}