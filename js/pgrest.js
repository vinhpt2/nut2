var PgREST={
	auth:null,
	OPERATOR:{
		"is":"is.",
		"!is":"not.is.",
		"like":"ilike.",
		"!like":"not.ilike.",
		"in":"in.(",
		"!in":"not.in.(",
		"=":"eq.",
		"!=":"not.eq.",
		">":"gt.",
		">=":"gte.",
		"<":"lt.",
		"<=":"lte."
	},
	login:function(p,onok){
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if(this.readyState==XMLHttpRequest.DONE){
				var res=JSON.parse(this.response);
				if(this.status==0||(this.status>=200&&this.status<400)){
					if(res.length)PgREST.auth=["Bearer "+res[0].ssign,"Bearer "+res[0].sign];
					onok(res);
				}else NUT.errorMsg(res);
			}
		};
		xhr.onerror=NUT.errorMsg;
		xhr.open("POST",NUT_URL+"rpc/f_login",true);

		xhr.setRequestHeader("Content-Type","application/json;charset=UTF-8");
		xhr.send(JSON.stringify(p));
	},
	getNow:function(onok){
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if(this.readyState==XMLHttpRequest.DONE){
				if(this.status==0||(this.status>=200&&this.status<400))
					onok(new Date(parseInt(this.response)));
				else
					NUT.errorMsg(JSON.parse(this.response));
			}
		};
		xhr.onerror=NUT.errorMsg;
		xhr.open("GET",NUT_URL+"rpc/f_now",true);
		if(PgREST.auth)xhr.setRequestHeader("Authorization",PgREST.auth[0]);
		xhr.send();
	},
	decodeSql:function(p,notReturnLogic){
		var decode="";
		if(p.where){
			var i0=(p.where[0]=="and"||p.where[0]=="or"?1:0);
			var logic=i0?p.where[0]:"and";
			if(notReturnLogic!=0)logic+="=";
			var needOpen=(p.where.length>i0+1||notReturnLogic!=0);
			if(Array.isArray(p.where[i0])){//array-array
				if(needOpen)decode+=notReturnLogic?"(":logic+"(";
				for(var i=i0;i<p.where.length;i++){
					var where=p.where[i];
					var j0=(where[0]=="and"||where[0]=="or"?1:0);
					if(i>i0)decode+=",";
					if(Array.isArray(where[j0])){//array-array
						decode+=this.decodeSql({where:where},0);
					}else{//array
						var value=where[j0+2];
						var clause=where[j0]+"."+this.OPERATOR[where[j0+1]]+(typeof(value)=="string"&&value.startsWith("NUT.")?eval(value):value);
						if(where[j0+1]=="in"||where[j0+1]=="!in")clause+=")";
						decode+=clause;
					}
				}
				if(needOpen)decode+=")";
			}else{//array
				var value=p.where[i0+2];
				decode+=p.where[i0]+(i0?".":"=")+this.OPERATOR[p.where[i0+1]]+(typeof(value)=="string"&&value.startsWith("NUT.")?eval(value):value);
				if(p.where[i0+1]=="in"||p.where[i0+1]=="!in")decode+=")";
				if(notReturnLogic)decode="("+decode+")";
			}
		}

		if(p.select)decode+="&select="+p.select;
		if(_context.user.clientid&&p.url&&(p.url.includes("/sys")||p.url.includes("/sv_")))decode+="&clientid=eq."+(p.clientid!=undefined?p.clientid:_context.user.clientid);
		if(p.order)decode+="&order="+p.order;
		return decode;
	},
	select:function(p,onok){
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if(this.readyState==XMLHttpRequest.DONE){
				var res=JSON.parse(this.response);
				if(this.status==0||(this.status>=200&&this.status<400))
					onok(res);
				else
					NUT.errorMsg(res);
			}
		};
		xhr.onerror=NUT.errorMsg;
		xhr.open("GET",(p.url||NUT_URL+p.srl)+"?"+this.decodeSql(p),true);
		if(PgREST.auth)xhr.setRequestHeader("Authorization",PgREST.auth[p.url&&_context.curApp.applicationid?1:0]);
		if(p.range){
			xhr.setRequestHeader("Range",p.range);
			xhr.setRequestHeader("Prefer","count=exact");
		}
		xhr.send();
	},
	toCsv:function(data){
		if(data.length){
			var keys=Object.keys(data[0]);
			var csv=keys.toString();
			
			for(var i=0;i<data.length;i++){
				var line=[];
				for(var j=0;j<keys.length;j++){
					var value=data[i][keys[j]];
					(value==null)?line.push("NULL"):line.push(value);
				}
				csv+="\n"+line;
			}
			return csv;
		}
	},
	insert:function(p,onok){
		var isBulk=Array.isArray(p.data);
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if(this.readyState==XMLHttpRequest.DONE){
				if(this.status==0||(this.status>=200&&this.status<400))
					onok(isBulk?this.response:JSON.parse(this.response));
				else
					NUT.errorMsg(JSON.parse(this.response));
			}
		};
		xhr.onerror=NUT.errorMsg;
		xhr.open("POST",p.url||NUT_URL+p.srl,true);
		if(PgREST.auth)xhr.setRequestHeader("Authorization",PgREST.auth[p.url&&_context.curApp.applicationid?1:0]);
		xhr.setRequestHeader("Content-Type","application/json;charset=UTF-8");
		if(!isBulk)xhr.setRequestHeader("Prefer","return=representation");
		xhr.send(JSON.stringify(p.data));
	},
	insertCsv:function(p,onok){
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if(this.readyState==XMLHttpRequest.DONE){
				if(this.status==0||(this.status>=200&&this.status<400))
					onok(this.response);
				else
					NUT.errorMsg(JSON.parse(this.response));
			}
		};
		xhr.onerror=NUT.errorMsg;
		xhr.open("POST",p.url||NUT_URL+p.srl,true);
		if(PgREST.auth)xhr.setRequestHeader("Authorization",PgREST.auth[p.url&&_context.curApp.applicationid?1:0]);
		xhr.setRequestHeader("Content-Type","text/csv");
		xhr.send(p.data);
	},
	update:function(p,onok){
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if(this.readyState==XMLHttpRequest.DONE){
				if(this.status==0||(this.status>=200&&this.status<400))
					onok(this.response);
				else
					NUT.errorMsg(JSON.parse(this.response));
			}
		};
		xhr.onerror=NUT.errorMsg;
		xhr.open("PATCH",(p.url||NUT_URL+p.srl)+"?"+this.decodeSql(p),true);
		if(PgREST.auth)xhr.setRequestHeader("Authorization",PgREST.auth[p.url&&_context.curApp.applicationid?1:0]);
		xhr.setRequestHeader("Content-Type","application/json;charset=UTF-8");
		xhr.send(JSON.stringify(p.data));
	},
	upsert:function(p,onok){
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if(this.readyState==XMLHttpRequest.DONE){
				if(this.status==0||(this.status>=200&&this.status<400))
					onok(this.response);
				else
					NUT.errorMsg(JSON.parse(this.response));
			}
		};
		xhr.onerror=NUT.errorMsg;
		xhr.open("POST",(p.url||NUT_URL+p.srl)+"?on_conflict="+p.keys,true);
		if(PgREST.auth)xhr.setRequestHeader("Authorization",PgREST.auth[p.url&&_context.curApp.applicationid?1:0]);
		xhr.setRequestHeader("Content-Type","application/json;charset=UTF-8");
		xhr.setRequestHeader("Prefer","resolution=merge-duplicates");
		xhr.send(JSON.stringify(p.data));
	},
	delete:function(p,onok){
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if(this.readyState==XMLHttpRequest.DONE){
				if(this.status==0||(this.status>=200&&this.status<400))
					onok(this.response);
				else
					NUT.errorMsg(JSON.parse(this.response));
			}
		};
		xhr.onerror=NUT.errorMsg;
		xhr.open("DELETE",(p.url||NUT_URL+p.srl)+"?"+this.decodeSql(p),true);
		if(PgREST.auth)xhr.setRequestHeader("Authorization",PgREST.auth[p.url&&_context.curApp.applicationid?1:0]);
		xhr.send();
	},
	call:function(p,onok){
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if(this.readyState==XMLHttpRequest.DONE){
				try{
					var res=JSON.parse(this.response);
					if(this.status==0||(this.status>=200&&this.status<400))
						onok(res);
					else NUT.errorMsg(res);
				} catch(err){
					onok(this.response);
				}
			}
		};
		xhr.onerror=NUT.errorMsg;
		xhr.open("POST",p.url||NUT_URL+p.srl,true);
		if(PgREST.auth)xhr.setRequestHeader("Authorization",PgREST.auth[p.url&&_context.curApp.applicationid?1:0]);
		xhr.setRequestHeader("Content-Type","application/json;charset=UTF-8");		
		xhr.send(JSON.stringify(p.data));
    },
    upload: function (p, onok) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE) {
				var res=JSON.parse(this.response);
                if (this.status == 0 || (this.status >= 200 && this.status < 400))
                    onok(res);
                else
                    NUT.errorMsg(res);
            }
        };
        xhr.onerror=NUT.errorMsg;
        xhr.open("POST",p.url||NUT_URL+p.srl, true);
		//if(PgREST.auth)xhr.setRequestHeader("Authorization",PgREST.auth[p.url&&_context.curApp.applicationid?1:0]);
        xhr.send(p.data);
    },
	queryMetadata:function(url,onok){
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if(this.readyState==XMLHttpRequest.DONE){
				var res=JSON.parse(this.response);
				if(this.status==0||(this.status>=200&&this.status<400))
					onok(res);
				else
					NUT.errorMsg(res);
			}
		};
		xhr.onerror=NUT.errorMsg;
		xhr.open("GET",url,true);
		if(PgREST.auth)xhr.setRequestHeader("Authorization",PgREST.auth[1]);
		xhr.send();
	}
}