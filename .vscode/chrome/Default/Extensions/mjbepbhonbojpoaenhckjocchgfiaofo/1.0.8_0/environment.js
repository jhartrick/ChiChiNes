Registry.registerRaw("environment.js","58",function(){Context.domContentLoaded|=0;Context.pageLoaded|=0;Context.domNodeInserted|=0;Context.props={};Context.adjustLogLevel=function(a){void 0!==a&&(logLevel=a);D|=60<=logLevel};var C=[],ha=function(a){var b;console.log("handleWatchOnlineContextMenu: url="+a+" handlers="+C.length);for(b=0;b<C.length;b++)C[b].call(null,a)},w=function(){var a={objs:{},push:function(b,d){0!==d&&1!==d&&(d=0);var c=Math.floor(19831206*Math.random()+1);a.objs[c]={fn:b,prio:d};
return c},remove:function(b){delete a.objs[b]},get:function(b){for(var d=[],c=0;1>=c;c++)for(var g in a.objs)a.objs.hasOwnProperty(g)&&(a.objs[g].prio!==c||void 0!==b&&g!=b||d.push(a.objs[g].fn));return void 0===b?d:d[0]},finalize:function(b){if(void 0===b){b=a.get();for(var d=0;d<b.length;d++)b[d]()}else return a.objs[b]&&(d=a.objs[b].fn(),delete a.objs[b]),d}};return a}();Context.adjustLogLevel();var O=function(a){return{}.toString.apply(a).match(/\s([a-z|A-Z]+)/)[1]},L=function(a,b){void 0==b&&
(b=100);return b&&a&&(a==document||L(a.parentNode,b-1))},U=function(){var a=function(){};a.prototype={};return new a},ka=function(a,b){var d=["blur","close","focus","postMessage"],c=["eval"],g={};a.forEach(function(a){a.context_prop&&(g[(a.name.split(".")||[])[1]]=!0)});var e=function(a,b,f,k){var m=function(f,m,d,c,k){var e=m[d];c&&"string"===typeof e?m[d]=new Function(e):k&&(m[d]=function(){return e.apply(a,arguments)});return f.apply(b,m)},e=function(f){return f==b?a:f},P=function(a,b,f,m){f||
(f=a);var d=function(){var d=a[b].apply(f,arguments);m&&(d=m(d));return d};d.__proto__=a[b];d.prototype=a[b].prototype;return d},u=function(f){var d,m,c=null,c=function(c){d=c;m=function(){return c.apply(a,arguments)};b[f]=m};a.__defineGetter__(f,function(){return void 0===d||m!==b[f]?b[f]:d});a.__defineSetter__(f,c)},z=function(f,d){var m,c=null,k=null,c="function"===typeof d.get?d.get:function(){d.opts&&d.opts.get_cb&&d.opts.get_cb.apply(this,[arguments,z]);return void 0===m?e(b[f]):m};"function"===
typeof d.set?k=d.set:d.get||(k=function(a){m=a});c&&a.__defineGetter__(f,c);k&&a.__defineSetter__(f,k)};Object.keys(k).forEach(function(a){f[a]=f[a]||!1!==k[a]});Object.keys(f).forEach(function(n){if(!1!==k[n]){var t,p={};try{try{!(t=k[n])||t.needs_grant&&!0!==g[n]?"function"===typeof b[n]?f[n].proto?p.wrap=!0:b[n].prototype&&-1==d.indexOf(n)||-1!=c.indexOf(n)?p.direct=!0:p.bind=!0:"number"===typeof b[n]||"string"===typeof b[n]?p.get=!0:f[n].event&&f[n].proto?p.event=!0:p.direct=!0:t.wrap?(p.wrap=
!0,p.that=t.that):t.direct?p.direct=!0:t.enhance?p.enhance=t.enhance:t.get||t.set?(p.get=t.get,p.set=t.set,p.opts=t.opts):t.wrap_callback&&(p.enhance=function(){var a=t.wrap_callback,f=b[n];return function(){return m(f,arguments,a.cb_index,a.auto_eval,a.set_context)}}())}catch(q){p.get=!0}p.direct?a[n]=e(b[n]):p.bind?a[n]=b[n].bind(b):p.enhance?a[n]=p.enhance:p.event?u(n):p.get||p.set?z(n,p):p.wrap&&(a[n]=P(b,n,p.that,e))}catch(q){console.warn("env: error while creating a new sandbox: "+q.message)}}});
return a};return function(){var a=U(),d={setTimeout:{wrap_callback:{cb_index:0,auto_eval:!0,set_context:!0}},setInterval:{wrap_callback:{cb_index:0,auto_eval:!0,set_context:!0}},close:{needs_grant:!0,get:function(){return window.self==window.top?function(a){return ia(a)}:window.close}},focus:{needs_grant:!0,get:function(){return function(a){return ja(a)}}},location:{get:!0,set:function(a){window.location.href=a}},document:{get:function(){var a=window.document;b(a);return a}},clearInterval:{get:function(){return safeWindow.clearInterval}},
clearTimeout:{get:function(){return safeWindow.clearTimeout}},addEventListener:{wrap_callback:{cb_index:1,auto_eval:!0}},removeEventListener:{wrap_callback:{cb_index:1,auto_eval:!0}}};(function(){var a=Math.max(window.frames.length,7);d.length={get:!0,opts:{get_cb:function(b,f){for(var d=window.frames.length,c=a;c<d;c++)f(String(c),{get:!0});a=Math.max(d,a)}}};for(var b=0;b<a;b++)d[String(b)]={get:!0}})();["confirm","prompt","alert"].forEach(function(a){d[a]={enhance:safeWindow[a]}});var f=e(a,window,
Context.windowProps,d),c={context:f,filter:function(a){return a==window?f:a},filterEvent:function(a){var b={},f;for(f in a)if("function"===typeof a[f])b[f]=function(){var b=f;return function(){return a[b].apply(a,arguments)}}();else{var d=c.filter(a[f]);b[f]=d}return b}};return c}()},la=function(a,b,d,c,g,e){var h=null;try{var l=c.sandboxes[a.uuid];l.__TMbackref||(l.__TMbackref={});var f=["context"],k=[void 0];c.elements[a.uuid].forEach(function(a){a.name?a.overwrite?(f.push(a.name),k.push(a.value)):
a.scriptid?(l.__TMbackref[a.name+"_"+a.scriptid]=a.value,f.push(a.name),k.push('context.__TMbackref["'+a.name+"_"+a.scriptid+'"]')):a.context_prop||(l[a.name]=a.value,f.push(a.name),k.push("context."+a.name)):D&&console.warn("env: WARN: unexpected item in props elem: "+JSON.stringify(a))});h=['with (context) {(function(module) {"use strict";try {\nmodule.apply(context, [',k.join(","),"]);} catch (e) {if (e.message && e.stack) {console.error(\"ERROR: Execution of script '",a.name.replace(/(['"])/g,
"\\$1"),'\' failed! " + e.message);console.log(e.stack.replace(/(\\\\(eval at )?<anonymous>[: ]?)|([\\s.]*at Object.tms_[\\s\\S.]*)/g, ""));} else {console.error(e);}}\n})(function ',e,"(",f.join(","),") {",Context.enforce_strict_mode?'"use strict";\n':"",d,b,"\n})}\n"].join("");c=function(a,b){(new Function("context",h)).apply(b,[b])};g?g(c,[h,l]):c(h,l)}catch(m){chromeEmu.extension.sendMessage({method:"syntaxCheck",code:[d,b].join("")},function(f){var c="";if(f.errors){var c=d.split("\n").length-
1,l="",k;for(k in f.errors){var e=f.errors[k];if(e&&0<=e.line&&e.reason)var g=e.line,l=l+[g>c?"script:":"require:"," (",e.code,") ",e.reason.replace(/.$/,"")," on line: ",g>c?g-c:g," at character: ",e.character,"\n"].join("")}c="JSHINT output:\n"+l}else c=b;k=m.stack?m.stack.replace(/(\\(eval at )?<anonymous>[: ]?)|([\s.]*at Object.tms_[\s\S.]*)/g,""):"";D||f.errors?console.error("Syntax error @ '"+a.name+"'!\n##########################\n"+c+"##########################\n\n"+k):console.error("Syntax error @ '"+
a.name+"'!\n\n",k);safeWindow.setTimeout(function(){D&&chromeEmu.extension.sendMessage({method:"copyToClipboard",data:{content:b,type:"test"},id:"42"},function(){});throw m;},1)})}},E=[],q={events:[],done:{},running:null},I=function(a,b,d,c){var g={attrChange:0,attrName:null,bubbles:!0,cancelBubble:!1,cancelable:!1,clipboardData:void 0,currentTarget:null,defaultPrevented:!1,eventPhase:0,newValue:null,prevValue:null,relatedNode:null,returnValue:!0,srcElement:null,target:null,timeStamp:(new Date).getTime()};
d="string"===typeof d?new Function(d):d;var e=new Event,h;for(h in g)e[h]=g[h];for(h in b)e[h]=b[h];e.type=a;d.apply(c,[e])},G=function(){Context.domContentLoaded||!D||console.log("env: DOMContentLoaded Event!");Context.domContentLoaded=!0;F();safeDocument.removeEventListener("DOMContentLoaded",G,!1)},M=function(a){Context.domNodeInserted||!D||console.log("env: first DOMNodeInserted Event!");Context.domNodeInserted=!0;q&&q.events.push({event:a,domContentLoaded:Context.domContentLoaded})},J=function(){Context.pageLoaded||
!D||console.log("env: load Event!");Context.domContentLoaded=!0;Context.pageLoaded=!0;F();safeDocument.removeEventListener("DOMContentLoaded",G,!1);safeDocument.removeEventListener("load",J,!1)},V=function(){safeDocument.removeEventListener("DOMNodeInserted",M,!1);safeDocument.removeEventListener("DOMContentLoaded",G,!1);safeDocument.removeEventListener("load",J,!1);safeWindow.removeEventListener("unload",V,!1);if(null!=w){for(var a=w.get(),b=0;b<a.length;b++)a[b]();w=null}chromeEmu.clean&&chromeEmu.clean()},
F=function(){for(var a=E.length;0<E.length;)E.shift().fn();window.setTimeout(function(){q&&(q=null)},2E3);return a},W=function(a){if(document.body)a&&(a(),a=null);else{var b=["load","DOMNodeInserted","DOMContentLoaded"],d=function(){b.forEach(function(a){safeDocument.removeEventListener(a,d,!1)});W(a)};b.forEach(function(a){safeDocument.addEventListener(a,d,!1)})}},X=function(a){E.push({fn:a});Context.domContentLoaded?F():D&&console.log("env: schedule for later events!")},ma=function(a){return X(function(){safeWindow.setTimeout(a,
1)})},B=null,Y=function(a){B||(B={},["write","writeln"].forEach(function(b){B[b]=a.__proto__[b];a.__proto__[b]=function(){var d=document.documentElement,c=B[b].apply(a,arguments);d!==document.documentElement&&(B=null,Y(document),Context.write_listeners.forEach(function(a){a()}));return c}}))},S={},x=[],Z=function(a,b,d,c){if(!a.__addEventListener){a.__addEventListener=a.addEventListener;a.__removeEventListener=a.removeEventListener;var g=[],e=function(a){for(var b=0;b<g.length;b++)if(g[b].fn===a)return b};
a.removeEventListener=function(a,b,d){d=!!d;"DOMNodeInserted"==a&&q&&q.running==b&&(q.running=null);var c,h;if(void 0!==(c=e(b))&&(h=g[c].listeners)){if(b=h[a+"-"+d])this.__removeEventListener(a,b,d),delete h[a+"-"+d];Object.getOwnPropertyNames(h).length||g.splice(c,1)}else this.__removeEventListener(a,b,d)};var h=function(a,b,d,c){if(b){var e=x.length;b=parseInt(["DOMContentLoaded"==d?1:2,c?1:2,c?b:3-b,(new Date).getTime()].join("0"));for(d=0;d<x.length;d++)if(c=x[d],!c||!c.prio||c.prio>b){e=d;break}x.splice(e,
0,{prio:b,fn:a})}else x.push({fn:a})};a.addEventListener=function(a,f,k){if("load"==a||"DOMContentLoaded"==a||"DOMNodeInserted"==a){k=!!k;var m=!0,A=this;if(!c)try{try{throw Error();}catch(p){var P=/tms_[0-9a-f_]+/;if(p.stack)for(var u=p.stack.split("\n"),z,n=0;n<u.length&&(!(z=u[n].match(P))||!(c=S[z[0]]));n++);else{var t=function(a,b){void 0===b&&(b=10);if(0==b)return null;if(a.caller){var d,f,c;try{return c=a.caller.toString(),(f=c.match(/^function[^(]+/))&&f.length&&(d=f[0].match(P))?d[0]:t(a.caller,
b-1)}catch(e){D&&console.warn("env: unable to detect caller context",e)}}return null};if(n=t(arguments.callee))c=S[n]}}}catch(p){D&&console.error("env: Error: event "+a,p)}c&&"document-idle"!==c.run_at&&(u=null,"load"==a?Context.pageLoaded&&(u=function(){var a=A.document||A,a=a||document;I("load",{attrName:"null",newValue:"null",prevValue:"null",eventPhase:Event.AT_TARGET,attrChange:MutationEvent.ADDITION,target:a,relatedNode:a,srcElement:a},f,A)},m=!1,h(u,b,a,k)):"DOMContentLoaded"==a?Context.domContentLoaded&&
(u=function(){var a=A.document||A,a=a||document;I("DOMContentLoaded",{attrName:"null",newValue:"null",prevValue:"null",eventPhase:Event.AT_TARGET,attrChange:MutationEvent.ADDITION,target:a,relatedNode:a,srcElement:a},f,A)},m=!1,h(u,b,a,k)):"DOMNodeInserted"==a&&q&&!q.done[c.uuid]&&(q.done[c.uuid]=!0,u=function(){var b="document-start"!==c.run_at&&"document-body"!==c.run_at;q.running=f;if(q.running){a:if(q)for(var d=q.events.length,e=0;e<d;e++)if(b&&!q.events[e].domContentLoaded||I("DOMNodeInserted",
{attrName:"",newValue:"",prevValue:"",eventPhase:Event.AT_TARGET,target:q.events[e].event.target,relatedNode:q.events[e].event.relatedNode,srcElement:q.events[e].event.srcElement},f,A),!q.running)break a;A.__addEventListener(a,f,k)}q.running=null},h(u)),u&&(safeWindow.setTimeout(function(){if(x.length){var a=x.shift();a&&a.fn&&a.fn()}},1),m=!1));m&&(m=function(a){return f.call(this,d(a))},void 0===(n=e(f))&&(n=g.length,g.push({fn:f,listeners:{}})),g[n].listeners[a+"-"+k]=m,this.__addEventListener(a,
m,k))}else this.__addEventListener(a,f,k)};w.push(function(){a.removeEventListener=a.__removeEventListener;a.addEventListener=a.__addEventListener})}},na=function(a){a.__evaluate||(a.__evaluate=a.evaluate,a.evaluate=function(a,d,c,g,e){d||(d=this);var h;if("undefined"!=typeof XPathResult){var l=null;try{h=this.__evaluate(a,d,c,g,e)}catch(k){l=k}var f=!1;try{f|=!!h.snapshotLength}catch(k){}try{f|=!!h.singleNodeValue}catch(k){}if(!f&&"."!=a.charAt(0)&&!L(d)){a=("/"==a.charAt(0)?".":"./")+a;try{h=this.__evaluate(a,
d,c,g,e)}catch(k){}}if(!f&&l)throw l;}else h=d.selectNodes(a);return h},w.push(function(){a.evaluate=a.__evaluate}))},aa=function(a){w.finalize(a)},ba=function(a,b,d){var c=TM_context_id+"#"+a,g=null,e=chromeEmu.extension.connect("registerMenuCommand_"+c);e.postMessage({method:"registerMenuCmd",name:a,id:TM_context_id,menuId:c,accessKey:d});e.onMessage.addListener(function(a){a.run&&null!==g&&void 0!==w.get(g)?safeWindow.setTimeout(function(){b()},1):null!==g&&(w.remove(g),g=null)});e.onDisconnect.addListener(function(){e=
null});return g=w.push(function(){e&&e.disconnect()},1)},ca=function(a,b){"boolean"===typeof b?b={loadInBackground:b}:b||(b={});var d=void 0===b.active?void 0===b.loadInBackground?!0:!b.loadInBackground:b.active,c=void 0===b.insert?!0:b.insert,g=null,e=!1,h=null,l,f=chromeEmu.extension.connect("openInTab_"+TM_context_id),k=function(){var a=[];return{run:function(b){b&&a.push(b);if(g)for(;a.length;)a.pop()()}}}();a&&0==a.search(/^\/\//)&&(a=window.location.protocol+a);f.onMessage.addListener(function(a){a.tabId?
e?m():(g=a.tabId,k.run()):a.name?l=a.name:a.close&&(e=!0,h&&(h(),h=void 0))});f.onDisconnect.addListener(function(){f=null});f.postMessage({method:"openInTab",details:{url:a,id:TM_context_id,options:{active:!!d,insert:!!c}},id:TM_context_id});var m=function(){f&&f.postMessage({method:"closeTab",id:TM_context_id})},d={};Object.defineProperties(d,{close:{value:function(){e?D&&console.debug("env: attempt to close already closed tab!"):(e=!0,m())}},closed:{get:function(){return e}},onclose:{get:function(){return h},
set:function(a){h=a}},name:{get:function(){return l},set:function(a){k.run(function(){f&&f.postMessage({method:"nameTab",id:TM_context_id,name:a})})}}});return d},da=function(a,b){var d=!1,c="Object"===O(a)?a:{url:a,name:b};c.url&&"/"===c.url[0]&&(c.url=window.location.origin+c.url);var g=c.context;delete c.context;var e=chromeEmu.extension.connect("download_"+TM_context_id);e.postMessage({method:"download",details:c,id:TM_context_id});var h=function(a,b){b=b||{};a&&!d&&safeWindow.setTimeout(function(){a.apply(b,
[b])},1)};e.onMessage.addListener(function(a){try{a.data&&g&&(a.data.context=g),a.load?c.onload&&(a.data.responseXML&&(a.data.responseXML=safeWindow.unescape(a.data.responseXML)),h(c.onload,a.data)):a.progress?c.onprogress&&h(c.onprogress,a.data):a.timeout?c.ontimeout&&h(c.ontimeout,a.data):c.onerror&&h(c.onerror,a.data)}catch(b){console.log("env: Error: TM_download - ",b,c)}});return{abort:function(){d=!0}}},ea=function(a){var b=!1;a.url&&"/"===a.url[0]&&(a.url=window.location.origin+a.url);var d=
a.context;delete a.context;var c=function(){var a={};Object.getOwnPropertyNames(XMLHttpRequest.__proto__).forEach(function(b){a[b]=!0});var b=function(){};Object.getOwnPropertyNames(XMLHttpRequest).forEach(function(d){a[d]||(b[d]=XMLHttpRequest[d])});return b}(),g=function(a,d){d=d||{};a&&!b&&safeWindow.setTimeout(function(){d.__proto__=c;a.apply(d,[d])},1)};if("FormData"!==O(a.data)){var e=chromeEmu.extension.connect("xhr_"+TM_context_id),h=[];e.postMessage({method:"xhr",details:a,callbacks:{onloadstart:!!a.onloadstart,
onload:!!a.onload,onreadystatechange:!!a.onreadystatechange,onerror:!!a.onerror,ontimeout:!!a.ontimeout,onprogress:!!a.onprogress,onpartial:!0},id:TM_context_id});e.onMessage.addListener(function(b){try{if(b.data&&d&&(b.data.context=d),b.data&&b.onload){h.length&&(b.data.response_data=h.join(""),h=null);if(b.data.response_data){var c=b.data.response_data,e=b.data.response_types;["response_data","response_types"].forEach(function(a){delete b.data[a]});if(e){var l={response:function(b){var d=a.responseType?
a.responseType.toLowerCase():"",c=function(a){for(var d=new Uint8Array(a.length),c=0;c<a.length;c++)d[c]=b.charCodeAt(c);return d.buffer};return"arraybuffer"==d?c(b):"blob"==d?new Blob([c(b)]):"json"==d?JSON.parse(b):b},responseText:function(a){return a},responseXML:function(a){return(new DOMParser).parseFromString(a,"text/xml")}},q;for(q in l)if(l.hasOwnProperty(q))if(e[q])try{b.data[q]=l[q](c)}catch(u){console.warn("GM_xmlhttpRequest: ",u)}else b.data[q]=null}else console.warn("GM_xmlhttpRequest: got unusual response!"),
b.data.responseText=c}g(a.onreadystatechange,b.data);g(a.onload,b.data)}else b.onreadystatechange?4!=b.data.readyState&&g(a.onreadystatechange,b.data):b.onpartial?h.push(b.data.partial):(l=["onloadstart","onprogress","ontimeout"].filter(function(a){return!!b[a]})[0]||"onerror",g(a[l],b.data))}catch(u){console.log("env: Error: TM_xmlhttpRequest",u,a)}})}else{var l=new XMLHttpRequest;void 0===a.async&&(a.async=!0);l.open(a.method,a.url,a.async,a.user,a.password);if(a.headers)for(e in a.headers)l.setRequestHeader(e,
a.headers[e]);a.overrideMimeType&&l.overrideMimeType(a.overrideMimeType);a.responseType&&(l.responseType=a.responseType);"abort error load loadstart progress readystatechange timeout".split(" ").forEach(function(b){l["on"+b]=function(){var c="",e=a.url;if(2<l.readyState&&(c=l.getAllResponseHeaders(),4==l.readyState)){c&&(c=c.replace(/TM-finalURL[0-9a-zA-Z]*\: .*[\r\n]{1,2}/,""));var h=l.getResponseHeader("TM-finalURL"+Context.short_id);h&&(e=h)}c={readyState:l.readyState,status:"",statusText:"",responseHeaders:c,
finalUrl:e,context:d};4==l.readyState&&(l.responseType&&""!=l.responseType?c.response=l.response:(c.responseText=l.responseText,c.responseXML=l.responseXML),c.status=l.status,c.statusText=l.statusText);g(a["on"+b],c)}});l.send(a.data)}return{abort:function(){b=!0}}},fa=function(a,b){chromeEmu.extension.sendMessage({method:"installScript",url:a,id:TM_context_id},function(a){b&&b(a)})},ia=function(a){chromeEmu.extension.sendMessage({method:"closeTab",id:TM_context_id},function(b){b.error&&console.warn(b.error);
a&&a()})},oa=function(a,b){chromeEmu.extension.sendMessage({method:"getEngineStatus",async:b},function(b){a&&a(b)})},pa=function(a,b){chromeEmu.extension.sendMessage({method:"startJsPlayer",async:b},function(b){a&&a(b)})},qa=function(a,b){chromeEmu.extension.sendMessage({method:"getAvailablePlayers",params:a},function(a){b&&b(a)})},ra=function(a,b,d){chromeEmu.extension.sendMessage({method:"openInPlayer",params:a,playerId:b},function(a){d&&d(a)})},sa=function(a){chromeEmu.extension.sendMessage({method:"getDeviceId"},
function(b){a&&a(b)})},ta=function(a,b,d,c){chromeEmu.extension.sendMessage({method:"registerContextMenuHandler"},function(a){C.push(b)})},ua=function(a){chromeEmu.extension.sendMessage({method:"getLocale"},function(b){a&&a(b)})},va=function(a,b){chromeEmu.extension.sendMessage({method:"getConfig",name:a},function(a){b&&b(a)})},ja=function(a){chromeEmu.extension.sendMessage({method:"focusTab",id:TM_context_id},function(b){b.error&&console.warn(b.error);a&&a()})},wa=function(a,b){var d=[],c=a.storage,
g=a.script.uuid,e=a.script,h=null;(function(){h=chromeEmu.extension.connect("storageListener_"+TM_context_id);h.onMessage.addListener(function(a){if(a.storage)for(var d in a.storage.data)if(a.storage.data.hasOwnProperty(d)){var e=c.data[d];c.data[d]=a.storage.data[d];k(d,e,c.data[d],!0)}a.removed&&(c[a.removed]=b);a.error&&console.log("env: Error: storage listener... :(")});h.postMessage({method:"addStorageListener",uuid:g,id:TM_context_id})})();var l=function(a){h.postMessage({method:"saveStorageKey",
uuid:g,key:a,value:c.data[a],id:TM_context_id,ts:c.ts})},f=function(a,d,c){c===b&&(c=function(a){return a});var e=[],f=null;a&&a.length&&(f={GM_info:!0},a.forEach(function(a){f[a]=!0}));d.forEach(function(a){f&&!f[c(a.name)]||e.push(a)});return e},k=function(a,b,c,e){if(b!=c)for(var f in d)if(d.hasOwnProperty(f)){var h=d[f];if(h&&h.key==a&&h.cb)try{h.cb(a,z(b),z(c),e)}catch(g){D&&console.warn("env: value change listener of '"+a+"' failed with: "+g.message)}}},m=function(a,b){var c=0;d.forEach(function(a){a.id>
c&&(c=a.id)});c++;d.push({id:c,key:a,cb:b});return c},q=function(a){var c;d.every(function(b,d){return b.id==a?(c=d,!1):!0});if(c!==b)return d.splice(c,1),!0},x=function(a){var b=c.data[a];c.ts=(new Date).getTime();delete c.data[a];l(a);k(a,b,c.data[a],!1)},u=function(){var a=[],b;for(b in c.data)c.data.hasOwnProperty(b)&&a.push(b);return a},z=function(a,b){if("string"===typeof a){var c=a[0];a=a.substring(1);switch(c){case "b":return"true"===a;case "n":return Number(a);case "o":try{return JSON.parse(a)}catch(d){console.log("env: parseValueFromStorage: "+
d)}return b;default:return a}}else return b},n=function(a,b){return z(c.data[a],b)},t=function(a,b){var d=c.data[a],e=(typeof b)[0];switch(e){case "o":try{b=e+JSON.stringify(b)}catch(f){console.log(f);return}break;default:b=e+b}c.ts=(new Date).getTime();c.data[a]=b;l(a);k(a,d,c.data[a],!1)},p=function(a){for(var b in e.resources){var c=e.resources[b];if(c.name==a)return c.resText}return null},B=function(a){for(var b in e.resources){var c=e.resources[b];if(c.name==a)return c.resURL}return null},C=
function(a){console.log(a)},E=function(a){try{var b=safeDocument.createElement("style");b.textContent=a;(document.head||document.body||document.documentElement||document).appendChild(b);return b}catch(c){console.log("Error: env: adding style "+c)}},F=function(b,c,d,e,f){var h=null,g={method:"notification",id:TM_context_id},l=["timeout","text","image","title","highlight"],k=null;"object"===typeof b?k=b:"object"===typeof f&&(k=f);k?(l.forEach(function(a){g[a]=k[a]}),h=k.ondone,e=k.onclick,"function"===
typeof c&&(h=c)):("number"===typeof f&&(g.timeout=f),g.image=d,g.title=c,g.text=b);g.text&&(g.image=g.image||a.script.icon64||a.script.icon,g.title=g.title||a.script.name);g.text||g.highlight?chromeEmu.extension.sendMessage(g,function(a){e&&a.clicked&&e();h&&h(!0===a.clicked)}):console.warn("TM_notification: neither a message text nor the hightlight options was given!")},G=function(a,b,c){var d=typeof b,e="text",f="text/plain";"object"===d?(b.type&&(e=b.type),b.mimetype&&(f=b.mimetype)):"string"===
d&&(e=b);chromeEmu.extension.sendMessage({method:"copyToClipboard",data:{content:a,type:e,mimetype:f},id:TM_context_id},function(){c&&c()})},I=function(a){chromeEmu.extension.sendMessage({method:"getTab",id:TM_context_id,uid:e.uuid},function(b){a&&a(b.data)})},Q=function(a,b){chromeEmu.extension.sendMessage({method:"setTab",id:TM_context_id,tab:a,uid:e.uuid},function(){b&&b()})},J=function(a){chromeEmu.extension.sendMessage({method:"getTabs",id:TM_context_id,uid:e.uuid},function(b){a&&a(b.data)})},
r=function(a,b){var c=window,d="__u__"+Math.floor(19831206*Math.random()+1),e=d+"_";c[d]=a;c[e]=b;var f=Context.eval.call(window,'window["'+d+'"].apply(this, window["'+e+'"])');delete c[d];delete c[e];return f},v=[],H=null,y;for(y in e.grant)if(e.grant.hasOwnProperty(y)&&"none"===e.grant[y]){H=r;break}var K=e.namespace+"_"+!!H;Context.props[K]===b&&(Context.props[K]={sandboxes:{},elements:{}},w.push(function(){Context.props[K]=null}));if(!H){v.push({name:"window",value:"context",overwrite:!0});var T=
{window:window};for(y in T)T.hasOwnProperty(y)&&function(){var a=y.replace(/^(.)/g,function(a){return a.toUpperCase()});v.push({name:"unsafe"+a,value:T[y]})}()}v.push({name:"CDATA",value:function(a){this.src=a;this.toXMLString=this.toString=function(){return this.src}}});v.push({name:"uneval",value:function(a){try{return"\\$1 = "+JSON.stringify(a)+";"}catch(b){console.log(b)}}});Context.use_strong_mode||v.push({name:"undefined",value:b});v.push({name:"define",value:b});v.push({name:"module",value:b});
v.push({name:"console",value:console});H||(v.push({name:"cloneInto",value:function(a){return a}}),v.push({name:"exportFunction",value:function(a,c,d){d&&d.defineAs!==b&&(c[d.defineAs]=a);return a}}),v.push({name:"createObjectIn",value:function(a,c){var d={};c&&c.defineAs!==b&&(a[c.defineAs]=d);return d}}));r=[];r.push({name:"TM_addStyle",value:E});r.push({name:"TM_deleteValue",value:x});r.push({name:"TM_listValues",value:u});r.push({name:"TM_getValue",value:n});r.push({name:"TM_log",value:C});r.push({name:"TM_registerMenuCommand",
value:ba});r.push({name:"TM_unregisterMenuCommand",value:aa});r.push({name:"TM_openInTab",value:ca});r.push({name:"TM_setValue",value:t});r.push({name:"TM_addValueChangeListener",value:m});r.push({name:"TM_removeValueChangeListener",value:q});r.push({name:"TM_xmlhttpRequest",value:ea});r.push({name:"TM_download",value:da});r.push({name:"TM_setClipboard",value:G});r.push({name:"TM_getTab",value:I});r.push({name:"TM_setTab",value:Q});r.push({name:"TM_saveTab",value:Q});r.push({name:"TM_getTabs",value:J});
r.push({name:"TM_installScript",value:fa});r.push({name:"TM_notification",value:F});r.push({name:"TM_getResourceText",value:p,scriptid:e.uuid});r.push({name:"TM_getResourceURL",value:B,scriptid:e.uuid});r.push({name:"window.close",context_prop:!0});r.push({name:"window.focus",context_prop:!0});var N=[],L=new function(){this.GM_addStyle=function(a){return E(a)};this.GM_deleteValue=function(a){return x(a)};this.GM_listValues=function(){return u()};this.GM_getValue=function(a,b){return n(a,b)};this.GM_addValueChangeListener=
function(a,b){return m(a,b)};this.GM_removeValueChangeListener=function(a){return q(a)};this.GM_log=function(a){return C(a)};this.GM_registerMenuCommand=function(a,b,c){return ba(a,b,c)};this.GM_unregisterMenuCommand=function(a){return aa(a)};this.GM_openInTab=function(a,b){return ca(a,b)};this.GM_setValue=function(a,b){return t(a,b)};this.GM_xmlhttpRequest=function(a){return ea(a)};this.GM_download=function(){return da.apply(this,arguments)};this.GM_getResourceText=function(a){return p(a)};this.GM_getResourceURL=
function(a){return B(a)};this.GM_notification=function(a,b,c,d,e){return F(a,b,c,d,e)};this.GM_installScript=function(a,b){return fa(a,b)};this.GM_getTab=function(a){return I(a)};this.GM_setTab=function(a,b){return Q(a,b)};this.GM_saveTab=function(a){return Q(a)};this.GM_getTabs=function(a){return J(a)};this.GM_setClipboard=function(a,b,c){return G(a,b,c)};this.AWE_engineStatus=function(a,b){return oa(a,b)};this.AWE_startJsPlayer=function(a,b){return pa(a,b)};this.AWE_getAvailablePlayers=function(a,
b){return qa(a,b)};this.AWE_openInPlayer=function(a,b,c){return ra(a,b,c)};this.AWE_getDeviceId=function(a){return sa(a)};this.AWE_registerContextMenuCommand=function(a,b,c,d){return ta(a,b,c,d)};this.AWE_getLocale=function(a){return ua(a)};this.AWE_getConfig=function(a,b){return va(a,b)};Object.defineProperties(this,{GM_info:{get:function(){var b={observers:1,id:1,enabled:1,hash:1,fileURL:1},c={script:{}},d;for(d in e)e.hasOwnProperty(d)&&!b[d]&&(c.script[d]=e[d]);b=e.options.updateURL||e.options.fileURL;
c.script["run-at"]=e.options.override.run_at||e.options.run_at;c.script.excludes=e.options.override.orig_excludes;c.script.includes=e.options.override.orig_includes;c.script.matches=e.options.override.orig_matches;c.script.grant=e.grant;c.script.unwrap=!1;c.scriptMetaStr=a.header;c.scriptSource=a.code;c.scriptWillUpdate=!!b;c.scriptUpdateURL=b;c.version=Context.version;c.scriptHandler="Ace Script";c.isIncognito=Context.isIncognito;c.downloadMode=Context.downloadMode;return c},enumerable:!0,configurable:!0}})},
M=[];for(y in L)M.push({name:y,value:L[y]});N=N.concat(f(e.grant,r,function(a){return a.replace(/^TM_/,"GM_")}));N=N.concat(f(e.grant,M));v=v.concat(N);e.options.compat_prototypes&&(D&&console.log("env: option: add toSource"),Object.prototype.toSource||Object.defineProperties(Object.prototype,{toSource:{value:function(){var a=O(this);if("String"===a)return"(String('"+this.replace(/\'/g,"\\'")+"'))";if("Number"===a)return"(Number('"+Number(this)+"'))";if("Array"===a){for(var b="(new Array(",c=0;c<
this.length;c++)a=O(this[c]),b="Null"===a?b+"null":"Undefined"===a?b+"undefined":b+this[c].toSource(),c+1<this.length&&(b+=",");return b+"))"}return"JSON.parse(unescape('"+safeWindow.escape(JSON.stringify(this))+"'))"},enumerable:!1,writable:!0,configurable:!0}}),D&&console.log("env: option: add some array generics"),"indexOf lastIndexOf filter forEach every map some slice".split(" ").forEach(function(a){if("function"!==typeof Array[a]){var b={};b[a]={value:function(b){return Array.prototype[a].apply(b,
Array.prototype.slice.call(arguments,1))},enumerable:!1,writable:!0,configurable:!0};Object.defineProperties(Array,b)}}));f="";if(H)r=U();else{var R=ka(v,function(a){na(a);Y(a);Z(a,2,R.filterEvent)}),r={run_at:a.script.options.run_at,uuid:a.script.uuid},f="tms_"+a.script.uuid.replace(/-/g,"_");S[f]=r;Z(R.context,1,R.filterEvent,r);r=R.context}Context.props[K].sandboxes[a.script.uuid]=r;Context.props[K].elements[a.script.uuid]=v;D&&console.debug("env: execute script "+e.name+" @ the "+(H?"un":"")+
"safe context now!");la(e,a.code,a.requires,Context.props[K],H,f);w.push(function(){h.postMessage({method:"removeStorageListener",uuid:g,storage:c,id:TM_context_id});try{h.disconnect(),h=null}catch(b){}a=d=null})},ga=function(a){var b=function(){wa(a)};"document-start"==a.script.options.run_at?(D&&console.debug("env: run '"+a.script.name+"' ASAP -> document-start"),b()):"document-body"==a.script.options.run_at?(D&&console.debug("env: schedule '"+a.script.name+"' for document-body"),W(b)):"context-menu"==
a.script.options.run_at?(D&&console.debug("env: run '"+a.script.name+"' ASAP -> context-menu"),b()):"document-end"==a.script.options.run_at?(D&&console.debug("env: schedule '"+a.script.name+"' for document-end"),X(b)):(D&&console.debug("env: schedule '"+a.script.name+"' for document-idle"),ma(b))};chromeEmu.extension.onMessage.addListener(function(a,b,d){"awe-watch-online"===a.method&&a.url?ha(a.url):a.id&&a.id!=TM_context_id?console.warn("env: Not for me! "+TM_context_id+"!="+a.id):(b=window.self==
window.top,"executeScript"==a.method?a.url&&0!==safeWindow.location.href.search(a.url)?D&&console.log("exec: URL doesn't match",safeWindow.location,a):a.topframe&&!b?D&&console.log("exec: topframe doesn't match",window.self,a):ga(a):"onLoad"==a.method?(document.readyState&&"complete"!==document.readyState||(Context.domContentLoaded=!0,F()),d({})):b&&("loadUrl"==a.method?(window.location=a.url,d({})):"reload"==a.method?(window.location.reload(),d({})):"confirm"==a.method?safeWindow.setTimeout(function(){var b=
safeWindow.confirm(a.msg);d({confirm:b})},100):"showMsg"==a.method?safeWindow.setTimeout(function(){safeWindow.setTimeout(function(){safeWindow.alert(a.msg)},1);d({})},100):"setForeignAttr"==a.method?(window[a.attr]=a.value,d({})):console.log("env: unknown method "+a.method)))});Context.pageLoaded||(safeDocument.addEventListener("load",J,!1),safeDocument.addEventListener("DOMNodeInserted",M,!1),Context.domContentLoaded||safeDocument.addEventListener("DOMContentLoaded",G,!1));safeWindow.addEventListener("unload",
V,!1);D&&console.debug("env: initialized (content, id:"+TM_context_id+", "+window.location.origin+window.location.pathname+") ");Context.scripts.forEach(ga)});
