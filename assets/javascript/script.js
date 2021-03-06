console.log("main script.js connected")

var db = firebase.database(ssl);

$(document).ready(function() {
    var auth = sessionStorage.getItem("userid");
    console.log("Session uID:" + auth);

    db.ref("users/" + auth + "/groups").on("value", function(snapshot) {
        console.log("Groups:" + snapshot.val().split(","));
        snapshot.val().split(",").forEach(function(element) {
            displayGroup(element, element)
            displayGroupMembers(element);
        });
    });
});

function displayGroup(groupName, groupID) {
    var group = $("<div class='group-item' id='group-" + groupID + "'>");
    var form = $("<form class='input-field scale-transition scale-out' id='emailForm" + groupID + "'>");
    group.append($("<h3 class='center'>"));
    group.append($("<h5>").html(" <span id='member-count" + groupID + "'> </span>"));
    group.append($("<ul class='collection' id='member-list" + groupID + "'>"));
    group.append("<a class='waves-effect waves-light btn'><i class='material-icons left'>ac_unit</i>Start</a>");
    group.append("<a class='waves-effect waves-light btn emailbtn' data-target='emailForm" + groupID + "'><i class='material-icons left'>email</i>Add</a>");
    form.append("<input id='inviteEmail' type='email' class='validate' style='width:80%'>");
    form.append("<label for='inviteEmail'>Email</label>");
    form.append("<button id='inviteEmailButton' type='button' class='btn-floating btn-large right'><i class='material-icons'>arrow_forward</i></button>");
    $(".s6").append(group);
    $(".s6").append(form);

}

// displayGroup("Group One", 0);

$(document).click(function(event) {
    if ($(event.target).hasClass('emailbtn')) {
        var targetForm = $(event.target).attr("data-target");
        console.log(targetForm);
        $(document.getElementById(targetForm)).toggleClass("scale-out").toggleClass("scale-in");
    }
});

function displayGroupMembers(groupId) {
    $("#group-" + groupId + " > h3").text("Group " + groupId);
    console.log("start displaying " + groupId)
    db.ref("groups/" + groupId + "/followers").on("child_added", function(snapshot1) {
        console.log("Followers:" + snapshot1.val());

        db.ref("users/")
            .orderByChild("uniqueId")
            .equalTo(snapshot1.val())
            .on("child_added", function(snapshot) {
                $("#member-list" + groupId).append($("<li class='collection-item'>").text(snapshot.val().Name));
            });
        setTimeout(function() {
            updateMemberCount(groupId);
        }, 500);
    });
    //.equalTo("123").

    function updateMemberCount(groupID) {
        $("#member-count" + groupID).text("Secret Santas: " + $("#member-list" + groupID + " li").length);
    }


    //do not touch please
    //var member = $("<li class='collection-item'>").text(name);
}
