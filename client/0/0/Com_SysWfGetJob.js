var Com_SysWfGetJob={
	run:function(p){
		if(p.records.length){
			NUT_DS.update({srl:"wfjob",where:["jobid","=",p.records[0].jobid],data:{assignstatusid:1}},function(res){
				NUT.tagMsg("Job getted.","lime");
			});
		}else NUT.tagMsg("No Job selected!","yellow");
	}
}