var homeTemplate = 'welcomeScreen';
var categoryTemplate = 'categoryTemplate';
var postTemplate = 'postTemplate';

var userID;



Meteor.startup(function() {
    Session.set("currentCategory", "housing");
});

Meteor.autorun(function() {
  //var fbID = Meteor.user().services.facebook.id;
  //console.log("FBID="+fbID);

});



Template.welcomeScreen.events({
	'click .category' : function () {
	  // template data, if any, is available in 'this'
	  if (typeof console !== 'undefined')
	    
	    var idName = event.target.id;
	    console.log(idName);

	    var postingsTemplate = Meteor.render( function() {
	        return Template[ categoryTemplate ]();
	    })

	    $('.content-container').html( postingsTemplate );
	}
});



Template.userBar.userID = function(){
    var str = Meteor.userId();
    return str;
}
Template.userBar.facebookID = function(){

	var str = "loggedOut";
	if(Meteor.user()){
    	str = Meteor.user().services.facebook.first_name;
    }
    return str;
}
Template.userBar.numPosts = function(){
	var str = "loggedOut";
	if(Meteor.user()){
		//str = Posts.find({userID: Session.get("userID")}).count();
	}
    return str;
}  

Template.userBar.facebookHandle = function(){
	var username = "none";
	if(Meteor.user()){
		username = 	Meteor.user().services.facebook.username;
	}
	return username;
}

Template.userBar.events({
	'click .userLogout' : function () {
		Meteor.logout();
	}
});



