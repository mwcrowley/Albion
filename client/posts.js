var housingPostTemplate = "housingPostTemplate";
var homeTemplate = 'welcomeScreen';
var newPostHousingSubCategories = "newPostHousingSubCategories";
var categoryTemplateRendered = false;
var newPostTemplate; 
var subCatButtonTemplate = "subCategoryButton";

Posts = new Meteor.Collection("posts");

Deps.autorun(function () {
  Meteor.subscribe("posts", {postCategory: Session.get("currentCategory")} );
  Session.set("subCategoryFilter", "all types"); 

  if(Session.equals("currentCategory", "housing")){
  	console.log("CURRENT CATEGORY SET TO HOUSING");
  }else if(Session.equals("currentCategory", "jobs")){
  	console.log("CURRENT CATEGORY SET TO JOBS");
  }else if(Session.equals("currentCategory", "people")){
  	console.log("CURRENT CATEGORY SET TO PEOPLE");
  }
});



Template.categoryTemplate.events({
	'click .small-logo' : function () {
		Session.set("categoryTemplateRendered", false);
		Meteor.Router.to('/');
	},

	'click .postSearch': function() {
		console.log("LOOKING FOR");
		createNewSearchPost();
	},

	'click .sub-cat-button': function(){
		Session.set("subCategoryFilter", $(event.target).text());
		queryDataBaseForCategoryPosts(Session.get("subCategoryFilter"));
	}
});


//SETS THE HEADER LOGO TO DISPLAY WHICHEVER CATEGORY YOU SELECTED
Template.categoryTemplate.category = function(){
	var categoryHeader = Session.get("currentCategory");
	return categoryHeader;
}

//THIS IS TRIGGERED ONCE THE POST SCREEN IS RENDERED
Template.categoryTemplate.rendered = function(){
	var renderState = Session.get('categoryTemplateRendered');
	if(!renderState){
		queryDataBaseForCategoryPosts();
		setSubCategoryButtons();
	}
	Session.set("categoryTemplateRendered", true);
}

function setSubCategoryButtons(){

	var housingSubCategories = new Array(4);
		housingSubCategories[0] = "all types";
		housingSubCategories[1] = "couch";
		housingSubCategories[2] = "home";
		housingSubCategories[3] = "roommate";

	//IF THE CATEGORY IS HOUSING GENERATE THE HOUSING SUBCAT BUTTONS
	if(Session.equals("housing")){
		generateSubCatButtons(housingSubCategories);
		
	}
}

function generateSubCatButtons(subCats){
	for (var i = subCats.length - 1; i >= 0; i--) {
		var subCategory = subCats[i];
	
		if (typeof console !== 'undefined'){
		    var subCatButton = Meteor.render( function() {
		        return Template[ subCatButtonTemplate ]({
		        	subCat: subCategory,
		        });
		    });
		   $('.sub-cat-buttons').append(subCatButton);
		}
	};

}

/** GIVEN A SUBCATEGORY THE SYSTEM WILL SEARCH FOR ALL POSTS
** UNDER THAT SUBCATEGORY AND RETURN A CURSOR CONTAINING
** ALL POST OBJECTS THAT FIT THE CRITERIA
**/
function queryDataBaseForCategoryPosts(subCategories){

	//Finds all posts that are 
	var categoryPosts = Posts.find({
		postCategory:Session.get("currentCategory")
	});

	var postArray = new Array();
	
	categoryPosts.forEach(function (post) {

		//IF THE VIEW IS SET TO SEE ALL CATEGORY POSTS IT TAKES ALL POSTS AND PUTS IN ARRAY
		if(Session.equals("subCategoryFilter", "all types")){
			postArray.push(post);
		}else{
			var catToMatch = Session.get("subCategoryFilter");
			if(post.postSubCategory == catToMatch){
				postArray.push(post);
			}
		}
	});
	//Takes the received array and renders the individual (visible) posts
	var rederedPosts = renderCategoryPosts(postArray);
}

//Takes a given ID number and queries the DB for a username. 
function queryUserNameWithID(idNumber){
	var fetchedUser = Meteor.users.findOne({_id:idNumber});
	var userName = "";
	if(fetchedUser){
		userName = fetchedUser.services.facebook;
	}
	return userName;
}

