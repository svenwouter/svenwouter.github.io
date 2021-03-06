/*
	Jammer genoeg is het ontwikkelen van een volledig werkend navigatie systeem door vergrote foto's niet gelukt.
	Door het gebrek aan tijd hebben we genoegen genomen met het alleen vooruit navigeren als je op de foto klikt.
*/

$(document).ready(function(){
	
		getPhotos();
		
		$("#searchValue").keypress(function(e){
			if(e.keyCode == 13)
				getPhotos();
		});
		
		$("#resultCount").keypress(function(e){
			if(e.keyCode == 13)
				getPhotos();
		});
		
		$("#searchBtn").hover(function(){
			$(this).stop().animate({backgroundColor: "#003366"}, 300);
		}, function(){
			$(this).stop().animate({backgroundColor: "#336699"}, 300);
		});

		$("#bigPhotoSection").click(nextPhoto);
});

function getPhotos(){
	var searchQuery = $("#searchValue").val();	
	var aantal = $("#resultCount").val();
	var count = 0;
	$.each($("#flickrTable tr"), function(){
		$(this).empty();
	});
	
	$.getJSON("https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=4ef2fe2affcdd6e13218f5ddd0e2500d&text=" + searchQuery + "&per_page="+ aantal + " &format=json&jsoncallback=?",
		function(data){
			var id = "";
			var farm = "";
			var secret = "";
			var server = "";
	
			$.each(data.photos.photo, function(i,set){
				count++;
				id = set.id;
				farm = set.farm;
				secret = set.secret;
				server = set.server;
				if(count == 4)
					count = 1;
				$("#row" + count).append("<td><img class = 'flickrImg' src = 'https://farm" + farm + ".staticflickr.com/" + server + "/" + id + "_" + secret + "_q" + ".jpg'/></td>"); 
			});
			
			$(".flickrImg").click(enlargePhoto);
		});
}

function enlargePhoto(){
	$(".overlay").fadeIn(500);
	setSurroundingImages(this);
	var src = $(this).attr("src");
	var enhancedSrc = src.replace("_q.jpg", "_c.jpg");
	var img = new Image();
	img.src = enhancedSrc;
	$("#bigPhotoSection").html(img);
	$("#bigPhotoSection").fadeIn(500);
}

function hidePhotoSection(){
	$("#bigPhotoSection").fadeOut(500, function(){
		$("#bigPhotoSection").empty();
		$(".overlay").fadeOut(500);
	});
}

function nextPhoto(){
	$("#bigPhotoSection").fadeOut(300, function(){
		$("#bigPhotoSection").empty();
		var img = new Image();
		var nextImg = $("#bigPhotoSection").data("surroundingImg").next;
		img.src = nextImg.attr("src").replace("_q.jpg", "_c.jpg");
		$("#bigPhotoSection").html(img);
		setSurroundingImages(nextImg);
		$("#bigPhotoSection").fadeIn(500);
	});
}

function setSurroundingImages(photo){
	var nextSource = $(photo).parent().next().children();
	var prevSource = $(photo).parent().prev().children();
	if(typeof(nextSource) == "undefined" || nextSource == null || nextSource == "")
		 nextSource = $(photo).parent().parent().next().first().children();
	if(typeof(prevSource) === "undefined")
		prevSource = $(photo).parent().parent().prev().first().children();
	$("#bigPhotoSection").data("surroundingImg", {next: nextSource, prev: prevSource});
}
	
