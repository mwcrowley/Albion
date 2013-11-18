 
//Upon logging in to Alby using facebook this adds the necessary variables for a given user
Accounts.onCreateUser(function(options, user) {

    var accountDetails = [
        {userActive: true},
        {categories:[
	        {housing: [
	        	{house: [
	          		{have: true},
	          		{need: true},
	      		]},
	      		{couch: [
	          		{have: true},
	          		{need: true},
	      		]},
	      		{roommate: [
	          		{have: true},
	          		{need: true},
	      		]},
	        ]},
	        {jobs: [
	        	{job: [
	          		{have: true},
	          		{need: true},
	      		]},
	      		{internship: [
	          		{have: true},
	          		{need: true},
	      		]},
	      		{coffee: [
	          		{have: true},
	          		{need: true},
	      		]},
	        ]},
	        {people: [
	        	{hangout: [
	          		{have: true},
	          		{need: true},
	      		]},
	      		{date: [
	          		{have: true},
	          		{need: true},
	      		]},
	        ]},
          ]},
          {status: [
          	{living: [
          		{city: "Denver"},
            	{state: "Colorado"},
            	{zip: "80209"},
            	{geoLoc: "123.31.15"},
      		]},
          	{visiting: [
          		{city: "Denver"},
            	{state: "Colorado"},
            	{zip: "80209"},
            	{geoLoc: "123.31.15"},
      		]},            
          ]},
          {posts: [

          ]},
      ]

      user.profile = accountDetails;

      return user;
});