var _context={
	user:{},
	apps:{},
	domain:{},
	winconfig:{},
	extent:{},
	layer:{
		byName:{}
	},
	curApp:null,
	curWinid:null,
	idFormPopup:null,
	workflow:{}
};
var _isMobile=(window.orientation!==undefined);
function body_onLoad(){
	var panels=[{ type: 'top', size: '28px', content: '<i><b id="labCurrentApp"></b></i><span style="float:right"><img id="imgClientLogo" width="20" height="20" src="img/nut.ico"/><a id="labLoginClient" class="nut-link" onclick="openMain();if(w2ui.w2menu.flat)w2ui.w2menu.goFlat()"></a>><i class="nut-link" id="labLoginUser" onclick="labLoginUser_onClick()"></i></span><div id="divTop"></div>' },
			{ type: 'left', size: (_isMobile?"100%":"360px"), resizable: true, content: '<div id="divLeft" class="nut-full"><div><img width="120" src="img/adv/top-banner.png" style="display:block;margin:auto"/></div><div id="divLogin" style="width:350px;height:200px;margin:auto"></div><div style="width:360px;margin:auto"><img width="170" src="img/adv/qc.jpg" style="margin:5px" onclick="window.open(this.src)"/><img width="170" src="img/adv/qc3.png" style="margin:5px" onclick="window.open(this.src)"/></div><div><img width="120" src="img/adv/bottom-banner.png" style="display:block;margin:auto"/></div></div>' },
			{ type: 'main', content: '<div id="divMain" class="nut-full" style="background:url(\'img/nutboat.jpg\') no-repeat;background-size:cover"><div id="divTitle" style="padding:20px"><img width="64" height="64" src="img/nut.ico"/><h2 style="color:brown">NUT version 1.0<h2/><hr/><h3><i>No-code Universal application Tools</i><h3/></div></div>' }];
	var id="divApp";
	var div=document.getElementById(id);
	if(w2ui[id]){
		w2ui[id].panels;
		w2ui[id].render(div);
	}else $(div).w2layout({
		name: id,
		panels: panels,
		onResize:function(evt){
			evt.onComplete=function(){
				if(GSMap)GSMap.resize();
			}
		}
	});
	var pass=localStorage.getItem(I_PASS);
	var record={
		username:atob(localStorage.getItem(I_USER)),
		password:pass?atob(localStorage.getItem(I_PASS)):"",
		savepass:pass
	}
	var id="divLogin";
	var div=document.getElementById(id);
	if(w2ui[id]){
		w2ui[id].record=record;
		w2ui[id].render(div);
	}else $(div).w2form({
		name: id,
		header: '🔑 <i>Login</i>',
		fields:[{field:'username',type:'text',required:true,html:{label:'User name'}},
			{field:'password',type:'password',required:true,html:{label:'Password'}},
			{field:'savepass',type:'checkbox',html:{label:'Save password'}}],
		record: record,
		actions: {
			"❔ Help": function(){},
			"✔️ Login": function(){
				if(this.validate(true).length)return;
				labCurrentApp.innerHTML="<img src='img/wait.gif'/>";
				var record=this.record;
				NUT_DS.login({usr:record.username,pass:record.password},function(res){
					if(res.length==1){
						_context.user=res[0];
						localStorage.setItem(I_USER,btoa(record.username));
						localStorage.setItem(I_PASS,record.savepass?btoa(record.password):"");
						NUT_DS.select({srl:"sysclient",where:["clientid","=",_context.user.clientid]},function(clients){
							if(clients.length){
								var client=clients[0];
								_context.client={clientid:client.clientid,name:client.clientname,desc:client.description,icon:client.iconclient,code:client.clientcode,backimg:client.imagebackground};
								labLoginClient.innerHTML=_context.client.name;
								labLoginClient.title=_context.client.desc;
								labLoginUser.innerHTML=_context.user.username;
								imgClientLogo.src="client/"+_context.client.clientid+"/"+ _context.client.icon;
								openMain();
								renderMain(_context.client);
							}
						});
					}else{
						w2alert("<span style='color:red'>Username/Password NOT CORRECT!</span>");
					}
					labCurrentApp.innerHTML="";
				},true);
			}
		}
	});
}
function renderMain(info){
	if(!info)info=_context.client;
	var url=(info.applicationid===undefined?"client/"+info.clientid+"/":"client/"+info.clientid+"/"+info.applicationid+"/");
	divMain.innerHTML="<div id='divTitle' style='padding:5px'><img width='64' height='64' src='"+url+info.icon+"'><br/><h2 style='color:brown'>"+info.name+"</h2><hr/><h3><i>"+info.desc+"</i><h3/></div>";
	if(info.backimg)divMain.style.backgroundImage="url('"+url+info.backimg+"')";
}
function labLoginUser_onClick(){
	$(labLoginUser).w2menu({
		items:[{id:"ACC",text:"My account"},{id:"PASS",text:"Change password"},{text:'--'},{id:"OUT",text:"Logout"}],
		onSelect:function(evt){
			switch(evt.item.id){
				case "ACC":
					var user=_context.user;
					w2alert("<table><tr><td><b><i>Tài khoản:</i></b></td><td colspan='3'>"+user.username+"</td></tr><tr><td><b><i>Họ tên:</i></b></td><td colspan='3'>"+user.fullname+"</td></tr><tr><td><b><i>Điện thoại:</i></b></td><td>"+user.phone+"</td><td><b><i>Nhóm:</i></b></td><td>"+user.groupid+"</td></tr><tr><td><b><i>Trạng thái:</i></b></td><td>"+user.status+"</td><td><b><i>Ghi chú:</i></b></td><td>"+user.description+"</td></tr></table>","<b>ℹ️ Information #<i>"+user.userid+"</i></b>");break;
				case "PASS":
					w2popup.open({
						title:"🔑 <i>Change password</i>",
						speed:0,
						width:400,
						height:210,
						body:"<table style='margin:auto'><tr><td>*Old password:</b></td><td><input id='txtUser_PasswordOld' type='password'/></td></tr><tr><td>*New password:</b></td><td><input id='txtUser_PasswordNew' type='password'/></td></tr><tr><td>*Re-type password:</b></td><td><input id='txtUser_PasswordNew2' type='password'/></td></tr></table>",
						buttons: '<button class="w2ui-btn" onclick="w2popup.close()">⛌ Close</button><button class="w2ui-btn" onclick="userChangePassword()">✔️ Ok</button>'
					});
					break;
				case "OUT":
					location.reload();
					break;
			}
		}
	});
}
function userChangePassword(){
	var user=_context.user;
	if(txtUser_PasswordOld.value&&txtUser_PasswordNew.value&&txtUser_PasswordNew2.value){
		if(txtUser_PasswordOld.value==user.password&&txtUser_PasswordNew.value==txtUser_PasswordNew2.value)
			NUT_DS.update({srl:"sysuser",data:{password:txtUser_PasswordNew.value},where:[["userid","=",user.userid],["password","=",txtUser_PasswordOld.value]]},function(res){
				w2alert("<span style='color:green'>Password change!</span>");
			})
		else w2alert("<span style='color:orange'>Passwords not match!</span>");
	}else w2alert("<span style='color:orange'>Old password, new password and retype password are all required!</span>");
}
function openMain() {
	if(_context.client)renderMain();
	NUT_DS.select({srl:"sv_access_application",order:"orderno",where:["userid","=",_context.user.userid]},function(res){
		if(res.length){
			var html="<div id='divTitle'>&nbsp;📦&nbsp;<i id='labApp' style='color:brown'>Applications</i><br/><center>";
			var count=0,lookupRole={};
			_context.user.roles=[];
			for(var i=0;i<res.length;i++){
				var data=res[i];
				if(data.applicationid!=null){
					var id=data.applicationid;
					_context.apps[id]={clientid:data.appclientid,applicationid:id,name:data.applicationname,link:data.linkurl,type:data.applicationtype,icon:data.icon,code:data.colorcode,onopen:data.onopen,desc:data.description};
					html+="<div class='nut-tile' style='background:"+data.colorcode+"' onclick='openApplication("+id+")' onmouseover='labApp.innerHTML=\""+data.description+"\"'><img src='client/"+data.appclientid+"/"+id+"/"+data.icon+"'><br/>"+data.applicationname+"</div>";
					count++;
				}
				if(data.roleid!=null&&!lookupRole[data.roleid]){
					lookupRole[data.roleid]=true;
					_context.user.roles.push(data.roleid);
				}
			};
			html+="</center></div>";
			divLeft.innerHTML=html;
			
			NUT_DS.select({srl:"sysrolefunction",where:["roleid","in",_context.user.roles]},function(funcs){
				_context.user.functions={};
				for(var i=0;i<funcs.length;i++){
					var f=funcs[i];
					var func=_context.user.functions[f.tableid];
					if(func){
						func.isnotinsert&&=f.isnotinsert;
						func.isnotupdate&&=f.isnotupdate;
						func.isnotdelete&&=f.isnotdelete;
						func.isnotselect&&=f.isnotselect;
						func.isnotexport&&=f.isnotexport;
					}else _context.user.functions[f.tableid]=f;
				}
			});
			
			NUT_DS.select({srl:"sv_userkvhc_kvhc",where:["userid","=",_context.user.userid]},function(kvhcs){
				_context.user.kvhcs=[];
				_context.user.kvhcnames=[];
				for(var i=0;i<kvhcs.length;i++){
					_context.user.kvhcs.push(kvhcs[i].kvhccode);
					_context.user.kvhcnames.push(" "+kvhcs[i].kvhcname);
				}
			});
			if(count==1)openApplication(id);
		}
	});
	GSMap.loadLibrary();
}
function openApplication(idApp){
	//load menu
	labCurrentApp.innerHTML="<img src='img/wait.gif'/>";
	_context.curWinid=null;
	_context.curApp=_context.apps[idApp];
	if(_context.curApp.onopen){
		runComponent(_context.curApp.onopen);
	}
	
	if(_context.curApp.type=="engine"){
		var win=window.open(_context.curApp.link);
		win.onload=function(){
			this._context=_context;
			this.body_onLoad();
			labCurrentApp.innerHTML="";
		}
	}else {
		var isGis=(_context.curApp.type=="gis");
		divMain.innerHTML="";
		divMain.style.backgroundImage="";
		
		if(isGis){
			NUT_DS.select({srl:"sv_map_service",order:"orderno",where:["applicationid","=",idApp]},function(maps){
				if(maps.length){
					var lookup={};
					for(var i=0;i<maps.length;i++){
						var map=maps[i];
						map.subLayers=[];
						lookup[map.mapid]=map;
					}
					NUT_DS.select({srl:"syslayer",order:"orderno",where:["applicationid","=",idApp]},function(res){
						for(var i=0;i<res.length;i++){
							var lyr=res[i];
							lyr.maporder=lookup[lyr.mapid].orderno;
							lookup[lyr.mapid].subLayers.push(lyr);
						}
						var layers=[];
						for(var i=0;i<maps.length;i++)if(maps[i].subLayers.length)layers.push(maps[i]);
						divMain.innerHTML="<div id='divMapTool'></div>";
						w2ui.divApp.sizeTo("left","50%",true);
						GSMap.createMap({
							layers:layers,
							divMap:divMain,
							divTool:divMapTool,
							view:{
								center: [108, 16],
								zoom: 11
							}
						});
						GSMap.awBasic.onFeatureSelect=map_onSelect;
					})
				}
			});
		} else {
			w2ui.divApp.sizeTo("left",_isMobile?"100%":"300px",true);
			renderMain(_context.curApp);
		}
		//load domain
		NUT_DS.select({srl:"sysdomain",clientid:_context.curApp.clientid,where:["applicationid","=",idApp]},function(res){
			_context.domain=NUT.configDomain(res);
		});
		//load service
		NUT_DS.select({srl:"sv_appservice_service",clientid:_context.curApp.clientid,where:["applicationid","=",idApp]},function(res){
			_context.service={};
			for(var i=0;i<res.length;i++)_context.service[res[i].servicename]=res[i];
		});
		NUT_DS.select({srl:"sv_rolemenu_menuitem",clientid:_context.curApp.clientid,where:[["menuitemtype","=","menu"],["applicationid","=",idApp],["roleid","in",_context.user.roles]]},function(res){
			var ids={},pids={},lookupWhere={};
			for(var i=0;i<res.length;i++){
				var rec=res[i];
				if(rec.menuitemid)ids[rec.menuitemid]=true;
				if(rec.parentid)pids[rec.parentid]=true;
				if(rec.whereclause)lookupWhere[rec.menuitemid]=rec.whereclause;
			}
			NUT_DS.select({srl:"sysmenuitem",clientid:_context.curApp.clientid,order:"orderno",where:["or",["menuitemid","in",Object.keys(ids)],["menuitemid","in",Object.keys(pids)]]},function(menuitems){
				var nodes=[], lookup={}, openTag=null;
				for(var i=0;i<menuitems.length;i++){
					var menuitem=menuitems[i];
					var isSummary=menuitem.issummary;
					var tag={id:menuitem.linkwindowid,exec:menuitem.execname,where:lookupWhere[menuitem.menuitemid]};
					if(!isSummary&&menuitem.isopen)openTag=tag;
					var node={type:(isSummary?'menu':'button'), id:menuitem.menuitemid, text: menuitem.menuitemname, group:isSummary, expanded:menuitem.isopen, tag:tag};
					if(menuitem.parentid){
						var parent=lookup[menuitem.parentid];
						if(parent)
							isGis?parent.items.push(node):parent.nodes.push(node);
						else w2alert("No parent for menu "+menuitem.menuitemname);
					}
					else nodes.push(node);
					if(isSummary)isGis?node.items=[]:node.nodes=[];
					lookup[node.id]=node;
				};
				var id='w2menu';
				if(w2ui[id]){
					isGis?w2ui[id].items=nodes:w2ui[id].nodes=nodes;
					w2ui[id].render(isGis?divTop:divLeft);
				}else
					isGis?$(divTop).w2toolbar({name:id,items: nodes,onClick:menu_onClick}):$(divLeft).w2sidebar({name:id,flatButton:true,nodes: nodes,topHTML:"<i class='nut-link'>MENU</i>",onClick:menu_onClick,onFlat:menu_onFlat});
				
				if(openTag)menu_onClick({item:{tag:openTag}});
				labCurrentApp.innerHTML="<img src='client/"+_context.curApp.clientid+"/"+_context.curApp.applicationid+"/"+_context.curApp.icon+"' width='20' height='20'/> "+_context.curApp.name;
				labCurrentApp.title=_context.curApp.desc;
			});
		});
	}
}
function menu_onFlat(evt){
	var width=_isMobile?"100%":"300px";
	w2ui.divApp.sizeTo("left",evt.goFlat?'60px':width,true);
	$('w2menu').css('width', (evt.goFlat?'60px':width));
}
function map_onSelect(evt){
	if(evt.tool=="toolSelect"){
		var tabconf=_context.winconfig[_context.curWinid].tabs[0];
		var grid=w2ui["divgrid_"+tabconf.tabid];
		var where=["or"];
		for(var i=0;i<evt.features.length;i++){
			var feat=evt.features[i];
			var lyrconf=GSMap.getLayerConfig(feat.getId().split(".")[0]);
			if(lyrconf.windowid==_context.curWinid){
				var attr=feat.getProperties();
				var clause=[];
				for(var j=0;j<tabconf.fields.length;j++){
					var field=tabconf.fields[j];
					if(field.columndohoa&&attr[field.columndohoa]){
						if(attr[field.columndohoa])clause.push([field.columndohoa,"=",attr[field.columndohoa]]);
						else {clause=[];break}
					}
				}
				if (clause.length)where.push(clause);
			}
		}
		if(where.length>1){
			grid.postData.select=where;
			grid.reload();
		}
	}
}
function cacheDomainAndOpenWindow(div,conf,needCaches,index){
	var fldconf=needCaches[index];
	if(fldconf){
		if(fldconf.foreigntable)
			NUT_DS.select({url:fldconf.foreigntable,select:[fldconf.columnkey,fldconf.columndisplay],where:(fldconf.wherefieldname?JSON.parse(fldconf.wherefieldname):null)},function(res){
				var domain={items:[{id:"",text:""}],lookup:{}};
				for(var i=0;i<res.length;i++){
					var item={id:res[i][fldconf.columnkey],text:res[i][fldconf.columndisplay]};
					domain.items.push(item);
					domain.lookup[item.id]=item.text;
				}
				_context.domain[fldconf.foreigntable]=domain;
				if(++index<needCaches.length)cacheDomainAndOpenWindow(div,conf,needCaches,index);
				else buildWindow(div,conf,0);
			});
		else w2alert("Foreigntable for field [" + fldconf.fieldname+"] is not yet config!");
	}else buildWindow(div,conf,0); 
}

