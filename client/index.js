
Meteor.startup(function() {
    Session.set("currentCategory", "none");
	Session.set("subCategoryFilter", "all types"); 
	Session.set('currentCategory', 'none');
	Session.set("categoryTemplateRendered", false);
});

Meteor.autorun(function() {


});


Meteor.Router.add({
    '/': function(){
    	Session.set('currentCategory', 'none');
    	//Loads and renders the home page template.
    	renderWelcomeTemplate();
    	//SETS CATEGORY TEMPLATE TO UNRENDERED SO IT RUNS ONCE CLICKED AGAIN
    	Session.set("subCategoryFilter", "all types"); 
    },

    '/housing': function() {
      	Session.set('currentCategory', 'housing');
      	renderCategoryTemplate();
  	},
	'/jobs': function() {
      	Session.set('currentCategory', 'jobs');
      	renderCategoryTemplate();
  	},
    '/people': function() {
      	Session.set('currentCategory', 'people');
      	renderCategoryTemplate();
  	},
  	'*': 'not_found'
})


Template.welcomeScreen.events({

	//Listens for the clicking of any of the categories and triggers the appropriate page.
	'click .category' : function () {
	  // template data, if any, is available in 'this'
	  if (typeof console !== 'undefined')
	    
	    var idName = $(event.target).attr('id');

		if(idName == "housing"){
			Session.set("currentCategory", "housing");
			Meteor.Router.to('/housing');
		}else if(idName == "jobs"){
			Session.set("currentCategory", "jobs");
			Meteor.Router.to('/jobs'); 
		}else if(idName == "people"){
			Session.set("currentCategory", "people");
			Meteor.Router.to('/people'); 
		}
	}
});

function renderCategoryTemplate(){
    var postingsTemplate = Meteor.render( function() {
        return Template[ 'categoryTemplate' ]();
    })
    $('body').html( postingsTemplate );
}

function renderWelcomeTemplate(){
  	// template data, if any, is available in 'this'
  	if (typeof console !== 'undefined'){
    	var home = Meteor.render( function() {
	        return Template[ 'welcomeScreen' ]();
	    })
    }
    $('body').html( home );
}


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



