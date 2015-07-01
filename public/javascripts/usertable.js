// Userlist data array for filling in info box
var userListData = [];

// DOM ready
$(document).ready(function(){
    // populate user table on initial page load
    populateTable();

    // username link click
    $('#usertable tbody').on('click', 'td a.linkshowuser', showUserInfo);
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
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
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
        return arrayItem.username;
    }).indexOf(thisUserName);




    // get our user object
    var thisUserObject = userListData[arrayPosition];

    // populate info box
    $('#userInfoName').text(thisUserObject.fullname);
    console.log(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    console.log(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    console.log(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
};
