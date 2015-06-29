function deleteEntry(entryID){
	$.ajax({
        url: '/deleteentry',
        type: 'DELETE',
        data: {"entryid": entryID},
        error: function(result){
            console.log("error: "+result);
        },
        success: function(result){
            console.log("success with: " + result);
            // here we need to redisplay the blogroll
            // location contains information about current url
            location.reload();
        }
    });
}

$("#publish-post").click(function(){
    $.ajax({
        url: '/insertpost',
        type: 'POST',
        data: $("#entryform").serializeArray(),
        error: function(result){
            console.log("error: "+result);
        },
        success: function(result){
            console.log("success with: " + result);
            // here we need to redisplay the blogroll
            // location contains information about current url
            window.location.replace("/blogroll");
    }
    });
});

// POST a new entry
// function postEntry(){

// }