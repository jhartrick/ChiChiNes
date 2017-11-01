function dependOn(){"use strict";return[require("communicate"),require("util"),require("common"),require("proxy"),require("analytics")]}var def;require=function(a){"use strict";return a},def=window.define?window.define:function(a,b){"use strict";return b.apply(null,[{ajax:$.ajax.bind($)}])};var exports=acom_analytics={};def(dependOn(),function(a,b,c,d,e){"use strict";function j(a){return a.replace(/\/$/,"").split("/").splice(-1)[0].replace(/\?\S*/,"")}var g,h,i,f=null;i=function(){return a.getModule("session")},g=function(){this.LOG=c.LOG,this.proxy=d.proxy.bind(this),this.ajaxRequest=function(a){var d=b.Deferred();return c.ajaxReady(!0).then(function(){i().newSession(null,!0,{filename:a.filename}),d.resolve()},this.proxy(function(){i().sign_in(a).then(function(){d.resolve()},function(){d.reject(),b.consoleLog("upload rejected")})})),d},this.sendIt=function(a,e){var g,f=b.newFormData();return g={name:e.filename,parent_id:c.settings.files_root,on_dup_name:"auto_rename",ignore_content_type:!0,source_url:e.url},f.append("metadata",JSON.stringify(g)),f.append("file",a,e.filename),b.ajax({url:c.settings.files_upload+"assets",type:"POST",processData:!1,data:f,contentType:!1,headers:c.GET_headers()}).then(function(a){return a.request=e,a},this.proxy(function(a){return d.REST_error(a,this),a}))},this.upload=function(a){return a.upload_promise=b.Deferred(),a.filename||(a.filename=j(a.url)),i().sessionRequest(a),this.ajaxRequest(a).then(this.proxy(function(){e.event(e.e.UPLOAD_PROGRESS_SHOWN);var f;if(0===a.url.indexOf("data"))throw new Error("Can't upload Data URIs (Yet)");f=b.newXHR(),f.open("GET",a.url,!0),f.responseType="blob",f.onload=this.proxy(function(c){if(200===f.status){a.mime&&f.response.type!==a.mime&&(i().error({error:"Unexpected mime type",received:f.response.type,expected:a.mime,url:a.url,timestamp:(new Date).getTime()}),this.LOG("UnexpectedMimeType: "+f.response.type+" ExpectedMimeType"+a.mime),e.event(e.e.ERROR_WRONG_MIME_TYPE),a.upload_promise.reject(f));var g=b.newBlob([f.response]);this.sendIt(g,a).then(this.proxy(function(c){return b.consoleLogDir(c),a.upload_promise.resolve(c),c}),this.proxy(function(b){return a.upload_promise.reject(b),d.REST_error(b,this),b}))}}),f.send()})),a.upload_promise.promise()},this.uploadHTML=function(a,c){return c.upload_promise=b.Deferred(),c.filename||(c.filename=j(c.url)),c.filename=c.filename.replace(".pdf",".zip"),this.sendIt(a,c).then(this.proxy(function(a){return b.consoleLogDir(a),c.upload_promise.resolve(a),a})),c.upload_promise.promise()}},f||(f=new g,a.registerModule("upload",f));for(h in f)f.hasOwnProperty(h)&&("function"==typeof f[h]?exports[h]=f[h].bind(f):exports[h]=f[h]);return f});