Posts = new Meteor.Collection('posts');


  Meteor.startup(function () {
    // code to run on server at startup
  });  


  Meteor.publish("posts", function(category_name) {
  		check(category_name, String);
        return Posts.find({postCategory: category_name});
  });


  //ALLOW INSERTS TO POST BY AUTH-CHECK
  Posts.allow({
    'insert': function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    }
  });

  Meteor.users.allow({
    remove: function (userId, doc) {
    // can only remove your own documents
    return true;
    }
  });

