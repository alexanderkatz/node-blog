// Userlist data array for filling in info box
var userListData = [];

// DOM ready
$(document).ready(function(){
    // populate user table on initial page load
    populateTable();

    // username link click
    $('#usertable tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // add userButton click
    $('#btnAddUser').on('click', addUser);

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

// show user info
function showUserInfo(event) {
    // prevent link fom firing
    event.preventDefault();

    // retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // get index of oject based on id value
    var arrayPosition = userListData.map(function(arrayItem){
        return arrayItem.userName;
    }).indexOf(thisUserName);

    // get our user object
    var thisUserObject = userListData[arrayPosition];

    // populate info box
    $('#userInfoName').text(thisUserObject.fullName);
    console.log(thisUserObject.fullName);
    $('#userInfoAge').text(thisUserObject.age);
    console.log(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    console.log(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
    $('#userInfoId').text(thisUserObject._id);
};

/* addUser function */
function addUser(event){
    event.preventDefault();

    // super basic validation, increase error count var if any fields are bland
    var errorCount = 0;
    $('#newUserForm input').each(function(index,val){
        if ($(this).val() === ''){
            errorCount++;
        }
    });
    //console.log("errorCount: "+errorCount);

    // check that errorCount is still at 0
    if (errorCount === 0){
        // if it is compile all user info into one object
        // console.log("errorCount does equal 0");
        var newUser = {
            'userName':$('#newUserForm input#inputUserName').val(),
            'email':$('#newUserForm input#inputUserEmail').val(),
            'fullName':$('#newUserForm input#inputUserFullName').val(),
            'age':$('#newUserForm input#inputUserAge').val(),
            'location':$('#newUserForm input#inputUserLocation').val(),
            'gender':$('#newUserForm input#inputUserGender').val()
        }
        // console.log("newUser: "+newUser.email);

        // use AJAX to POST the object to our add user service
        $.ajax({
            url: '/users/insertuser',
                type: 'POST',
                data: newUser,
        }).done(function(response) {
            // check for successful blank response
            if (response.msg === ''){
                // clear the form inputs
                $('#newUserForm input').val('');
                //update the table
                populateTable();
            }
            else{
                // if something goes wrong alert error msg that our service returned
                alert("error: "+response.msg);
            }
        });
    }
    else{
        // if error count > 0, error out
        alert("Please fill in all fields");
        return false;
    }
};

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
