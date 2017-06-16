$(function(){
	$(".nav a").click(function() {
		$(this).removeClass("btn-success").addClass("btn-primary")
			.siblings().removeClass("btn-primary").addClass("btn-success");
	});

	$(".share a").hover(function() {
		$(this).css('opacity', '0.6');
	}, function() {
		$(this).css('opacity', '1');
	});

	$(document).scroll(function() {
		if($(document).scrollTop() >= 500){
			$("#totop").css('display','block');
		}else {
			$("#totop").css('display','none');
		}
	});

});