//Takes the posted timestamp and parses to date (dd/mm)
function getPostTime(timestamp){
	var timeString = "";

	var postTime = new Date(timestamp);
	var day = postTime.getDay().toString();
	var month = postTime.getMonth().toString();

	var weekday=new Array(7);
		weekday[0]="Sunday";
		weekday[1]="Monday";
		weekday[2]="Tuesday";
		weekday[3]="Wednesday";
		weekday[4]="Thursday";
		weekday[5]="Friday";
		weekday[6]="Saturday";

	var monthNames = [ " January", " February", " March", " April", " May", " June",
    " July", " August", " September", " October", " November", " December" ];

	var dayOfWeek = weekday[postTime.getDay()];
	timeString = dayOfWeek.concat(monthNames[month]," " ,day);
	return timeString;
}

/**Takes the returned DB array of post objects and 
** and then parses them and posts each one
** individually as a media object
**/
function renderCategoryPosts(postArray){
	$('.post-container').empty();
	for (var i = 0; i < postArray.length; i++) {
		//console.log(postArray[i]);
		if(postArray[i].postVisible && postArray[i].postTitle){
			//console.log("post #"+i+" is visible");
			if (typeof console !== 'undefined'){

				var facebookProfile = queryUserNameWithID(postArray[i].posterID);

			    var postObject = Meteor.render( function() {
			        return Template[ housingPostTemplate ]({
			        	posterName: facebookProfile.name, 
			         	postTitle: postArray[i].postTitle,
			         	postContent: postArray[i].postContent,
			         	postLocation: postArray[i].postLocation,
			         	postTime: getPostTime(postArray[i].postTime),
			         	posterImage: facebookProfile.username
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
		closeNewPostObject();
	}
})

Template.searchPostInputTemplate.posterName = function(){
	var userName = "USER NAME";
	return userName;
}



Template.newPostHousingSubCategories.events({
	'click .subcategory-chooser': function(){
		var subcategoryID = event.target.id;

		Session.set("postSubcategory", subcategoryID);
		var subcategoryPostTemplate = "";
		//Empties the media body for insertion of appropriate form.

		if(Session.equals("postSubcategory", "roommate")){
			console.log("roommate");
			subcategoryPostTemplate = "newPostHousingRoommateForm";
		}else if(Session.equals("postSubcategory", "couch")){
			console.log("couch");
			subcategoryPostTemplate = "newPostHousingRoommateForm";
		}else if(Session.equals("postSubcategory", "home")){
			console.log("home");
			subcategoryPostTemplate = "newPostHousingRoommateForm";
		}

		if (typeof console !== 'undefined'){
	    	var subCategoryForm = Meteor.render( function() {
	        	return Template[ subcategoryPostTemplate ]();
	    	})
	    	$(event.target).parent().replaceWith( subCategoryForm );
	    	$('.publish-post').css("visibility", "visible");
		}
	}
})

Template.newPostHousingRoommateForm.subCategory = function(){
	return Session.get("postSubcategory");
}


//Takes a given form and parses it into something that can be saved to the DB
function savePostToDB(postInfo){
    var form={};
    var fields = $(postInfo).serializeArray();

    $.each(postInfo.serializeArray(), function() {
        form[this.name] = this.value;
    });

    form["postCategory"] = Session.get("currentCategory");
    form["postSubCategory"] = Session.get("postSubcategory");
    form["posterID"] = Meteor.userId();
    form["postTime"] = $.now();
    form["postVisible"] = true;

    console.log(form);

    Posts.insert(form, function(err) {
        if(!err) {
        	//SUCCESSFUL POST!
			closeNewPostObject()
        }
        else
        {
            alert("Something is wrong");
            console.log(err);
        }
    });
}

function closeNewPostObject(){
	if (typeof console !== 'undefined'){
    	var subCategories = Meteor.render( function() {
    		if(Session.equals("currentCategory", "housing")){
        		return Template[ newPostHousingSubCategories ]();
        	}	
    	})
    	$('.new-post-object').children("form").replaceWith( subCategories );
	}
	$('.new-post-object').hide();
}