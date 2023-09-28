var NUT_ERD={
	window:["windowid","windowname","windowtype","applicationid","componentname","isopensearch"],
	tab:["tabid","parenttabid","tabname","tablevel","orderno","layoutcolumn","truonglienketcon","truonglienketcha","whereclause","orderbyclause","tableid","windowid","truongtrunggiancon","truongtrunggiancha","banglienket","bangtrunggian","tablename","columnkey","urledit","servicetype","columnparent","columnkeytrunggian","tabledohoaid","filterfield","filterwhere","onchange","isnotinsert","isnotupdate","isnotdelete","columncode","columndisplay","archive","beforechange","lock","isarchive","islock","istabtrunggian","isnotselect","isautosave","urlview","columnkvhc"],
	field:["fieldid","fieldname","alias","isdisplaygrid","isdisplay","issearch","displaylength","orderno","isreadonly","fieldlength","vformat","defaultvalue","isrequire","isfrozen","fieldgroup","tabid","columnid","fieldtype","foreigntable","columnkey","columndisplay","isfromdomain","domainid","issearchtonghop","foreigntableid","columncode","parentfieldid","wherefieldname","displaylogic","placeholder","calculation","columntype","colspan","rowspan","isprikey","columndohoa","foreignwindowid"],
	menuitem:["menuitemid","menuitemname","parentid","orderno","description","issummary","applicationid","windowid","clientid","tabid","menuitemtype","execname","icon","linkwindowid"]
};

w2utils.settings={
    locale: "en-US",
    dateFormat: "yyyy-mm-dd",
    timeFormat: "hh:mi:ss",
    datetimeFormat: "yyyy-mm-dd hh:mi:ss",
    currencyPrefix: "",
    currencySuffix: "₫",
    currencyPrecision: 0,
    groupSymbol: ",",
    decimalSymbol: ".",
    shortmonths: [ "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng10", "Tháng11", "Tháng12" ],
    fullmonths: [ "Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai" ],
    shortdays: [ "T2", "T3", "T4", "T5", "T6", "T7", "CN" ],
    fulldays: [ "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật" ],
    weekStarts: "M",
	dateStartYear:1960,
	dateEndYear:2040,
    phrases: {},
	macButtonOrder: false,
	dataType: "RESTFULL"
}

/*w2utils.settings.dataType="RESTFULL";
w2utils.settings.dateFormat="yyyy-mm-dd";
w2utils.settings.datetimeFormat="yyyy-mm-dd hh:mi:ss";
w2utils.settings.timeFormat="hh:mi:ss";
w2utils.settings.currencySuffix="₫";
w2utils.settings.currencyPrecision=0;*/

var LAYOUT_COLUMN=3;
var NUT_DS=PgREST;
var I_USER=btoa("I_USER");
var I_PASS=btoa("I_PASS");

var RPT_VAR_CLASS="nut-rpt-var";
var RPT_PARA_CLASS="nut-rpt-para";
var RPT_FUNC_CLASS="nut-rpt-func";
var RPT_SUM_CLASS="nut-rpt-sum";

var THU=["CN","Hai","Ba","Tư","Năm","Sáu","Bảy"];

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZmluIn0.iHSLV6x0jinPP1aSDHl5fMKHAgQLOq6EZ2ad-zekrdw

