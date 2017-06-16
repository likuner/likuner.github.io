$(function(){
	$("#nav li").click(function(){
		$(this).removeClass('btn-default').addClass('btn-info');
		$(this).siblings().removeClass('btn-info').addClass('btn-default');
	});

	$("#nav #yi").click(function(){
		location.href='index.html';
	});

	$("#nav #er").click(function() {
		$("#left .arti:first-child")[0].scrollIntoView();
	});

	$("#nav #san").click(function() {
		// location.href='./resume/cv.html';
		window.open('./resume/cv.html');
	});
	$("#nav #si").click(function() {
		open('./message/msg.html');
	});

	$(".arti a.com").click(function() {
		$(this).toggleClass('btn-info btn-success');
	});

	$("#myconn button, #myconn span").hover(function(){
		$(this).css('opacity','0.8');
	}, function(){
		$(this).css('opacity','1');
	});

	$("#myconn #mywx").hover(function(){
		$("#wxewm").stop().fadeIn(600);
	}, function(){
		$("#wxewm").stop().fadeOut(600);
	});

	$('[data-toggle="popover"]').popover();
	$('[data-toggle="tooltip"]').tooltip();

	$(document).scroll(function() {
		if( $(document).scrollTop() >= 500){
		$("#totop").css('display','block');
	}else {
		$("#totop").css('display','none');
	}
	});

	$("#totop").hover(function() {
		$("#totop span:nth-child(2)").text('TO TOP');
	}, function() {
		$("#totop span:nth-child(2)").text('回到顶部');
	}).click(function(){
		$(document.body).animate({scrollTop : 0}, 200);
	});


});