function createWindowTitle(id,divTitle,noClose){
	if(!_context.curWinid)divTitle.innerHTML="";
	else for(var i=0;i<divTitle.childNodes.length;i++){
		var node=divTitle.childNodes[i].firstChild;
		node.style.color="gray";
		if(id==node.tag){
			node.onclick();
			return;
		}
	}

	var divWindow=divTitle.parentNode;
	for(var i=1;i<divWindow.childNodes.length;i++)
		divWindow.childNodes[i].style.display="none";
		
	var div=document.createElement("div");
	div.className="nut-full";
	divWindow.appendChild(div);
	
	var span=document.createElement("span");
	var a=document.createElement("i");
	a.innerHTML=" ... ";
	a.className="nut-link";
	a.div=div;
	a.tag=id;
	a.onclick=function(){
		var children=this.div.parentNode.childNodes;
		for(var i=1;i<children.length;i++)
			children[i].style.display="none";
		this.div.style.display="";
		
		children=this.parentNode.parentNode.childNodes;
		for(var i=0;i<children.length;i++)
			children[i].firstChild.style.color="gray";
		this.style.color="";
		
		_context.curWinid=this.tag;
	};
	span.appendChild(a);
	
	var close=document.createElement("span");
	close.className="nut-close";
	close.innerHTML=noClose?"    ":" ⛌   ";
	close.tag=id;
	if(!noClose)close.onclick=function(){
		var title=this.parentNode.parentNode;
		this.previousElementSibling.div.remove();
		this.parentNode.remove();
		if(this.tag==_context.curWinid){
			if(title.childNodes.length)title.childNodes[0].firstChild.onclick();
			else _context.curWinid=null;
		}
	}
	span.appendChild(close);
	
	divTitle.appendChild(span);
	return a;
}

