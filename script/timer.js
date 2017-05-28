window.onload=function(){
			setInterval("getTime()", 1000);
};

function getTime(){
	var box = document.getElementById("timer");
	var now = new Date();

	var year = now.getFullYear();
	var month = now.getMonth()+1;
	var day = now.getDate();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	
	month = format(month);
	day = format(day);
	hour = format(hour);
	minute = format(minute);
	second = format(second);

	var i = now.getDay();
	var weeks = new Array();
	weeks[0] = "星期日";
	weeks[1] = "星期一";
	weeks[2] = "星期二";
	weeks[3] = "星期三";
	weeks[4] = "星期四";
	weeks[5] = "星期五";
	weeks[6] = "星期六";

	box.innerHTML = year+"年"+month+"月"+day+"日 "+hour+":"+minute+":"+second+" "+weeks[i];
}

function format(num){
	if(num<10){
		num = "0"+num;
	}
	return num;
}