NUT_DS.onerror=function(err){
	//w2alert("<span style='color:red'>"+(typeof(err)=="string"?JSON.parse(err).message:"Network connection error!")+"</span>","⛔ Error");
};
var NUT_URL="http://oritholdings.hopto.org:3000/";
var NUT={
	now:function(){
		return (new Date()).toISOString().substr(0,10);
	},
	nowMonth:function(){
		return (new Date()).getMonth()+1;
	},
	nowYear:function(){
		return (new Date()).getFullYear();
	},
	nowDate:function(){
		return (new Date()).getDate();
	},
	loginUser:function(){
		return _context.user.username;
	},
	loginKvhc:function(){
		return _context.user.kvhcs;
	},
	loginSecret:function(){
		return _context.user.secret;
	},
	configDomain:function(caches){
		var domain={};
		for(var i=0;i<caches.length;i++){
			var cache=caches[i];
			var dm={items:[],lookup:{},lookdown:{}};
			var item=JSON.parse(cache.domain);
			dm.items.push({id:"",text:""});
			for(var j=0;j<item.length;j++){
				var itm=item[j];
				dm.items.push({id:itm[0],text:itm[1],code:itm[2]});
				dm.lookup[itm[0]]=itm[1];
				dm.lookdown[itm[1]]=itm[0];
			}
			domain[cache.domainid]=dm;
		}
		return domain;
	},
	configWindow:function(conf,layout){
		var lookupTab={},lookupField={},lookupFieldName={},layoutFields={};
		var winconf={tabs:[],needCache:{}};
		for(var i=0;i<NUT_ERD.window.length;i++)
			winconf[NUT_ERD.window[i]]=conf.window[i];
		if(conf.tabs){
			for(var i=0;i<conf.tabs.length;i++){
				var tab={fields:[],tabs:[],menuitems:[],children:[],maxLevel:0};
				for(var j=0;j<NUT_ERD.tab.length;j++)
					tab[NUT_ERD.tab[j]]=conf.tabs[i][j];
				var func=_context.user.functions[tab.tableid];
				if(func){
					tab.isnotinsert||=func.isnotinsert;
					tab.isnotupdate||=func.isnotupdate;
					tab.isnotdelete||=func.isnotdelete;
					tab.isnotselect||=func.isnotselect;
					tab.isnotexport||=func.isnotexport;
				}
				if(layout){
					tab.layout=document.createElement("div");
					tab.layout.innerHTML=layout[tab.tabid];
					var tables=tab.layout.querySelectorAll("table");
					for(var t=0;t<tables.length;t++){
						var table=tables[t];
						for(var r=0;r<table.rows.length;r++)for(var c=0;c<table.rows[r].cells.length;c++){
							var cell=table.rows[r].cells[c];
							if(cell.firstChild){
								layoutFields[cell.firstChild.id]=cell.firstChild;
								cell.firstChild.draggable=false;
								cell.firstChild.firstChild.contentEditable=false;
								cell.firstChild.lastChild.className="";
								cell.firstChild.lastChild.firstChild.style.width=cell.firstChild.lastChild.style.width?cell.firstChild.lastChild.style.width:"";
							}
						}
					}
				}
				if(tab.tablevel==0)winconf.tabs.push(tab);
				lookupTab[tab.tabid]=tab;
				if(tab.parenttabid){
					var parentTab=lookupTab[tab.parenttabid];
					parentTab.children.push(tab);
					//tab.parentTab=parentTab;
					if(tab.tablevel>0){
						if(tab.tablevel>parentTab.tablevel){
							parentTab.tabs.push(tab);
							if(tab.tablevel>parentTab.maxLevel)parentTab.maxLevel=tab.tablevel;
						}else{
							lookupTab[parentTab.parenttabid].tabs.push(tab);
						}
					}
				}
			}
			for(var i=0;i<conf.fields.length;i++){
				if(!layout||layoutFields[conf.fields[i][0]]){
					var field={windowid:winconf.windowid,children:[]};
					for(var j=0;j<NUT_ERD.field.length;j++)
						field[NUT_ERD.field[j]]=conf.fields[i][j];
					var tab=lookupTab[field.tabid];
					tab.fields.push(field);
					lookupField[field.fieldid]=field;
					lookupFieldName[tab.tabname+"."+field.fieldname]=field;
					if(field.fieldtype=="select"&&!(field.isfromdomain||field.parentfieldid||winconf.needCache[field.foreigntable]))
						winconf.needCache[field.foreigntable]=field;
				}
			}
			
			for(var key in lookupField)if(lookupField.hasOwnProperty(key)){
				var field=lookupField[key];
				if(field.calculation){
					field.calculationInfos=[];
					var tab=lookupTab[field.tabid];
					var names=field.calculation.match(/\[([^\][]*)]/g);//(/(?<=\[).*?(?=\])/g); //get string between [ & ]
					var funcs=field.calculation.match(/sum|count|avg|min|max/g);
					var f=0;
					for(var i=0;i<names.length;i++){
						var info=null;
						var name=names[i].substring(1,names[i].length-1);
						var isFullName=name.includes(".");
						lookupFieldName[isFullName?name:tab.tabname+"."+name].children.push(field);
						if(isFullName){
							var tokens=name.split(".");
							var tabName=tokens[0];
							for(var j=0;j<tab.children.length;j++)if(tabName==tab.children[j].tabname){
								info={
									func:funcs[f++],
									tab:tab.children[j].tabid,
									field:tokens[1]
								};break;
							}
							if(tab.parenttabid&&tabName==lookupTab[tab.parenttabid].tabname)
								info={
									tab:tab.parenttabid,
									field:tokens[1]
								};
						}else info={field:name};

						field.calculation=field.calculation.replace(info.func?info.func+"["+name+"]":"["+name+"]","_v["+i+"]");
						field.calculationInfos.push(info);
					}
				}
				if(field.displaylogic){
					var fldnames=field.displaylogic.match(/\[([^\][]*)]/g);//(/(?<=\[).*?(?=\])/g);
					for(var i=0;i<fldnames.length;i++)
						lookupFieldName[tab.tabname+"."+fldnames[i]].children.push(field);
					field.displaylogic=field.displaylogic.replaceAll('[','form.record["');
					field.displaylogic=field.displaylogic.replaceAll(']','"]');
				}
				if(field.parentfieldid){
					var parentField=lookupField[field.parentfieldid];
					parentField.children.push(field);
					if(parentField.fieldtype=="search"){
						field.calculation="record."+field.wherefieldname;
						field.calculationInfos=[];
					}
				}
			}
			
			if(conf.menuitems){
				for(var i=0;i<conf.menuitems.length;i++){
					var menuitem={};
					for(var j=0;j<NUT_ERD.menuitem.length;j++)
						menuitem[NUT_ERD.menuitem[j]]=conf.menuitems[i][j];
					lookupTab[menuitem.tabid].menuitems.push(menuitem);
				}
			}
			winconf.lookupFieldName=lookupFieldName;
		}
		return winconf;
	},
	calcWhere:function(rec){
		var where="";
		for(var key in rec)if(rec.hasOwnProperty(key)){
			where=where?where+"&"+key+"=like."+rec[key]:key+"=like."+rec[key];
		}
		return where;
	},
	tagMsg:function(msg,color,node){
		$(node||imgClientLogo).w2tag("<span style='color:"+color+"'>"+msg+"</span>",{position:node?"top":"bottom"});
	},
	isObjectEmpty:function(obj){
		for(var key in obj)if(obj.hasOwnProperty(key))return false;
		return true;
	},
	openDialog:function(title){
		divDlgTitle.innerHTML=title;
		divDlgContent.innerHTML="";
		divDlg.style.display="";
		var div=document.createElement("div");
		div.className="nut-full";
		divDlgContent.appendChild(div);
		return div;
	},
	closeDialog:function(){
		divDlg.style.display="none";
	},
	clone:function(obj){
		var objC={};
		for(var key in obj)if(obj.hasOwnProperty(key)){
			objC[key]=obj[key];
		}
		return objC;
	},
	loaiBoDau:function(str) {
		return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
	},
	errorMsg:function(err){
		if(err.message=="JWT expired")
			w2alert("<span style='color:red'>Your session has expired! RELOGIN to continue.</span>","Session expired",function(){location.reload()});
		else
			w2alert("<table><tr><td align='right'><i>Message: </i></td><td align='left' color='red'>"+err.message+"</td></tr><tr><td align='right'><i>Details: </i></td><td align='left'>"+err.details+"</td></tr><tr><td align='right'><i>Hint: </i></td><td align='left'>"+err.hint+"</td></tr></table>","Error "+err.code)
	},
	dmy:function(ymd){
		var tokens=null;
		if(ymd)tokens=ymd.split("-");
		return ymd?tokens[2]+"/"+tokens[1]+"/"+tokens[0]:"";
	},
	num2text:function(num){
		var str=num2vnword.convert(Math.floor(num));
        return str[0].toUpperCase() + str.slice(1);
	},
	runReport:function(conf,sel){
		var paras=conf.parameter.Parameter._order;
		if(paras.length){
			var fields=[];
			var defaultValue={};
			for(var i=0;i<paras.length;i++){
				var para=paras[i];
				fields.push({field:para,type:"text"});
				defaultValue[para]=conf.parameter.Parameter[para];
			}
			var id="divRpt_InputPara";
			w2popup.open({
				title:"🎛️ Report parameter",
				modal:true,
				width: 400,
				body: '<div id="'+id+'" class="nut-full"></div>',
				onOpen:function(evt){
					evt.onComplete=function(){
						var div=document.getElementById(id);
						w2ui[id]?w2ui[id].render(div):
						$(div).w2form({ 
							name: id,
							fields: fields,
							record:defaultValue,
							actions: {
								"⛌ Close": function () {
									w2popup.close();
								},
								"✔️ Ok": function (evt) {
									NUT.showReport(conf,sel,this.record);
									w2popup.close();
								}
							}
						})
					}
				}
			});
		}else{
			NUT.showReport(conf,sel);
		}
	},
	showReport:function(conf,s,p){
		NUT.para=p;
		NUT.sel=s;
		var win=window.open();
		win.document.title=conf.name;
		win.document.body.innerHTML='<a style="float:right;border:1px solid;padding:6px 10px 6px 10px" download="'+name+'.xls" onclick="if(!this.href)this.href=\'data:application/vnd.ms-excel,\'+body.innerHTML.replace(/ /g, \'%20\')">Kết xuất Excel</a>'+conf.html;
		var spans=win.document.getElementsByClassName(RPT_SUM_CLASS);
		var runSpans=[],sumSpans=[], sum=[], stt=null;
		for(var j=0;j<spans.length;j++){
			var span=spans[j];
			if(span.innerHTML=="@stt"){
				stt=span;
			}else if(span.innerHTML.startsWith("sum(")){
				sum.push(0);
				sumSpans.push(span);
			} else {
				runSpans.push(span);
			}
		}
		if(p){
			spans=win.document.getElementsByClassName(RPT_PARA_CLASS);
			for(var j=spans.length-1;j>=0;j--){
				var span=spans[j];
				span.outerHTML=eval(span.innerHTML);
			}
		}
		
		spans=win.document.getElementsByClassName(RPT_FUNC_CLASS);
		for(var j=spans.length-1;j>=0;j--){
			var span=spans[j];
			if(span.innerHTML!="@stt")span.outerHTML=eval(span.innerHTML);
		}
		if(win.rowDetail){
			var p={url:conf.tableurl};
			if(conf.filter)p.where=JSON.parse(conf.filter.replaceAll("p[","NUT.para[").replaceAll("s.","NUT.sel."));
			NUT_DS.select(p,function(res){
				var val={};
				var tbl=win.rowDetail.parentNode;
				for(var i=0;i<res.length;i++){
					var r=res[i];
					//var row=tbl.insertRow(win.rowDetail.sectionRowIndex+i);
					var row=tbl.insertRow(win.rowDetail.rowIndex+i);
					row.innerHTML=win.rowDetail.innerHTML;
					spans=row.getElementsByClassName(RPT_VAR_CLASS);
					
					for(var j=spans.length-1;j>=0;j--){
						var span=spans[j];
						var value=(span.innerHTML=="@stt"?i+1:eval(span.innerHTML));
						span.outerHTML=value;
						if(span.id)val[span.id]=value;
					}
					for(var j=sumSpans.length-1;j>=0;j--){
						var span=sumSpans[j];
						sum[j]+=eval(sumSpans[j].innerHTML.substring(3));
					}
				}
				win.rowDetail.style.display="none";
				
				var val={};
				for(var i=sumSpans.length-1;i>=0;i--){
					var span=sumSpans[i];
					var value=sum[i];
					if(span.id)val[span.id]=value;
					span.outerHTML=w2utils.formatNumber(value);
				}

				
				for(var i=0;i<runSpans.length;i++){
					var span=runSpans[i];
					var value=eval(span.innerHTML);
					if(span.id)val[span.id]=value;
					span.outerHTML=eval(span.innerHTML);
				}
			})
		}else{
			for(var i=0;i<runSpans.length;i++){
				var span=runSpans[i];
				var value=eval(span.innerHTML);
				if(span.id)val[span.id]=value;
				span.outerHTML=eval(span.innerHTML);
			}
		}
	},
	fNum:function(num){
		return w2utils.formatNumber(num);
	},
	fDate:function(val){
		var tokens=val.split("-");
		return tokens[2]+"/"+tokens[1]+"/"+tokens[0];
	}
}
