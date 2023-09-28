var Com_HrmsInHopDongLaoDong={
	run:function(p){
		var self=this;
		if(p){
			if(p.records.length)this.inHopDong(p.records[0]);
			else NUT.tagMsg("Không có bản ghi nào được chọn!","yellow");
		}else NUT_DS.select({url:_context.service["hrms"].urledit+"hopdonglaodong",order:"ngaykyhd",where:["manhanvien","=",_context.user.username]},function(res){
			self.inHopDong(res[0]);
		});
	},
	inHopDong:function(hd){
		NUT_DS.select({url:_context.service["hrms"].urledit+"nhansu",where:["manhanvien","=",hd.manhanvien]},function(res){
			if(res.length){
				var nv=res[res.length-1];
				var win_hd=window.open("client/"+_context.user.clientid+"/"+_context.curApp.applicationid+"/In_HopDongLaoDong.html");
				win_hd.onload=function(){
					var ymd=hd.ngaykyhd?hd.ngaykyhd.split("-"):["","",""];
					
					//hopdong
					this.hd_sohopdong.innerHTML="Số "+(nv.sohoso||"..........")+"/"+(ymd[0]||"....")+"/HĐLĐ-"+nv.vitrilv;
					this.hd_ngaythangnam.innerHTML="Hà Nội, ngày "+(ymd[2]||".....")+" tháng "+(ymd[1]||".....")+" năm "+(ymd[0]||"........");
					this.hd_hoten.innerHTML=nv.hoten||"";
					this.hd_quoctich.innerHTML=_context.domain[22].lookup[nv.quoctich]||"";
					this.hd_ngaysinh.innerHTML=NUT.dmy(nv.ngaysinh)||"";
					this.hd_gioitinh.innerHTML=_context.domain[20].lookup[nv.gioitinh]||"";
					this.hd_noio.innerHTML=nv.noio||"";
					this.hd_diachi.innerHTML=nv.diachitt||"";
					this.hd_socmt.innerHTML=nv.socmt||"";
					this.hd_ngaycapcmt.innerHTML=NUT.dmy(nv.ngaycapcmt)||"";
					this.hd_noicapcmt.innerHTML=nv.noicapcmt||"";
					
					this.hd_ngaykyhd.innerHTML=NUT.dmy(hd.ngaykyhd)||"";
					this.hd_ngayketthuchd.innerHTML=NUT.dmy(hd.ngayketthuchd)||"";
					this.hd_diadiemlv.innerHTML=(nv.diadiemlv||"")+" - "+(_context.domain[9].lookup[nv.makhuvuc]||"");
					this.hd_vitrilv.innerHTML=_context.domain[14].lookup[nv.vitrilv]||"";
					
					//tncn
					this.tn_hoten.innerHTML=nv.hoten||"";
					this.tn_noio.innerHTML=nv.noio||"";
					this.tn_namhd.innerHTML=ymd[0]||"........";
					if(nv.masothue){
						this.tn_o1.innerHTML=nv.masothue[0]||"";
						this.tn_o2.innerHTML=nv.masothue[1]||"";
						this.tn_o3.innerHTML=nv.masothue[2]||"";
						this.tn_o4.innerHTML=nv.masothue[3]||"";
						this.tn_o5.innerHTML=nv.masothue[4]||"";
						this.tn_o6.innerHTML=nv.masothue[5]||"";
						this.tn_o7.innerHTML=nv.masothue[6]||"";
						this.tn_o8.innerHTML=nv.masothue[7]||"";
						this.tn_o9.innerHTML=nv.masothue[8]||"";
						this.tn_o10.innerHTML=nv.masothue[9]||"";
						
						this.tn_o11.innerHTML=nv.masothue[10]||"";
						this.tn_o12.innerHTML=nv.masothue[11]||"";
						this.tn_o13.innerHTML=nv.masothue[12]||"";
						this.tn_o14.innerHTML=nv.masothue[13]||"";
					}
					this.tn_ngaythangnam.innerHTML=this.hd_ngaythangnam.innerHTML;
					
					//camket
					this.ck_hoten.innerHTML=nv.hoten||"";
					this.ck_ngaysinh.innerHTML=NUT.dmy(nv.ngaysinh)||"";
					this.ck_noio.innerHTML=nv.noio||"";
					this.ck_socmt.innerHTML=nv.socmt||"";
					this.ck_ngaycapcmt.innerHTML=NUT.dmy(nv.ngaycapcmt)||"";
					this.ck_noicapcmt.innerHTML=nv.noicapcmt||"";				
					this.ck_vitrilv.innerHTML=_context.domain[14].lookup[nv.vitrilv]||"";
					this.ck_vitrilv2.innerHTML=_context.domain[14].lookup[nv.vitrilv]||"";
					var isPG=(nv.vitrilv=="BA")||"";
					this.ck_dieu2PG.style.display=(isPG?"":"none");
					this.ck_dieu2SM.style.display=(isPG?"none":"");
					this.ck_ngaythangnam.innerHTML=this.hd_ngaythangnam.innerHTML;
					
					this.print();
				}
			} else NUT.tagMsg("Không có dữ liệu hợp đồng!","yellow");
		});
	}
}