var Com_SysAssignUserRole={
	run:function(p){
		if(p.records.length){
			this.app=p.records[0];
			this.user=p.parent;
			var self=this;
			NUT_DS.select({srl:"sysaccess",select:"accessid,roleid",where:["userid","=",self.user.userid]},function(res){
				var existRoles={};
				for(var i=0;i<res.length;i++)existRoles[res[i].roleid]=res[i].accessid;
				NUT_DS.select({srl:"sysrole",where:["applicationid","=",self.app.applicationid]},function(roles){
					if(roles.length)self.showDlgAssignUserRole(roles,existRoles);
				});
			});
		}else NUT.tagMsg("No Application selected!","yellow");
	},
	showDlgAssignUserRole:function(roles,existRoles){
		var fields=[];
		for(var i=0;i<roles.length;i++)
			fields.push({field:roles[i].roleid,type:'checkbox',html:{column:i%2,label:roles[i].rolename}});
		var self=this;
		var id="divCom_SysAssignUserRole";
		w2popup.open({
			title: '📥 <i>Assign role for user</i> - '+this.user.username,
			modal:true,
			width: 700,
			height: 500,
			body: '<div id="'+id+'" class="nut-full"></div>',
			onOpen:function(evt){
				evt.onComplete=function(){
					var div=document.getElementById(id);
					if(w2ui[id]){
						w2ui[id].record=existRoles;
						w2ui[id].render(div);
					}else $(div).w2form({ 
						name: id,
						fields: fields,
						record:existRoles,
						actions: {
							"⛌ Close":function(){
								w2popup.close();
							},
							"✔️ Assign":function(){
								var change=this.getChanges();
								for(key in change)if(change.hasOwnProperty(key)){
									self.assignRole(key,change[key],existRoles[key]);
								}
							}
						}
					});
				}
			}
		});
	},
	assignRole:function(roleid,isAssign,accessid){
		if(isAssign){
			var data={
				applicationid:this.app.applicationid,
				roleid:roleid,
				userid:this.user.userid,
				clientid:_context.user.clientid
			};
			NUT_DS.insert({srl:"sysaccess",data:data},function(res){
				if(res.length)NUT.tagMsg("Record inserted.","lime");
			});
		}else{
			NUT_DS.delete({srl:"sysaccess",where:["accessid","=",accessid]},function(res){
				NUT.tagMsg("1 record deleted.","lime");
			});
		}
	}
}