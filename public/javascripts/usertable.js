// Userlist data array for filling in info box
var userListData = [];

// DOM ready
$(document).ready(function(){
    // populate user table on initial page load
    populateTable();

    // delete a user
    $('#usertable tbody').on('click','td a.linkdeleteuser', deleteUser);

});

// Functions =============================================================
//Fill table with data
function populateTable(){
    // The empty string
    var tableContent = "";

    // JQuery AJAX call for JSON
    $.getJSON("/users/userlist", function (data){
        // populate our global variable with data
        userListData = data;
        // for each item in our JSON add a table row
        // and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.userName + '">' + this.userName + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });
        // inject the whole content string into our HTML table
        $('#usertable tbody').html(tableContent);
    });
}

function deleteUser(event){
    event.preventDefault();

    //pop up confirmation dialogue
    var confirmation = confirm("Are you sure you want to delete this user?");

    // check to make sure the user confirmed
    if (confirmation === true){
        // if they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/'+$(this).attr('rel')
        }).done(function(response) {
            // check for successful blank response
            if (response.msg === ''){
                //update the table
                populateTable();
            }
            else{
                // if something goes wrong alert error msg that our service returned
                alert("error: "+response.msg);
            }
        });
    } else {
        // if they said no to the confirm do nothing
        return false;
    }
}
