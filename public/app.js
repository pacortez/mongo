var numArticles = 10;
var startingIndex = 5;

$(document).on("click", "#scrape-button", function() {
    // alert("clicked")
    $.ajax({
        type: "GET",
        url: "/scrape"
    })
    .then(function(data) {
        $.getJSON("/articles", function(data) {
            for(var i = startingIndex; i < numArticles; i++) {
                //Display info on page
                // console.log(data[i])
                console.log(data[i])
                $("#articles").append("<div class='container'>")
                $("#articles").append("<h5 class='card-title'>" + data[i].title + "</h5>")
                $("#articles").append("<a href='https://www.nytimes.com" + data[i].link + "' target='_blank' class='btn btn-primary'>Read Article</a>")
                $("#articles").append("<button type='button' class='btn btn-info save-article' data-title='" + data[i].title + "'>Save Article</button>")
                $("#articles").append("<button type='button' class='btn btn-info make-note' data-id='" + data[i]._id + "'>Make Note</button>")
            }
            numArticles +=5;
            startingIndex +=5;
        });
        
        
        
        
        // for(var i = 0; i < data.length; i++) {
        //     $("#articles").append("<p data-id'" + data[i]._id + "'>" )
        //     $("#title").append(data[i].title)
        //     $("#link").append(data[i].link)
        // }
    })
})

$.getJSON("/articles", function(data) {
    for(var i = 0; i < 5; i++) {
        //Display info on page
        // console.log(data[i])
        $("#articles").append("<div class='container'>")
                $("#articles").append("<h5 class='card-title'>" + data[i].title + "</h5>")
                $("#articles").append("<a href='https://www.nytimes.com" + data[i].link + "' target='_blank' class='btn btn-primary'>Read Article</a>")
                $("#articles").append("<button type='button' class='btn btn-info save-article' data-title='" + data[i].title + "'>Save Article</button>")
                $("#articles").append("<button type='button' class='btn btn-info make-note' data-id='" + data[i]._id + "'>Make Note</button>")


    }
});


//Grabs articles as JSON
$.getJSON("/articles", function(data) {
    for(var i = 0; i < data.length; i++) {
        //Display info on page
        console.log(data[i])
        $("#articles").append("<p data-id'" + data[i]._id + "'>" )
        $("#title").append(data[i].title)
        $("#link").append(data[i].link)
    }
});

//If a user clicks on a p tag
$(document).on("click", ".make-note", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })

    //When ajax call is made to the article, the below is displayed on the page
    .then(function(data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>SaveNote</button>");

        if(data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});



$(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })

    .then(function(data) {
        console.log(data);
        $("#notes").empty();
    });

    $("#titleinput".val(""));
    $("#bodyinput").val("");
});

$(document).on("click", "#clear-articles", function() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/cleararticles",
        success: function(response) {
            $("#articles").empty();
        }
    });
});

$(document).on("click", ".save-article", function() {
    
    // console.log($(this).attr("data-title"))
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/savedarticles",

        data: {
            title: $(this).attr("data-title"),
            // body: data
        }
        // success: function(response) {
            
        // }
    });
});