function menu_onClick(evt){
	var tag=evt.item?((evt.item.group)?(evt.subItem&&!evt.subItem.group?evt.subItem.tag:null):evt.item.tag):evt.node.tag;
	if(tag.id){
		//var a=createWindowTitle(tag.id,divTitle);
		var conf=_context.winconfig[tag.id];
		if(conf){
			if(tag.where)conf.tabs[0].whereclause=(conf.tabs[0].whereclause?"["+conf.tabs[0].whereclause+","+tag.where+"]":tag.where);
			if(conf.componentname)runComponent(conf.componentname,a.div,evt.target);
			else{
				var a=createWindowTitle(tag.id,divTitle);
				buildWindow(a.div,conf,0);
				a.innerHTML=conf.windowname;
				_context.curWinid=tag;
			}
		}else{
			//a.div.innerHTML="<img src='img/wait.gif'/>";
			NUT_DS.select({srl:"syscache",clientid:_context.curApp.clientid,where:["windowid","=",tag.id]},function(res){
				if(res.length){
					conf=zipson.parse(res[0].config);
					if(conf.parameter){//report
						NUT.runReport(conf,evt.sel);
					}else{//window
						conf=NUT.configWindow(conf,JSON.parse(res[0].layout));
						if(tag.where)conf.tabs[0].whereclause=(conf.tabs[0].whereclause?"["+conf.tabs[0].whereclause+","+tag.where+"]":tag.where);
						if(conf.componentname)runComponent(conf.componentname,a.div,evt.target);
						else{
							conf.tabid=conf.windowid;
							_context.winconfig[tag.id]=conf;
							var needCaches=[];
							for(key in conf.needCache)if(conf.needCache.hasOwnProperty(key)&&!_context.domain[key])
								needCaches.push(conf.needCache[key]);							
							var a=createWindowTitle(tag.id,divTitle);
							cacheDomainAndOpenWindow(a.div,conf,needCaches,0);
							a.innerHTML=conf.windowname;
							_context.curWinid=tag;
						}
					}
				} else w2alert("No cache for window " + tag.id);
			});
		}
		if(_isMobile&&!w2ui.w2menu.flat)w2ui.w2menu.goFlat();
	}else if(tag.exec){
		if(tag.exec.startsWith("Com_"))
			runComponent(tag.exec,tag.where,evt.target);
		else if(tag.exec.includes("."))
			window.open("client/"+_context.user.clientid+"/"+_context.curApp.applicationid+"/"+tag.exec);
		else if(tag.exec.startsWith("http"))
			window.open(tag.exec);
	}
}
function loadChildSelect(fldconf,value){
	var form=w2ui[_context.idFormPopup||"divform_"+fldconf.tabid];
	var field=form.get(fldconf.fieldname);
	var grid=w2ui["divgrid_"+fldconf.tabid];
	var column=grid.getColumn(fldconf.fieldname);
	var key=fldconf.foreigntableid+"-"+value;
	var domain=_context.domain[key];
	if(domain){
		field.options.items=domain.options;
		form.refresh();
		if(column.editable){
			column.editable.items=domain.options;
			column.editable.lookup=domain.lookup;
			grid.refresh();
		}
	}else NUT_DS.select({url:fldconf.foreigntable,select:[fldconf.columnkey,fldconf.columndisplay],where:[fldconf.wherefieldname,"=",value]},function(res){
		domain={options:[{id:"",text:""}],lookup:{}};
		for(var i=0;i<res.length;i++){
			var item={id:res[i][fldconf.columnkey],text:res[i][fldconf.columndisplay]};
			domain.options.push(item);
			domain.lookup[item.id]=item.text;
		}
		_context.domain[fldconf.foreigntableid+"-"+value]=domain;
		field.options.items=domain.options;
		form.refresh();
		if(column.editable){
			column.editable.items=domain.options;
			column.editable.lookup=domain.lookup;
			grid.refresh();
		}
	});
}
function linkfield_onClick(windowid,value,wherefield){
	var tag={id:windowid,where:[wherefield,"=",value]}
	menu_onClick({item:{tag:tag}});
	event.stopImmediatePropagation();
}
function field_onChange(evt){
	var conf=(evt.column===undefined)?this.get(evt.target).options.conf:this.columns[evt.column].options.conf;
	//if(!NUT.isObjectEmpty(this.record)){
		this.record[conf.fieldname]=evt.value_new;
		updateChildFields(conf,this.record,this.parentRecord);
		
		if(conf.fieldtype=="select"&&conf.columndohoa&&this.tab.windowsearch=="filter"){//bind with map
			var lyrconf=GSMap.getLayerConfig(tabconf.tabledohoaid);
			GSMap.applyFilter(lyrconf.maporder,lyrconf.orderno,[conf.columndohoa,"=",evt.value_new]);

			var where=[conf.columnkey,"=",evt.value_new];
			var ext=_context.extent[where.toString()];
			if(ext)
				GSMap.zoomToExtent(ext);
			else NUT_DS.select({url:conf.foreigntable,select:"minx,miny,maxx,maxy",where:where},function(res){
				var ext=[res[0].minx,res[0].miny,res[0].maxx,res[0].maxy];
				if(res.length)GSMap.zoomToExtent(ext);
				_context.extent[where.toString()]=ext;
			});
		}
	//}
	//auto save
	if(this.tab){//la tab
		var tabconf=this.tab.tag;
		if(tabconf.isautosave){
			var isForm=this.tab.isForm;
			if(tabconf.lock&&(isForm?this.record[tabconf.lock]:this.get(this.getSelection()[0])[tabconf.lock]))
				w2alert("<span style='color:orange'>Can not update locked record!</span>");
			else {
				//if(isForm&this.validate(true).length)return;
				
				var changes=isForm?[this.getChanges()]:this.getChanges();
				var hasChanged=false;
				var columnkey=tabconf.columnkey;
				for(var i=0;i<changes.length;i++){
					var change=changes[i];
					if(!NUT.isObjectEmpty(change)){
						var data={};//remove "" value
						for(var key in change)if(change.hasOwnProperty(key)&&key!=columnkey)
							data[key]=(change[key]===""?null:change[key]);
						var recid=(isForm?this.record[columnkey]:change[columnkey]);
						var p={url:tabconf.urledit,where:[columnkey,"=",recid],data:data};
						
						NUT_DS.update(p,function(res){
							//if(timeArchive)archiveRecord(tabconf.urledit.substr(0,tabconf.urledit.lastIndexOf("/")),item.id,data,recid,tabconf.tableid,timeArchive);
							//if(isForm)grid.set(recid,data);
							NUT.tagMsg("Record updated.","lime");
						});
						hasChanged=true;
					}
				}
				if(hasChanged)this.applyChanges();
				else NUT.tagMsg("No change!","yellow");
			}
		}
	}
}

