Template.userSettings.events({

	'change .radio' : function(){
		console.log(event.target.parentNode);
	}

	/*var radios = document.forms["userOptionRadios"];
	for(var i = 0, max = radios.length; i < max; i++) {
	    radios[i].onclick = function() {
	        alert(this.value);
	    }
	}*/

})

Template.userSettings.addUserCategories = function(){
	var profile = Meteor.user().profile;
	/*for(var i = 0, max = profile.length; i < max; i++) {

	}

	$(profile).each(function( index ) {
		var profContent = $( this );

  		$(profContent).each(function( index ) {
  			console.log(index+': '+$(this));
  		});
	});

	*/


	var data = traverse(profile);
    //console.log("ids", data);
}

function traverse(obj) {
	console.log(obj);
    var ids = [];
    for (var prop in obj) {
    	//console.log("obj: "+obj);
    	//console.log("prop: "+prop);
    	//console.log("contents: "+obj[prop]);
        if (typeof obj[prop] == "object" && obj[prop]) {
            if (prop == 'categories') {
            	var categories = obj[prop];
            	//console.log(obj[prop][0].housing[0].house);
            	for (var i = 0; i < categories.length; i++) {
            		//console.log("ARRAY: "+categories[i]);
            		var category = categories[i];

            		if(category.housing){
            			console.log("HOUSING: "+category.housing[0].house[0]);
            			var haveHouse = category.housing[0].house[0].have;
            			var needHouse = category.housing[0].house[1].need;
            			var haveCouch = category.housing[1].couch[0].have;
            			var needCouch = category.housing[1].couch[1].need;
            			console.log("HOUSE, HAVE:"+haveHouse+" NEED:"+needHouse);
            		}else if(category.jobs){
            			//console.log("JOBS: "+category.jobs);
            		}else if(category.people){
            			//console.log("PEOPLE: "+category.people);
            		}

            	};

                ids = obj[prop].map(function(elem){
                   return elem.id;
               })
            }
            ids =ids.concat(traverse(obj[prop]));
        }
    }
    return ids;
}

function parseCategories(obj) {

	for(var prop in obj){
    	//console.log("obj: "+obj);
    	//console.log("prop: "+prop);
    	//console.log("contents: "+obj[prop]);

		if (typeof obj[prop] == "object" && obj[prop]) {
		}


	}



}
