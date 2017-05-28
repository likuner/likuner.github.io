$().ready(function() {
	$(document).scroll(function() {
		if($(this).scrollTop() >= 200){
			$("#totop").css('display','block');
		}else {
			$("#totop").css('display','none');
		}
	});

	$(".nav #er").click(function() {
		
	});
});