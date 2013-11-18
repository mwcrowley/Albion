var housingPostTemplate = "housingPostTemplate";
var homeTemplate = 'welcomeScreen';
var categoryTemplateRendered = false;
var newPostTemplate; 

Posts = new Meteor.Collection("posts");

Deps.autorun(function () {
  Meteor.subscribe("posts", {postCategory: Session.get("currentCategory")} );

  if(Session.equals("currentCategory", "housing")){
  	//newPostTemplate = $('.new-post-object');
  	console.log("CURRENT CATEGORY SET TO HOUSING");
  }
});



Template.categoryTemplate.events({
	'click .small-logo' : function () {
	  // template data, if any, is available in 'this'
	  if (typeof console !== 'undefined')
	    var home = Meteor.render( function() {
	        return Template[ homeTemplate ]();
	    })
	    $('.content-container').html( home );
	},

	'click .postSearch': function() {
		console.log("LOOKING FOR");
		createNewSearchPost();
	},

	'click .postAvailable': function() {
		console.log("AVAILABLE FOR");
		createNewAvailablePost();
	}, 
});

Template.categoryTemplate.rendered = function(){
	if(!categoryTemplateRendered){
		queryDataBaseForCategoryPosts();
		console.log("rendered");
	}
	categoryTemplateRendered = true;
}

function queryDataBaseForCategoryPosts(){

	console.log("In QueryDB Function");
	var categoryPosts = Posts.find({postCategory:Session.get("currentCategory")});
	var postArray = categoryPosts.fetch();
	console.log(postArray);

	//Takes the received array and renders the individual (visible) posts
	var rederedPosts = renderCategoryPosts(postArray);
}


/**Takes the returned DB array of post objects and 
** and then parses them and posts each one
** individually as a media object
**/
function renderCategoryPosts(postArray){
	$('.post-container').empty();
	for (var i = 0; i < postArray.length; i++) {
		console.log(postArray[i]);
		if(postArray[i].postVisible && postArray[i].postTitle){
			console.log("post #"+i+" is visible");
			if (typeof console !== 'undefined'){
			    var postObject = Meteor.render( function() {
			        return Template[ housingPostTemplate ]({
			        	posterName: postArray[i].posterID, 
			         	postTitle: postArray[i].postTitle,
			         	postContent: postArray[i].postContent,
			         	postTime: postArray[i].postTime,
		         	});
			    })
			   $('.post-container').prepend( postObject );
			}
		}
	}
}


/********** ADDDING A POST **************/

function createNewSearchPost(){
	$('.new-post-object').show();
}

//Add the blank search post template to the top of the post list
function addSearchPostTemplate(){

	if (typeof console !== 'undefined'){
	    var searchPost = Meteor.render( function() {
	        return Template[ 'searchPostInputTemplate' ]();
	    })
	    console.log(searchPost);
	    $('.post-container').prepend( searchPost );
	}
}

Template.searchPostInputTemplate.events({
	'click .publish-post' : function(){
		var newPostInfo = $(event.target).parent().siblings("form");
		savePostToDB(newPostInfo);
		queryDataBaseForCategoryPosts();
	},
	'click .cancel-post' : function(){
		$(event.target).parent().siblings("form")[0].reset();
		$(event.target).parent().parent().hide();
	}

})

//Takes a given form and parses it into something that can be saved to the DB
function savePostToDB(postInfo){
    var form={};
    console.log("PRINTING SERIALIZED ARRAY");
    var fields = $(postInfo).serializeArray();

    $.each(postInfo.serializeArray(), function() {
        form[this.name] = this.value;
    });

    form["postCategory"] = Session.get("currentCategory");
    form["posterID"] = Meteor.userId();
    form["postTime"] = $.now();
    form["postVisible"] = true;

    console.log(form);

    Posts.insert(form, function(err) {
        if(!err) {
            $(postInfo)[0].reset();
            $(postInfo).parent().hide();
        }
        else
        {
            alert("Something is wrong");
            console.log(err);
        }
    });
}


function createNewAvailablePost(){

	
}