function updateChildFields(conf,record,parentRecord){
	if(conf.children.length){	
		for(var i=0;i<conf.children.length;i++){
			fldconf=conf.children[i];
			var form=w2ui[_context.idFormPopup?_context.idFormPopup:"divform_"+fldconf.tabid];
			if(fldconf.fieldtype=="select")
				loadChildSelect(fldconf,record[conf.fieldname]);
			if(fldconf.calculation){
				var _v=[];
				for(var v=0;v<fldconf.calculationInfos.length;v++){
					var info=fldconf.calculationInfos[v];
					if(info.func)//childs
						_v[v]=calculateChilds(info);
					else if(info.tab)//parent
						_v[v]=parentRecord[info.field];
					else _v[v]=record[info.field];
				}
				var	value=eval(fldconf.calculation);
				form.record[fldconf.fieldname]=value;
				form.refresh(fldconf.fieldname);
				//w2ui["divgrid_"+fldconf.tabid].grid.refresh();
				updateChildFields(fldconf,form.record,form.parentRecord);
			}
			if(fldconf.displaylogic){
				var value=eval(fldconf.displaylogic);
				//if(panel.fields){//is form
					var el=form.get(fldconf.fieldname).el;
					el.style.display=value?"":"none";
					el.parentNode.previousElementSibling.style.display=el.style.display;
				//}else value?panel.showColumn(fldconf.fieldname):panel.hideColumn(fldconf.fieldname);
			}
		}
	}
}
function calculateChilds(info){
	var records=w2ui["divgrid_"+info.tab].records;
	var result=(info.func=="min"?Number.MAX_VALUE:(info.func=="max"?Number.MIN_VALUE:0));
	for(var i=0;i<records.length;i++){
		value=records[i][info.field];
		switch (info.func){
			case "avg":
			case "sum":result+=value;break;
			case "count":result++;break;
			case "min":if(value<result)result=value;break;
			case "max":if(value>result)result=value;break;
		}
	}
	if(info.func=="avg")result/=res.length;
	return result;
}
function buildForm(div,tab){
	var conf=tab.tag;
	conf.default={};
	var group=null,colGroup=null;
	var fields=[],columns=[],searches=[], summary={}, index=0;
	for(var i=0;i<conf.fields.length;i++){
		var fldconf=conf.fields[i];
		if(!fldconf.isprikey){
			if(fldconf.fieldname=="clientid")conf.default.clientid=_context.user.clientid;
			if(fldconf.fieldname=="applicationid")conf.default.applicationid=_context.curApp.applicationid;
		}		
		var domain=null;
		if(fldconf.fieldtype=="select"){
			domain=_context.domain[fldconf.domainid||fldconf.foreigntable];
		}
		
		if(fldconf.isdisplaygrid){
			var column={field:fldconf.fieldname,text:fldconf.alias,size:"100px", sortable:true,frozen:fldconf.isfrozen,options:{conf:fldconf}};
			summary[fldconf.fieldname]="<input class='nut-fld-filter' placeholder='⌕' onfocus='this.select()' onchange='filter_onChange(this,"+conf.tabid+",\""+fldconf.fieldname+"\",this.value)'/>";
			if(fldconf.fieldtype=="int"||fldconf.fieldtype=="number"||fldconf.fieldtype=="currency"||fldconf.fieldtype=="date"||fldconf.fieldtype=="datetime"||fldconf.fieldtype=="percent")column.render=fldconf.fieldtype;
			if(fldconf.fieldtype=="image")column.render=function(rec,idx,col_idx){
				var val=rec[this.columns[col_idx].field];
				var html="";
				try{
					var path=(val?JSON.parse(val):[]);
					for(var i=0;i<path.length;i++)html+="&nbsp;<a class='nut-link' target='_blank' href='image/"+path[i]+"'>["+(i+1)+"]</a>";
				}catch(e){
					html="&nbsp;<a class='nut-link' target='_blank' href='upload/"+val+"'>[Hình ảnh]</a>";
				}
				return html;
			}
			if(fldconf.foreignwindowid){
				column.render=function(rec,idx,col_idx){					
					var conf=this.columns[col_idx].options.conf;
					return "<a class='nut-link' onclick='linkfield_onClick("+conf.foreignwindowid+",\""+rec[conf.fieldname]+"\",\""+conf.wherefieldname+"\")'>"+rec[conf.fieldname]+"</a>";
				}
			}
			if(!(fldconf.isreadonly||tab.windowsearch)){
				column.editable={type:fldconf.fieldtype,conf:fldconf};
				if(domain)column.editable.items=domain.items;
				if(domain&&fldconf.parentfieldid){
					column.editable.lookup=domain.lookup;
					column.render=function(rec,idx,col_idx){
						var col=this.columns[col_idx];
						var lookup=col.editable.lookup;
						return lookup[rec[col.field]];
					}
				}
			}
			columns.push(column);
		}

		if(fldconf.isdisplay){
			var field={field: fldconf.fieldname, type:fldconf.fieldtype, required: fldconf.isrequire&&!fldconf.isprikey, html:{label:fldconf.foreignwindowid?"<a class='nut-link' onclick='linkfield_onClick("+fldconf.foreignwindowid+","+fldconf.fieldname+".value,\""+fldconf.wherefieldname+"\")'>"+fldconf.alias+"</a>":fldconf.alias,column:index++%conf.layoutcolumn,attr:fldconf.isreadonly?"disabled":"tabindex=0"},options:{conf:fldconf}};
			if(domain&&!fldconf.parentfieldid){field.options.items=domain.items;field.options.showNone=true};
			if(fldconf.placeholder)field.html.attr+=" placeholder='"+fldconf.placeholder+"'";
			if(fldconf.displaylength){
				field.html.attr+=" style='width:"+fldconf.displaylength+"px'";
				column.size=fldconf.displaylength+"px";
			}
			if(fldconf.fieldlength)field.html.attr+=" maxlength='"+fldconf.fieldlength+"'";
			if(fldconf.vformat)field.html.attr+=" pattern='"+fldconf.vformat+"'";
			if(fldconf.colspan!=null)colGroup=fldconf.colspan;
			if(fldconf.rowspan!=null)colGroup=(fldconf.rowspan?"after":"before");
			if(fldconf.fieldgroup){
				field.html.column=_isMobile?0:colGroup;
				field.html.group=fldconf.fieldgroup;
				field.html.groupCollapsable=true;
			}
			if(fldconf.defaultvalue)conf.default[fldconf.fieldname]=fldconf.defaultvalue.startsWith("NUT.")?eval(fldconf.defaultvalue):fldconf.defaultvalue;
			if(fldconf.issearch)searches.push(field);
			
			fields.push(field);
		}
	}
	var divTool=document.createElement("div");
	divTool.id="divtool_"+conf.tabid;
	div.appendChild(divTool);
	var divContent=document.createElement("div");
	divContent.id="divcont_"+conf.tabid;
	divContent.className="nut-full";
	div.appendChild(divContent);
	//form
	var divForm=conf.layout||document.createElement("div");
	divForm.id="divform_"+conf.tabid;
	divForm.className="nut-full";
	divContent.appendChild(divForm);
	//grid
	var divGrid=document.createElement("div");
	divGrid.id="divgrid_"+conf.tabid;
	divGrid.className="nut-full";
	divContent.appendChild(divGrid);

	var opt={
		name:divGrid.id,
		url:(conf.parenttabid||tab.windowsearch)?"":conf.urlview||conf.urledit,
		limit:100,
		httpHeaders:{Prefer:"count=exact",Authorization:"Bearer "+(_context.curApp.applicationid?_context.user.sign:_context.user.ssign)},
		recid:conf.columnkey,
		multiSelect:false,
		columns:columns,
		searches: searches,
		onSelect:grid_onSelect,
		onLoad:grid_onLoad,
		onRequest:grid_onRequest,
		onError:grid_onError,
		onChange:field_onChange,
		onDblClick:grid_onDblClick,
		onColumnClick:grid_onColumnClick, 
		show:{skipRecords:false},
		summary:[summary],
		//reorderColumns:true,
		tab:tab
	}
	if(tab.windowsearch)opt.show={selectColumn: true};
	var isArchive=conf.isarchive&&conf.archive;
	var items=null;
	if(tab.windowsearch){
		divForm.style.height="40%";
		divGrid.style.height="60%";
		items=[{type:'button',id:"OK",text:'✔️ Ok',tooltip:"Ok"},{type:'break'},{type:'button',id:"CLEAR",text:'❌ Clear',tooltip:"Clear"},{type:'button',id:"SEARCH",text:'🔍 Search',tooltip:"Search"},{type:'spacer'}];
	}else {
		divForm.style.display="none";
		items=[{type:'check',id:"GRID",text:'⧉',tooltip:"Grid/Form"},{type:'button',id:"LOAD",text:'⭮',tooltip:"Reload"},{type:'break'}];
		if(searches.length)items.push({type:'check',id:"FILTER",text:'👓',tooltip:"Filter (* to find any)"});
		if(searches.length)items.push({type:'button',id:"FIND",text:'🔍',tooltip:"Find (* to find any)"});
		if(!conf.isnotinsert)items.push({type:'button',id:"NEW",text:'📄',tooltip:"Add New"});
		if(!conf.isnotinsert)items.push({type:'button',id:"BLANK",text:'📩',tooltip:"Add Blank"});
		if(!conf.isnotupdate&&conf.bangtrunggian)items.push({type:'button',id:"LINK",text:'🔗',tooltip:"Add Link"});
		if(!conf.isnotupdate)items.push({type:(isArchive?"menu":"button"),id:(isArchive?"save":"SAVE"),text:'💾',tooltip:"Save Edit",items:[{id:"SAVE",text:"Save"},{id:"SAVE_A",text:"Archive & Save"}]});
		if(!conf.isnotdelete)items.push({type:(isArchive?"menu":"button"),id:(isArchive?"del":"DEL"),text:'❌',tooltip:"Delete",items:[{id:"DEL",text:"Delete"},{id:"DEL_A",text:"Archive & Delete"}]});

		if(conf.islock&&conf.lock)items.push({type:'button',id:"LOCK",text:'🔒',tooltip:"Lock/Unlock"});
		if(isArchive)items.push({type:'button',id:"ARCH",text:'🕰️',tooltip:"Archive"});
		//if(conf.columnparent)items.push({type:'button',id:"TREE",text:'🎛️',tooltip:"Tree view"});
		items.push({type:'break'});
		if(conf.filterfield){
			var filterfields=JSON.parse(conf.filterfield);
			if(conf.filterwhere){//where filter
				var filterwheres=JSON.parse(conf.filterwhere);
				for(var i=0;i<filterwheres.length;i++){
					items.push({type:'menu-radio',id:"FLT_"+i,text:filterwheres[i],group:0,tag:filterwheres[i]});
				}
			}else{// value filter
				var lookupfilter={},lookupdefault={};
				for(var i=0;i<filterfields.length;i++){
					var filter=filterfields[i];
					lookupfilter[filter[0]]=true;
					var value=filter[1];
					if(value!=null)
						lookupdefault[filter[0]]=(typeof(value)=="string"&&value.startsWith("NUT.")?eval(value):value);
				}
				
				var field=null;
				for(var i=0;i<conf.fields.length;i++){
					field=conf.fields[i];
					var key=field.fieldname;
					if(lookupfilter[key]){
						var values=[{id:": ALL",text:"-ALL-",tag:[key,"ALL"]},{id:": BLANK",text:"-BLANK-",tag:[key,null]}];
						if(field.domainid){
							var selValue=(lookupdefault&&lookupdefault[key])?_context.domain[field.domainid].lookup[lookupdefault[key]]:"";
							var dmItems=_context.domain[field.domainid].items;
							for(var j=0;j<dmItems.length;j++)
								values.push({id:": "+dmItems[j].id,text:dmItems[j].text,tag:[key,dmItems[j].id]});
							items.push({type:'menu-radio',id:"flt_"+key,text:function(item){return item.tag+item.selected},items: values,selected:": "+selValue,tag:field.alias});
							//async error need fix
							/*if(selValue){
								var search=w2ui[divGrid.id].getSearchData(key);
								if(search)search.value=selValue;
								else w2ui[divGrid.id].searchData.push({field:key,operator:"=",value:selValue});
							}*/
						}
					}
				}
			}
		}
		items.push({type:'spacer'});
		var lookup={};
		for(var i=0;i<conf.menuitems.length;i++){
			var menuitem=conf.menuitems[i];
			var isSummary=(menuitem.issummary);
			var item={type:(isSummary?'menu':'button'),id:menuitem.execname||menuitem.menuitemid,text:menuitem.menuitemname,tooltip:menuitem.description,tag:menuitem.linkwindowid};
			if(isSummary)item.items=[];
			if(menuitem.parentid){
				lookup[menuitem.parentid].items.push(item);
			}else{
				items.push(item);
			}
			lookup[menuitem.menuitemid]=item;
		}
		items.push({type:'break'});
		if(!(conf.isnotinsert||conf.isnotupdate))items.push({type:'button',id:"XLS_IMP",text:'📥',tooltip:"Import .xls"});
		if(!conf.isnotselect)items.push({type:'button',id:"XLS_EXP",text:'📤',tooltip:"Export .xls"});
	}
	var items2=[{type:'break'},
				{type:'button',id:"PREV",text:'🡐',tooltip:"Previous",tag:-1},
				{type:'button',id:"NEXT",text:'🡒',tooltip:"Next",tag:+1},
				{type:'html',id:"ID",html:"<u title='Current row' style='color:blue' id='divrec_"+conf.tabid+"' onclick='$(this).w2tag(this.tag,{position:\"left\"})'></u>/<span title='Rows count' id='divtotal_"+conf.tabid+"'></span>"},
				{ type: 'break' },
				{type:'button',id:"COLS",text:"#",tooltip:"Config Grid"},
				{type:'check',id:"EXPD",text:"»",tooltip:"Expand"}];
	//toolbar
	if(w2ui[divTool.id]){
		w2ui[divTool.id].items=items.concat(items2);
		w2ui[divTool.id].render(divTool);
	}else $(divTool).w2toolbar({
		name: divTool.id,
		items: items.concat(items2),
		onClick:tool_onClick,
		tab:tab
	});
	
	//form
	w2ui[divForm.id]?w2ui[divForm.id].render(divForm):
	$(divForm).w2form({
		name:divForm.id,
		fields:tab.windowsearch?searches:fields,
		recid:conf.columnkey,
		onChange:field_onChange,
		tab:tab
	});
	
	//grid
	w2ui[divGrid.id]?w2ui[divGrid.id].render(divGrid):
	$(divGrid).w2grid(opt);
}
function buildWindow(div,conf,tabLevel,callback){
	var divTabs=document.createElement("div");
	divTabs.id="divtabs_"+conf.tabid+"_"+tabLevel;
	div.appendChild(divTabs);
	var tabs=[],windowsearch=(conf.windowtype=="search"||conf.windowtype=="filter"?conf.windowtype:false);
	for(var i=0;i<conf.tabs.length;i++){
		var tabconf=conf.tabs[i];
		if(_isMobile)tabconf.layoutcolumn=1;
		else if(!tabconf.layoutcolumn)tabconf.layoutcolumn=LAYOUT_COLUMN;
		
		if(tabconf.tablevel==tabLevel){
			var divTab=document.createElement("div");
			divTab.id="divtab_"+tabconf.tabid;
			divTab.style.height=(tabconf.maxLevel?"50%":"100%");
			div.appendChild(divTab);
			var tab={id:tabconf.tabid,text:tabconf.tabname,tag:tabconf,windowsearch:windowsearch,callback:callback};
			buildForm(divTab,tab);
			if(tabconf.tabs.length)for(var l=tabLevel+1;l<=tabconf.maxLevel;l++)
				buildWindow(divTab,tabconf,l,callback);
			if(tabs.length)divTab.style.display="none";
			tabs.push(tab);
		}
	}

	if(!windowsearch){
		if(w2ui[divTabs.id]){
			w2ui[divTabs.id].tabs=tabs;
			w2ui[divTabs.id].render(divTabs);
		}else $(divTabs).w2tabs({
			name: divTabs.id,
			active: tabs[0].id,
			tabs: tabs,
			onClick: tab_onClick
		});
	}
	if(conf.isopensearch){
		tool_onClick({item:{id:"FIND"},tab:tabs[0],originalEvent:{target:div}});
	}
}
function grid_onError(evt){
	NUT.tagMsg(evt.error.status,"red");
}
function filter_onChange(filter,tabid,key,value){
	var grid=w2ui["divgrid_"+tabid];
	grid.setSearchData(key,value);
	grid.summary[0][key]="<input class='nut-fld-filter' placeholder='⌕' value='"+value+"' onfocus='this.select()' onchange='filter_onChange(this,"+tabid+",\""+key+"\",this.value)'/>";
	grid.reload();
}

