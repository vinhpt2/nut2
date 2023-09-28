function body_onLoad(){
    $(divGrid).w2grid({
        name: 'grid',
		dataType: "RESTFULL",
		reorderColumns: true,
        columns: [
            { field: 'sohoadon', text: 'Rec. Id'},
            { field: 'ngayhoadon', text: 'Last Name'},
            { field: 'noidung', text: 'Email'},
            { field: 'diachinguoinhan', text: 'Profit'},
            { field: 'idhoadon', text: 'Start Date'}
        ],
		recid:'idhoadon',
		url:"http://oritholdings.hopto.org:3002/hoadon"
    }).refresh();
}