var Com_HrmsDiLuongTrongTech={
	run:function(p){
		var now=new Date();
		w2popup.open({
			title: '📜 <i>Đi lương trong Techcombank</i>',
			modal:true,
			width: 360,
			height: 220,
			body: "<table style='margin:auto'><caption><b><i>Thời gian đi lương</i></b></caption><tr><td>Năm</td><td><input id='numTinhCong_Year' style='width:60px' type='number' value='"+now.getFullYear()+"'/></td><td>Tháng</td><td><input id='numTinhCong_Month' style='width:60px' type='number' value='"+(now.getMonth()+1)+"'/></td><td>Ngày</td><td><input id='numTinhCong_Day' style='width:60px' type='number' value='"+(now.getDate())+"'/></td></tr><tr><td>Lần</td><td colspan='5'><input type='number' id='numLanChuyen' style='width:60px' value='0'/></td></tr><tr><td>Nội dung chuyển</td><td colspan='5'><textarea id='txtNoiDungChuyen'>ORIT chuyển tiền</textarea></td></tr></table>",
			buttons: '<button class="w2ui-btn" onclick="w2popup.close()">⛌ Close</button><button class="w2ui-btn" onclick="Com_HrmsDiLuongTrongTech.runReport()">✔️ Report</button>'
		})

	},
	runReport:function(){
		if(numTinhCong_Year.value&&numTinhCong_Month.value&&numTinhCong_Day.value){
			NUT_DS.select({url:_context.service["hrms"].urledit+"rpt_diluong",where:[["nam","=",numTinhCong_Year.value],["thang","=",numTinhCong_Month.value],["ngay","=",numTinhCong_Day.value],["lan","=",numLanChuyen.value],["nganhang","=","TECHCOMBANK"]]},function(res){
				if(res.length){
					var win=window.open("client/"+_context.user.clientid+"/"+_context.curApp.applicationid+"/DiLuongTrongTech.html");
					win.onload=function(){
						this.labThangNam.innerHTML=numTinhCong_Day.value+"/"+numTinhCong_Month.value+"/"+numTinhCong_Year.value+"_"+numLanChuyen.value;
						this.labNgayBaoCao.innerHTML=(new Date()).toLocaleString();
						for(var i=0;i<res.length;i++){
							var rec=res[i];
							var row=this.tblData.insertRow();
							row.innerHTML="<td>"+rec.sotien+"</td><td>"+NUT.loaiBoDau(rec.hoten)+"</td><td align='center'>"+rec.sotaikhoan+"</td><td>"+txtNoiDungChuyen.value+"</td><td>"+rec.sohoso+"</td>";
						}
					}
				} else NUT.tagMsg("No data to report!","yellow");
			});
		} else NUT.tagMsg("Nhập năm, tháng, ngày trước khi thực hiện!","yellow");
	}
}