function filter_onSelect(evt){
	var key=this.tag[0];
	var grid=this.tag[1];
	var item=evt.item;
	var value=(item.id=="BLANK"?null:item.text);
	
	if(item.checked){
		var search=grid.getSearchData(key);
		if(search){
			Array.isArray(search.value)?search.value.push(value):search.value=[value];
			search.operator="in";
		}else grid.searchData.push({field:key,operator:"in",value:[value]});
	} else {//remove value from search [value]
		for(var i=0;i<search.value.length;i++){
			var val=search.value[i];
			if(val==value){
				search.value.splice(i,1);
				break;
			}
		}
	}
}
function filter_onOk(tabid,key,ok){
	var grid=w2ui["divgrid_"+tabid];
	if(!ok){
		for(var i=0;i<grid.searchData.length;i++){
			if(grid.searchData[i].field==key){
				grid.searchData.splice(i,1);
				break;
			}
		}
	}
	grid.reload();
}
function grid_onColumnClick(evt){
	if(evt.originalEvent.shiftKey){//do filter
		var key=evt.field;
		var conf=this.tab.tag;

		var where=(conf.whereclause?[JSON.parse(conf.whereclause)]:[]);
		for(var i=0;i<this.searchData.length;i++){
			var search=this.searchData[i];
			where.push(search.operator=="begins"?[search.field,"like",search.value+"*"]:[search.field,search.operator,search.value]);
		}
		var wclause=true;
		for(var i=0;i<where.length;i++){
			var w=where[i];
			var clause=w[0]+" "+w[1]+" "+(Array.isArray(w[2])?(Number.isInteger(w[2][0])?"("+w[2].join(",")+")":"('"+w[2].join("','")+"')"):(Number.isInteger(w[2])?w[2]:"'"+w[2]+"'"));
			if(wclause===true)wclause=clause;
			else wclause+=" and "+clause;
		}
		
		var self=this;
		NUT_DS.call({url:conf.urledit.replace("/"+conf.tablename,"/rpc/f_distincttext"),data:{col:key,tab:conf.tablename,wclause:wclause}},function(dist){
			var items=[{id:"ALL",text:"<button onclick='filter_onOk("+conf.tabid+",\""+key+"\",true)'>✔️ Apply</button>&nbsp;<button onclick='filter_onOk("+conf.tabid+",\""+key+"\",false)'>❌ Clear</button>",disabled:true},{id:"BLANK",text:"-BLANK-",keepOpen:true}];
			for(var i=0;i<dist.length;i++){
				if(dist[i].text)items.push({id:i,text:dist[i].text,keepOpen:true});
			}
			$(evt.originalEvent.target).w2menu({
				items:items,
				type:"check",
				tag:[key,self],
				onSelect:filter_onSelect
			});
		});

		evt.preventDefault();
	}else if(evt.originalEvent.altKey){//do frozen
		var column=this.getColumn(evt.field);
		column.frozen=!column.frozen;
		this.refresh();
		evt.preventDefault();
	}
}
function grid_onRequest(evt){
	var tabconf=this.tab.tag;
	var data={
		limit:evt.postData.limit,
		offset:evt.postData.offset,
		order:(evt.postData.sort?evt.postData.sort[0].field+"."+evt.postData.sort[0].direction:(tabconf.orderbyclause||tabconf.columnkey+".desc"))
	}
	if(evt.url.includes("/sys")||evt.url.includes("/sv_"))data.clientid="eq."+_context.user.clientid;
	
	var where=[];
	if(_context.user.kvhcs.length&&tabconf.columnkvhc)where.push([tabconf.columnkvhc,"in",_context.user.kvhcs]);
	if(tabconf.whereclause)where.push(JSON.parse(tabconf.whereclause));
	
	if(evt.postData.search){
		for(var i=0;i<evt.postData.search.length;i++){
			var search=evt.postData.search[i];
			where.push([search.field,search.operator,search.value]);
		}
	}
	if(where.length)data.and=NUT_DS.decodeSql({where:where},true);
	if(evt.postData.select){
		data.or=NUT_DS.decodeSql({where:evt.postData.select},true);
	}
	evt.postData=data;
}
function grid_onLoad(evt){
	var header=evt.xhr.getResponseHeader("Content-Range");
	var total=header.split("/")[1];
	var records=evt.xhr.responseJSON;
	evt.xhr.responseJSON={
		status:"success",
		total:total,
		records:records
	}
	this.tab.isForm=(total=="1");
	var tab=this.tab;
	var toolbar=w2ui["divtool_"+tab.id];
	tab.isForm?toolbar.check("GRID"):toolbar.uncheck("GRID");
	
	evt.onComplete=function(){
		if(header.startsWith("0")||total=="0"){
			if(!tab.windowsearch){
				if(!this.show.summary)switchFormGrid(tab.id,tab.isForm);
				if(records.length){
					this.noZoomTo=true;
					this.select(records[0][this.recid]);
				};
			}
			document.getElementById("divrec_"+tab.id).innerHTML=(total=="0")?"0":"1";
		}
		document.getElementById("divtotal_"+tab.id).innerHTML=total;
	}
}
function grid_onSelect(evt){
	var recid=evt.recid;
	if(!(this.selectType=="cell"||recid=="-none-")){
		var conf=this.tab.tag;
		this.record=this.get(recid);
		var lab=document.getElementById("divrec_"+conf.tabid);
		lab.innerHTML=this.get(recid,true)+1;
		lab.tag=conf.columnkey+"="+recid;
		
		if(this.tab.tag.tabledohoaid&&this.tab.windowsearch!="search"){
			if(this.noZoomTo)
				this.noZoomTo=false;
			else {
				var where="";
				for(var i=0;i<this.tab.tag.fields.length;i++){
					var field=this.tab.tag.fields[i];
					if(field.columndohoa&&this.record[field.columndohoa]){
						var clause=field.columndohoa+"="+this.record[field.columndohoa];
						where+=where?" and "+clause:clause;
					}
				}
				var lyrconf=GSMap.getLayerConfig(this.tab.tag.tabledohoaid);
				if(where)GSMap.zoomToFeature(lyrconf.maporder,lyrconf.layername,where);
			}
		}
		if(!this.tab.windowsearch&&this.record){
			updateFormRecord(conf,this.record,this.parentRecord);
			for(var i=0;i<conf.children.length;i++)updateChildGrids(conf.children[i],this.record);
		}
	}
}
function updateFormRecord(conf,record,parentRecord){
	var form=w2ui["divform_"+conf.tabid];
	
	//fire onchange
	/*for(var i=0;i<form.fields.length;i++){
		var key=form.fields[i].field;
		if(record[key]!=form.record[key])
			form.onChange({target:key,value_old:form.record[key],value_new:record[key]});
	}*/
	
	form.clear();
	form.record=record;
	form.parentRecord=parentRecord;
	form.refresh();
}
function updateChildGrids(conf,record){
	var divTab=document.getElementById("divtab_"+conf.tabid);
	if(divTab){
		var grid=w2ui["divgrid_"+conf.tabid];
		if(record){
			divTab.needUpdate=true;
			grid.parentRecord=record;
		}
		if(divTab.needUpdate&&divTab.style.display.length==0){
			//support multi fields
			grid.originSearch=[];
			var truonglienketcon=conf.truonglienketcon.split(",");
			var truonglienketcha=conf.truonglienketcha.split(",");
			if(conf.bangtrunggian&&!conf.istabtrunggian){//lien ket n-n
				var truongtrunggiancon=conf.truongtrunggiancon.split(",");
				var truongtrunggiancha=conf.truongtrunggiancha.split(",");
			
				var where=[];
				for(var i=0;i<truongtrunggiancha.length;i++)where.push([truongtrunggiancha[i],"=",grid.parentRecord[truonglienketcha[i]]]);
				NUT_DS.select({url:conf.bangtrunggian,select:conf.truongtrunggiancon,where:where},function(res){
					var hasSearch=false;
					for(var i=0;i<truongtrunggiancon.length;i++){
						var ids=[];
						for(var j=0;j<res.length;j++){
							var id=res[j][truongtrunggiancon[i]];
							if(id!==null)ids.push(id);
						}
						grid.originSearch.push({field:truonglienketcon[i],operator:"in",value:ids});
						var search=grid.getSearchData(truonglienketcon[i]);
						if(search){
							search.value=ids;
							hasSearch=true;
						}
					}
					if(!hasSearch)for(var i=0;i<grid.originSearch.length;i++)grid.searchData.push(grid.originSearch[i]);
					grid.load(conf.urledit);
				});
			}else{// lien ket 1-n or la tab trung gian
				var hasSearch=false;
				for(var i=0;i<truonglienketcon.length;i++){
					var val=grid.parentRecord[truonglienketcha[i]];
					grid.originSearch.push({field:truonglienketcon[i],operator:"=",value:val});
					var search=grid.getSearchData(truonglienketcon[i]);
					if(search){
						search.value=val;
						hasSearch=true;
					}
				}
				if(!hasSearch)for(var i=0;i<grid.originSearch.length;i++)grid.searchData.push(grid.originSearch[i]);
				
				if(conf.istabtrunggian){
					var truongtrunggiancon=conf.truongtrunggiancon.split(",");
					var truongtrunggiancha=conf.truongtrunggiancha.split(",");
					hasSearch=false;
					for(var i=0;i<truongtrunggiancon.length;i++){
						var val=grid.parentRecord[truongtrunggiancha[i]];
						grid.originSearch.push({field:truongtrunggiancon[i],operator:"=",value:val});
						var search=grid.getSearchData(truongtrunggiancon[i]);
						if(search){
							search.value=val;
							hasSearch=true;
						}
					}
					if(!hasSearch)for(var i=0;i<grid.originSearch.length;i++)grid.searchData.push(grid.originSearch[i]);
				}
				grid.load(conf.urledit);
			}
			divTab.needUpdate=false;
		}
	}
}
function tab_onClick(evt){
	if(!evt.tab.windowsearch){
		var id=evt.tab.id;
		for(var i=0;i<this.tabs.length;i++){
			var tab=this.tabs[i];
			var divTab=document.getElementById("divtab_"+tab.id);
			divTab.style.display=(tab.id==id)?"":"none";
			if(tab.id==id)updateChildGrids(tab.tag);
		}
		w2ui["divgrid_"+id].resize();
		w2ui["divform_"+id].resize();
	}
}
function grid_onDblClick(evt){
	if(!(this.columns[evt.column].editable||this.tab.windowsearch=="filter")){
		this.tab.isForm=!this.tab.isForm;
		switchFormGrid(this.tab.id,true);
	}
}
function switchFormGrid(tabid,isForm){
	var form=w2ui["divform_"+tabid];
	var grid=w2ui["divgrid_"+tabid];
	form.box.style.display=isForm?"":"none";
	grid.box.style.display=isForm?"none":"";
	if(isForm)form.resize();else grid.resize();
	form.tab.isForm=isForm;
}
function xlsInsert_onClick(conf,csv){
	/*if(csv.includes(",")){
		NUT.tagMsg("Contains invalid character [,]","yellow",document.activeElement);
		return;
	}*/
	var lines=csv.split('\n');
	if(lines.length<2){
		NUT.tagMsg("Empty data","yellow",document.activeElement);
	}else{
		/*var domain={};
		for(var i=0;i<conf.fields.length;i++){
			var fld=conf.fields[i];
			if(fld.domainid)domain[fld.fieldname]=_context.domain[fld.domainid].lookdown;
		}*/

		var header=lines[0].split('\t');
		var data=[];
		for(var i=1;i<lines.length;i++){
			var line=lines[i];
			if(line){
				var values=lines[i].split('\t');
				var json={};
				for(var j=0;j<values.length;j++){
					var key=header[j];
					var value=(values[j]===""?null:values[j]);
					//json[key]=domain[key]?domain[key][value]:value;
					json[key]=value;
				}
				data.push(json);
			}
		}
		NUT_DS.insert({url:conf.urledit,data:data},function(res){
			NUT.tagMsg("Record updated.","lime",document.activeElement);
		});

	}
}
function xlsUpdate_onClick(conf,csv){
	var lines=csv.split('\n');
	if(lines.length<2){
		NUT.tagMsg("Empty data","yellow",document.activeElement);
	}else{
		/*var domain={},privalue=null;
		for(var i=0;i<conf.fields.length;i++){
			var fld=conf.fields[i];
			if(fld.domainid)domain[fld.fieldname]=_context.domain[fld.domainid].lookdown;
		}*/

		var header=lines[0].split('\t');
		
		for(var i=1;i<lines.length;i++){
			var line=lines[i];
			if(line){
				var values=line.split('\t');
				var json={};
				for(var j=0;j<values.length;j++){
					var key=header[j];
					var value=(values[j]===""?null:values[j]);
					if(key==conf.columnkey)privalue=value;
					//else json[key]=domain[key]?domain[key][value]:value;
					else json[key]=value;
				}
			}
			NUT_DS.update({url:conf.urledit,where:[conf.columnkey,"=",privalue],data:json},function(res){
				NUT.tagMsg("Record updated.","lime",document.activeElement);
			});
		}

	}
}

