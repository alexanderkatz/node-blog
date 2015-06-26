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
        }
    });
}