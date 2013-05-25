/*
* Object to manage webtrends services functionality (auth, url, dates, ...)
*/
var webtrends = {};

/*
* Fill with one zero day and month, if necessary
*
* @param {String} str to fill
*/
webtrends.fillZeros=function(str){
  str = str.toString();
  if(str.length==1){
    str="0"+str;
  }
  return str;
}

/*
* Process the data with the format required by webtrends
*
* @param {Date} date 
*               it can be a string date like "mm/dd/yyyy"   
*/
webtrends.processDate = function(date){
  if(date && date!=""){
    date = new Date(date);
    Logger.log( date.getFullYear() + "m" + this.fillZeros(date.getMonth()+1)+ "d" + this.fillZeros(date.getDate()));
    return date.getFullYear() + "m" + this.fillZeros(date.getMonth()+1)+ "d" + this.fillZeros(date.getDate());
  }else{
    return null;
  }   
}

/*
* Fetch data from webtrends
*
* @param {String} profile
* @param {String} token
* @param {String} dateini: data inicial
* @param {String} datefi: data final
* @param {String} url to fetch
* @param {Function} callback
*/
webtrends.fetchData = function(profile,token,dateini,datefi,_url,callback){
  var options = {
    headers:{
      "Authorization" : "Basic "+ token,
      "method" : "post"
    }
  };
    
  if(profile && dateini && datefi){
    _url = _url.replace("%profile%",profile).replace("%dateini%",dateini).replace("%datefi%",datefi);
  }
  
  var response = UrlFetchApp.fetch(_url,options);
  var json = response.getContentText().replace(/\\u00/g,"%");
  
  //var results = Utilities.jsonParse(json);

  if(typeof(callback)=="function"){
    callback(json,dateini,datefi);
  }
}

/*
* Gets auth token
*
* @param {String} account
* @param {String} user
* @param {String} pass
*/  
webtrends.getToken = function(account,usuari,_pass){
  return Utilities.base64Encode(account+"\\"+usuari+":"+_pass);
}


