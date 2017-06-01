//javascript to control UI

$(".articles").hide()
;
$('.button').on("click", function () {
    $(".first").hide();
    $(".articles").show();
})

$('.save').on('click', function (){
    //side ID from button 
    var articleId = $(this).attr("data-article-id");
    console.log(articleId);
    $.ajax({
    method: "GET",
    url: "/saved/" + articleId
  }).done(function(response){
      console.log(response);
  })

        //get id
        //ajax to '/articles/idGoesHere'
});