function tool_onClick(evt){
	var item=(evt.subItem||evt.item);
	var tab=this.tab||evt.tab;
	var conf=tab.tag;
	var grid=w2ui["divgrid_"+tab.id];
	var form=w2ui["divform_"+tab.id];
	var isForm=grid.tab.isForm;
	var timeArchive=null;
	var target=evt.originalEvent.target;
	switch(item.id){
		case "OK":
			if(tab.windowsearch=="search"&&tab.callback)tab.callback(item.id,grid.get(grid.getSelection()));
			break;
		case "COLS":
			var html=grid.initColumnOnOff(true);
			$(target).w2overlay(html);
			break;
		case "EXPD":
			var style=document.getElementById("divtab_"+tab.id).style;
			if(item.checked){
				style.position="";
				style.top="";
				style.height=(conf.maxLevel?"50%":"100%");
			}else {
				style.position="absolute";
				style.top=0;
				style.height="100%";
			}
			w2ui.w2menu.goFlat(!item.checked);
			isForm?form.resize():grid.resize();
			break;
		case "LOAD":
			grid.reload();
			break;
		case "PREV":
		case "NEXT":
			var index=grid.getSelection(true)[0]+item.tag;
			if(grid.records[index])grid.select(grid.records[index][grid.recid]);
			break;
		case "FIND":
			var id="divfind_"+tab.id;
			w2popup.open({
				title:"🔎 Find - <i>Nhập * để tìm kiếm gần đúng</i>",
				modal:true,
				width: 920,
				body: '<div id="'+id+'" class="nut-full"></div>',
				onClose:function(evt){_context.idFormPopup=null},
				onOpen:function(evt){
					evt.onComplete=function(){
						var div=document.getElementById(id);
						w2ui[id]?w2ui[id].render(div):
						$(div).w2form({ 
							name: id,
							fields: grid.searches,
							onChange:field_onChange,
							tab:tab,
							actions: {
								"⛌ Close": function () {
									w2popup.close();
								},
								"⭯ Reset":function(){
									this.clear();
									grid.searchData=grid.originSearch?[grid.originSearch]:[];
									grid.reload();
									w2popup.close();
								},
								"✔️ Find": function (evt) {
									grid.searchData=grid.originSearch?[grid.originSearch]:[];
									var changes=this.getChanges();
									for(var key in changes)if(changes.hasOwnProperty(key)){
										var value=changes[key];
										grid.setSearchData(key,value.toString());
									}
									grid.reload();
								},
								"☰":function(){
									w2popup.close();
									grid.searchOpen(target);
								},
							}
						});
						var inputs=div.getElementsByClassName('w2ui-input')
						for(var i=0;i<inputs.length;i++)inputs[i].disabled=false;
						_context.idFormPopup=id;
					}
				}
			});
			break;
		case "FILTER":
			grid.show.summary=!item.checked;
			grid.searchData=grid.originSearch?[grid.originSearch]:[];
			if(item.checked){
				for(var i=0;i<grid.columns.length;i++){
					var col=grid.columns[i];
					grid.summary[0][col.field]="<input class='nut-fld-filter' placeholder='⌕' onfocus='this.select()' onchange='filter_onChange(this,"+tab.id+",\""+col.field+"\",this.value)'/>";
				}
				grid.reload();
			} else grid.refresh();
			break;
		case "BLANK":
			w2prompt("Number of row", "📩 Add blank row", function(action,value){
				if(action=="ok"){
					var num=Number.parseInt(value);
					if(num){
						//find not require field
						var nullField=null;
						for(var i=0;i<conf.fields.length;i++){
							if(!conf.fields[i].isrequire){
								nullField=conf.fields[i];
								break;
							}
						}
						if(nullField){
							var data=[];
							for(var i=0;i<num;i++){
								var rec={};
								rec[nullField.fieldname]=null;
								if(conf.parenttabid&&!conf.bangtrunggian){//n-n is not support
									rec[conf.truonglienketcon]=grid.parentRecord[conf.truonglienketcha];
								}
								data.push(rec);
							}
							NUT_DS.insert({url:conf.urledit,data:data},function(res){
								grid.reload();
								NUT.tagMsg(res.length + " record(s) inserted.","lime");
							});
						}
					}
				}
			});
			break;
		case "GRID":
			if(grid.records.length){
				grid.tab.isForm=!isForm;
				switchFormGrid(tab.id,grid.tab.isForm);
				break;
			}
		case "NEW":
			//var newfields=[];
			//for(var i=0;i<form.fields.length;i++)if(!form.fields[i].options.conf.isprikey)newfields.push(form.fields[i]);
			if(conf.parenttabid&&!conf.bangtrunggian)conf.default[conf.truonglienketcon]=grid.parentRecord[conf.truonglienketcha];
			var id="divnew_"+tab.id;
			w2popup.open({
				title:"📝 <i>New</i> - "+conf.tabname,
				modal:true,
				width: 920,
				height: 610,
				body: '<div id="'+id+'" class="nut-full"></div>',
				onClose:function(evt){_context.idFormPopup=null},
				onOpen:function(evt){
					evt.onComplete=function(){
						var div=document.getElementById(id);
						if(w2ui[id]){
							w2ui[id].record=conf.default;
							w2ui[id].render(div);
						}else $(div).w2form({
							name: id,
							fields: form.fields,
							onChange:field_onChange,
							record:conf.default,
							actions: {
								"⛌ Close": function () {
									w2popup.close();
								},
								"✔️ Add New": function (evt) {
									if(this.validate(true).length)return;
									var recTrungGian=null;
									if(conf.parenttabid){
										var parentKey=grid.parentRecord[conf.truonglienketcha];
										if(conf.bangtrunggian){//lien ket n-n
											recTrungGian={};
											recTrungGian[conf.truongtrunggiancha]=parentKey;
										}else{
											this.record[conf.truonglienketcon]=parentKey;
										}
									}
									var self=this;
									var data={};//remove "" value
									for(var key in this.record)if(this.record.hasOwnProperty(key)&&this.record[key]!=="")
										data[key]=this.record[key];
									if(conf.beforechange)runComponent(conf.beforechange,{records:[data],config:conf});
									NUT_DS.insert({url:conf.urledit,data:data},function(res){
										if(res.length){
											NUT.tagMsg("Record inserted.","lime",document.activeElement);
											grid.add(res[0],true);
											grid.select(res[0][grid.recid]);
											if(recTrungGian){
												recTrungGian[conf.truongtrunggiancon]=res[0][conf.truonglienketcon];
												NUT_DS.insert({url:conf.bangtrunggian,data:recTrungGian},function(res2){
													if(res2.length)NUT.tagMsg("Record inserted.","lime",document.activeElement);
												});
											}
											if(conf.onchange)runComponent(conf.onchange,{
												records:res,
												config:conf
											});
										}
									});
								}
							}
						});
						_context.idFormPopup=id;
					}
				}
			});
			break;
		case "LINK":
			var id="divlink_"+tab.id;
			w2popup.open({
				title:"📝 <i>Link</i> - "+conf.tabname,
				modal:true,
				width: 460,
				height: 610,
				body: '<div id="'+id+'" class="nut-full"></div>',
				onClose:function(evt){_context.idFormPopup=null},
				onOpen:function(evt){
					evt.onComplete=function(){
						var div=document.getElementById(id);
						_context.idFormPopup=id;
						
						NUT_DS.select({srl:"sv_window_tab",clientid:_context.curApp.clientid,where:[["windowtype","=","search"],["tableid","=",conf.tableid]]},function(win){
							if(win.length){
								NUT_DS.select({srl:"syscache",clientid:_context.curApp.clientid,where:["windowid","=",win[0].windowid]},function(caches){
									if(caches.length){
										winconf=NUT.configWindow(zipson.parse(caches[0].config));
										winconf.tabid=winconf.windowid;
										_context.winconfig[winconf.windowid]=winconf;

										buildWindow(div,winconf,0,function(code,records){
											if(code=="OK"&&records.length){
												
											}
											w2popup.close();
										});
									}
								});
							}else{// simple link
								NUT_DS.select({url:conf.urledit,order:conf.columndisplay,where:["clientid","=",_context.user.clientid]},function(res){
									var lookupNode={};
									for(var i=0;i<grid.records.length;i++){
										var rec=grid.records[i];
										lookupNode[rec[conf.columnkey]]=rec;
									}
									var nodes=[];
									for(var i=0;i<res.length;i++){
										var rec=res[i];
										var key=rec[conf.columnkey];
										nodes.push({id:key,text:"<input type='checkbox' onclick='return false' id='sidechk_"+key+"' "+(lookupNode[key]?"checked":"")+"/> "+rec[conf.columndisplay],tag:{record:rec,config:conf}});
									}
									if(w2ui[div.id]){
										w2ui[div.id].nodes=nodes;
										w2ui[div.id].render(div);
									}else $(div).w2sidebar({
										name:div.id,
										nodes:nodes,
										onClick: function(evt) {
											var conf=evt.node.tag.config;
											var rec=evt.node.tag.record;
											var chk=document.getElementById("sidechk_"+evt.node.id);
											chk.checked=!chk.checked;
											if(chk.checked){//add
												var recTrungGian={};
												recTrungGian[conf.truongtrunggiancha]=grid.parentRecord[conf.truonglienketcha];
												recTrungGian[conf.truongtrunggiancon]=rec[conf.truonglienketcon];
												if(rec.clientid!==undefined)recTrungGian.clientid=rec.clientid;
												NUT_DS.insert({url:conf.bangtrunggian,data:recTrungGian},function(res2){
													if(res2.length)NUT.tagMsg("Record inserted.","lime");
												});
											}else{//delete
												NUT_DS.delete({url:conf.bangtrunggian,where:[[conf.truongtrunggiancon,"=",rec[conf.truonglienketcon]],[conf.truongtrunggiancha,"=",grid.parentRecord[conf.truonglienketcha]]]},function(res2){
													NUT.tagMsg("Record delete.","lime");
												});
											}
										}
									});
								});
							}
						});
					}
				}
			});
			break;
		case "SAVE_A":
			timeArchive=new Date();//w2prompt({label:"Archive time",value:new Date()});
			if(!timeArchive)break;
		case "SAVE":
		
			if(conf.lock&&(isForm?form.record[conf.lock]:grid.get(grid.getSelection()[0])[conf.lock]))
				w2alert("<span style='color:orange'>Can not update locked record!</span>");
			else {
				if(isForm&form.validate(true).length)return;
				
				var changes=isForm?[form.getChanges()]:grid.getChanges();
				var hasChanged=false;
				var columnkey=conf.columnkey;
				for(var i=0;i<changes.length;i++){
					var change=changes[i];
					if(!NUT.isObjectEmpty(change)){
						var data={};//remove "" value
						for(var key in change)if(change.hasOwnProperty(key)&&key!=columnkey)
							data[key]=(change[key]===""?null:change[key]);
						var recid=(isForm?form.record[columnkey]:change[columnkey]);
						var p={url:conf.urledit,where:[columnkey,"=",recid],data:data};
						
						NUT_DS.update(p,function(res){
							if(timeArchive)archiveRecord(conf.urledit.substr(0,conf.urledit.lastIndexOf("/")),item.id,data,recid,conf.tableid,timeArchive);
							if(isForm)grid.set(recid,data);
							NUT.tagMsg("Record updated.","lime");
						});
						hasChanged=true;
					}
				}
				if(hasChanged)isForm?form.applyChanges():grid.applyChanges();
				else NUT.tagMsg("No change!","yellow");
			}
			break;
		case "DEL_A":
			timeArchive=new Date();//w2prompt({label:"Archive time",value:new Date()});
			if(!timeArchive)break;
		case "DEL":
			 w2confirm('<span style="color:red">Delete selected record?</span>').yes(function(){
				var recid=isForm?form.record[conf.columnkey]:grid.getSelection();
				if(recid)NUT_DS.delete({url:conf.urledit,where:[conf.columnkey,"=",recid]},function(res){
					if(timeArchive)archiveRecord(conf.urledit.substr(0,conf.urledit.lastIndexOf("/")),item.id,isForm?form.record:grid.get(recid),recid,conf.tableid,timeArchive);
					grid.remove(recid);
					NUT.tagMsg("1 record deleted.","lime");
				});else NUT.tagMsg("No selection!","yellow");
			 });
			break;
		case "SEARCH":
			grid.searchData=grid.originSearch?[grid.originSearch]:[];
			var changes=form.getChanges();
			for(var key in changes)if(changes.hasOwnProperty(key)){
				var value=changes[key];
				grid.setSearchData(key,value.toString());
			}
			grid.load(conf.urledit);
			break;
		case "CLEAR":
			form.clear();
			break;
		case "XLS_IMP":
			var fieldnames=[];
			for(var i=0;i<conf.fields.length;i++)
				fieldnames.push(conf.fields[i].fieldname);
			var header=fieldnames.join('\t')+"\n";
			var id="txtimpxls_"+tab.id;
			_context.tabconf=conf;
			w2popup.open({
				title:"📥 <i>Import excel</i> - "+conf.tabname,
				modal:true,
				width: 1000,
				height: 700,
				body: '<textarea cols='+(header.length+8*fieldnames.length)+' id="'+id+'" style="height:100%">'+header+'</textarea>',
				buttons: '<button class="w2ui-btn" onclick="w2popup.close()">⛌ Close</button><button class="w2ui-btn" onclick="xlsInsert_onClick(_context.tabconf,'+id+'.value)">➕ Insert data</button><button class="w2ui-btn" onclick="xlsUpdate_onClick(_context.tabconf,'+id+'.value)">✔️ Update data</button>'
			});
			break;
		case "XLS_EXP":
			var win = window.open();

			var table=win.document.createElement("table");
			table.border=1;
			table.style.borderCollapse="collapse";
			
			var caption=table.createCaption();
			caption.innerHTML=conf.tabname;
			
			var data={
				url:grid.url,
				limit:grid.postData.limit,
				offset:grid.postData.offset,
				order:(grid.postData.sort?grid.postData.sort[0].field+"."+grid.postData.sort[0].direction:(conf.orderbyclause||conf.columnkey+".desc"))
			}
			if(grid.url.includes("/sys")||grid.url.includes("/sv_"))data.clientid="eq."+_context.user.clientid;
			
			var where=[];
			if(conf.whereclause)
				where.push([JSON.parse(conf.whereclause)]);

			if(grid.postData.search){
				for(var i=0;i<grid.postData.search.length;i++){
					var search=grid.postData.search[i];
					where.push(search.operator=="begins"?[search.field,"like",search.value+"*"]:[search.field,search.operator,search.value]);
				}
			}
			if(where.length) data.and=NUT_DS.decodeSql({where:where},true);
			if(grid.postData.select){
				data.or=NUT_DS.decodeSql({where:grid.postData.select},true);
			}
			
			NUT_DS.select(data,function(res){
				if(res.length){
					var row=table.insertRow();
					for(var i=0;i<grid.columns.length;i++){
						var cell=document.createElement("th");
						cell.innerHTML=grid.columns[i].field;
						row.appendChild(cell);
					}
					
					for(var i=0;i<res.length;i++){
						var row=table.insertRow();
						for(var j=0;j<grid.columns.length;j++){
							var cell=row.insertCell();
							cell.innerHTML=res[i][grid.columns[j].field];
						}
					}
					var a=win.document.createElement("a");
					a.style.cssFloat="right";
					a.download=conf.tablename+".xls";
					a.href='data:application/vnd.ms-excel,'+table.outerHTML.replace(/ /g, '%20');
					a.innerHTML="<img src='"+document.location.href+"/client/0/img/excel.png'>&nbsp;Kết xuất Excel";
					
					caption.appendChild(a);
					win.document.body.appendChild(table);
				}else NUT.tagMsg("No data!","yellow"); 
			});
			break;
		case "LOCK":
			var record=isForm?form.record:grid.record;
			var label=record[conf.lock]?"🔓 Unlock":"🔒 Lock";
			w2confirm(label+' selected record?').yes(function(){
				var data={};
				data[conf.lock]=record[conf.lock]?false:true;
				NUT_DS.update({url:conf.urledit,data:data,where:[conf.columnkey,"=",record[conf.columnkey]]},function(){
					record[conf.lock]=data[conf.lock];
					isForm?form.refresh():grid.refresh();
				});
			});
			break;
		case "ARCH":
			var recid=isForm?form.record[conf.columnkey]:grid.getSelection();
			NUT_DS.select({url:conf.urledit.substr(0,conf.urledit.lastIndexOf("/"))+"/sysarchive",where:[["tableid","=",conf.tableid],["recordid","=",recid]]},function(res){
				var id="divarch_"+tab.id;
				w2popup.open({
					title:"🕰️ <i>Archive</i> - "+conf.tabname,
					modal:true,
					width: 920,
					height: 700,
					body: '<div id="'+id+'" class="nut-full"></div>',
					onOpen:function(evt){
						evt.onComplete=function(){
							var div=document.getElementById(id);
							if(w2ui[id]){
								w2ui[id].records=res;
								w2ui[id].render(div);
							}else $(div).w2grid({
								name: id,
								style:"width:100%;height:100%",
								columns:[
									{ field: 'archiveid', text: 'ID', sortable:true},
									{ field: 'archivetype', text: 'Type', sortable:true},
									{ field: 'archivetime', text: 'Time', sortable:true},
									{ field: 'tableid', text: 'Table ID', sortable:true},
									{ field: 'recordid', text: 'Record ID', sortable:true},
									{ field: 'archive', text: 'Archive', sortable:true,info:{render: function(rec, idx, col){
										var obj=JSON.parse(rec.archive);
										var str="<table border='1px'><caption><b style='color:yellow'>"+(rec.archivetype=="DEL_A"?"Deleted":"Changed")+"!</b></caption>"
										for(var key in obj)if(obj.hasOwnProperty(key))
											str+="<tr><td align='right'><i>"+key+"</i></td><td>"+obj[key]+"</td></tr>";
										return str+"</table>";
									}}},
									{ field: 'clientid', text: 'Client ID', sortable:true}
								],
								records:res,
								recid:"archiveid"
							});
						}
					}
				});	
			});
			break;
		default:
			if(Number.isInteger(item.tag)){
				menu_onClick({item:{tag:{id:item.tag}},sel:grid.get(grid.getSelection())[0]});
			}else{
				if(item.id.startsWith("FLT_")){//where filter
					grid.searchData=[];
					for(var i=0;i<item.tag.length;i++){
						var where=item.tag[i];
						var value=where[2];
						var value=(typeof(value)=="string"&&value.startsWith("NUT.")?eval(value):value);
						grid.searchData.push({field:where[0],operator:where[1],value:value});
					}
					grid.reload();
				}else if(item.id.startsWith(": ")){//value filter
					var key=item.tag[0];
					var value=item.tag[1];
					grid.setSearchData(key,value=="ALL"?"":value);
					grid.reload();
				}else if(item.id.startsWith("Com_")){//run component
					runComponent(item.id,{
						records:grid.get(grid.getSelection()),
						parent:grid.parentRecord,
						config:conf,
						grid:grid,
						gsmap:GSMap
					});
				}
			}
	}
}
function archiveRecord(url,type,archive,recid,tableid,time){
	var data={
		archivetype:type,
		archivetime:(time||new Date()),
		archive:JSON.stringify(archive),
		recordid:recid,
		tableid:tableid,
		clientid:_context.user.clientid
	};
	NUT_DS.insert({url:url+"/sysarchive",data:data},function(res){
		if(res.length)NUT.tagMsg("Record archived.","lime");
	});
}
function runComponent(com,data,target){
	//data:records,parent,config,gsmap
	
	if(window[com]){
		window[com].run(data,target);
	}else{//load component
		var script=document.createElement("script");
		script.src="client/"+(com.startsWith("Com_Sys")?"0/0":_context.user.clientid+"/"+_context.curApp.applicationid)+"/"+com+".js";
		document.head.appendChild(script);
		script.onload=function(){
			window[com].run(data,target);
		}				
	}
}