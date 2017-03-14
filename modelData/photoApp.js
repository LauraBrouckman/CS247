"use strict";
/* jshint node: true */
/*
 * Model data for CS142 Project #5 - the photo sharing site.
 * This module returns an object called cs142Models with the following functions:
 *
 * cs142Models.userListModel - A function that returns the list of users on the system. The
 * list is returned as an array of objects containing:
 *   id  (number) - The ID of the user.
 *   first_name (string) - The first name of the user.
 *   last_name (string) - The last name of the user.
 *   location (string) - The location of the user.
 *   description (string) - A brief user description.
 *   occupation (string) - The occupation of the user.
 *
 * cs142Models.userModel - A function that returns the info of the specified user. Called
 * with an user ID (id), the function returns n object containing:
 *   id  (number) - The ID of the user.
 *   first_name (string) - The first name of the user.
 *   last_name (string) - The last name of the user.
 *   location (string) - The location of the user.
 *   description (string) - A brief user description.
 *   occupation (string) - The occupation of the user.
 *
 * cs142Models.photoOfUserModel - A function that returns the photos belong to
 * the specified user. Called  with an user ID (id), the function returns n object containing:
 *   id  (number) - The ID of the photo
 *   date_time (date) - he date and time the picture was taken in ISO format.
 *   file_name (string) - The file name in the image directory of the picture.
 *   user {object} - The user info (see the userModel for format) of the picture's owner.
 *   comments: {array of objects} - An array of comment objects containing the properties:
 *        id  (number) - The ID of the comment.
 *        date_time (date) - The date the comment was made in ISO format.
 *        comment (string) - The text of the comment.
 *        user: {object} The user info (see userMode for format) who made the comment
 *        photo: {object} - The photo object of the comment.
 *
 */
(function() {
   // Create init users.

   var im = {id: 1, first_name: "Ian", last_name: "Malcolm", 
             bias_level: 0, profile_pic_file: "malcolm1.jpg", cover_pic_file: "default_cover_pic.jpg"};
   var er = {id: 2, first_name: "Ellen", last_name: "Ripley", 
            bias_level: 4, profile_pic_file: "ripley1.jpg", cover_pic_file: "default_cover_pic.jpg"};
   var pt = {id: 3, first_name: "Peregrin", last_name: "Took", 
             bias_level: 5, profile_pic_file: "took1.jpg", cover_pic_file: "default_cover_pic.jpg"};
   var rk = {id: 4, first_name: "Rey", last_name: "Kenobi", 
             bias_level: 6, profile_pic_file: "kenobi1.jpg", cover_pic_file: "default_cover_pic.jpg"};
   var al = {id: 5, first_name: "April", last_name: "Ludgate", 
             bias_level: 2, profile_pic_file: "ludgate1.jpg", cover_pic_file: "default_cover_pic.jpg"};
   var jo = {id: 6, first_name: "John", last_name: "Ousterhout",
             bias_level: 9, profile_pic_file: "ouster.jpg", cover_pic_file: "default_cover_pic.jpg"};

   var users = [im, er, pt, rk, al, jo];


   var post1 = {id: 1, article_pic_file: 'MSNBC_article.png', date_time: "2017-02-28 10:44:23", user: pt, comments: [], likes: [], 
               article_title: "Lawrence on Trump: Lies can be impeachable offense", article_source: "MSNBC.COM", article_subtitle: "Why he saya the president is in violation of his oath of office", 
               article_slant: 2, url: "http://www.msnbc.com/the-last-word/watch/lawrence-on-trump-lies-can-be-impeachable-offense-892649539938?cid=sm_npd_ms_fb_ma"};
   
   var post2 = {id: 2, article_pic_file: 'dailyCaller_article.jpg', date_time: "2017-03-1 1:44:23", user: im, comments: [], likes: [], 
               article_title: "Tim Kaine’s Son Arrested For Rioting Against Trump", article_source: "DAILYCALLER.COM", article_subtitle: "The youngest son of Hillary Clinton's running mate, Virginia Sen. Tim Kaine...",
               article_slant: -2, url: "http://dailycaller.com/2017/03/07/tim-kaines-son-arrested-for-rioting-against-trump/?utm_campaign=thedcmainpage&utm_source=Facebook&utm_medium=Social"}; 
   
   var post3 = {id: 3, article_pic_file: 'occupyDems_article.png', date_time: "2017-03-3 9:44:23", user: jo, comments: [], likes: [], 
               article_title: "Trump’s Women’s Day Tweet Just Blew Up In His Face", article_source: "OCCUPYDEMOCRATS.COM", article_subtitle: "Twitter is SAVAGING President Trump for his condescending hypocrisy.",
               article_slant: 2, url: "http://occupydemocrats.com/2017/03/08/trumps-womens-day-tweet-just-blew-face/"}; 

   var post4 = {id: 4, article_pic_file: 'breitbart_article.png', date_time: "2017-03-4 20:44:23", user: pt, comments: [], likes: [], 
               article_title: "American Hiring at Three-Year High in February", article_source: "BREITBART.COM", article_subtitle: "Trump Jobs Boom.",
               article_slant: -2, url: "http://www.breitbart.com/big-government/2017/03/08/american-hiring-at-three-year-high-in-february-under-trump-administration/?utm_source=facebook&utm_medium=social"}; 

   var post5 = {id: 5, article_pic_file: 'nyt_article1.png', date_time: "2017-03-5 12:44:23", user: al, comments: [], likes: [], 
               article_title: "A Girl Stands Firm on Wall Street", article_source: "NYT.COM", article_subtitle: "The Wall Street girl celebrates all the people who resisted by staying in place.",
               article_slant: 1, url: "https://www.nytimes.com/2017/03/08/opinion/little-girl-statue-wall-street-bull.html"}; 

   var post6 = {id: 6, article_pic_file: 'nyt_article2.png', date_time: "2017-03-6 7:44:23", user: al, comments: [], likes: [], 
               article_title: "No Wonder the Republicans Hid the Health Bill", article_source: "NYT.COM", article_subtitle: "Republican House leaders have spent months dodging questions about how they would replace the Affordable Care Act",
               article_slant: 1, url: "https://www.nytimes.com/2017/03/07/opinion/no-wonder-the-republicans-hid-the-health-bill.html"}; 

   var post7 = {id: 7, article_pic_file: 'fox_article1.png', date_time: "2017-03-1 2:44:23", user: er, comments: [], likes: [], 
               article_title: "I'm a Democrat and it's time for our party to apologize to America", article_source: "FOXNEWS.COM", article_subtitle: "Smart Democrats know that our position with the American people is just as weak.",
               article_slant: -1, url: "http://www.foxnews.com/opinion/2017/02/28/im-democrat-and-its-time-for-our-party-to-apologize-to-america.html"}; 

   var post8 = {id: 8, article_pic_file: 'fox_article2.png', date_time: "2017-03-2 13:44:23", user: er, comments: [], likes: [], 
               article_title: "Trump agency heads already rolling back Obama-era rules on their own", article_source: "FOXNEWS.COM", article_subtitle: "Interior Secretary Ryan Zinke was the latest to peel back red tape.",
               article_slant: -1, url: "http://www.foxnews.com/politics/2017/03/08/trump-agency-heads-already-rolling-back-obama-era-rules-on-their-own.html"}; 

   var post9 = {id: 9, article_pic_file: 'atlantic_article2.png', date_time: "2017-03-3 12:44:23", user: im, comments: [], likes: [], 
               article_title: "Is Israel's Travel Ban Comparable to Trump's?", article_source: "THEATLANTIC.COM", article_subtitle: "The Knesset passed a law that would deny entry to some foreign activists who support boycotting the Jewish state.",
               article_slant: 0, url: "https://www.theatlantic.com/international/archive/2017/03/israel-travel-ban-comparison-trump/518913/"}; 
   
   var post10 = {id: 10, article_pic_file: 'atlantic_article1.png', date_time: "2017-03-4 1:44:23", user: im, comments: [], likes: [], 
               article_title: "Can a Court Decision Help Close the Achievement Gap?", article_source: "THEATLANTIC.COM", article_subtitle: "The Kansas Supreme Court ordered the state to confront the inequality of its public-school funding.",
               article_slant: 0, url: "https://www.theatlantic.com/education/archive/2017/03/can-a-court-decision-help-close-the-achievement-gap/518859/"}; 


   var posts = [post1, post2, post3, post4, post5, post6, post7, post8, post9, post10];

   // Create initial photos.
   var photo1 = {id: 1, date_time: "2012-08-30 10:44:23", file_name: "ouster.jpg", user: jo};
   var photo2 = {id: 2, date_time: "2009-09-13 20:00:00", file_name: "malcolm2.jpg", user: im};
   var photo3 = {id: 3, date_time: "2009-09-13 20:05:03", file_name: "malcolm1.jpg", user: im};
   var photo4 = {id: 4, date_time: "2013-11-18 18:02:00", file_name: "ripley1.jpg", user: er};
   var photo5 = {id: 5, date_time: "2013-09-20 17:30:00", file_name: "ripley2.jpg", user: er};
   var photo6 = {id: 6, date_time: "2009-07-10 16:02:49", file_name: "kenobi1.jpg", user: rk};
   var photo7 = {id: 7, date_time: "2010-03-18 23:48:00", file_name: "kenobi2.jpg", user: rk};
   var photo8 = {id: 8, date_time: "2010-08-30 14:26:00", file_name: "kenobi3.jpg", user: rk};
   var photo9 = {id: 9, date_time: "2013-12-03 09:02:00", file_name: "took1.jpg", user: pt};
   var photo10 = {id: 10, date_time: "2013-12-03 09:03:00", file_name: "took2.jpg", user: pt};
   var photo11 = {id: 11, date_time: "2013-09-04 09:16:32", file_name: "ludgate1.jpg", user: al};
   var photo12 = {id: 12, date_time: "2008-10-16 17:12:28", file_name: "kenobi4.jpg", user: rk};

   var photos = [photo1, photo2, photo3, photo4, photo5, photo6, photo7,
      photo8, photo9, photo10, photo11, photo12];

   // Create initial comments.
   var comment1 = {
      id: 1,
      date_time: "2012-09-02 14:01:00",
      comment: "Learning new programming languages is hard... " + 
      "it's so easy to forget a </div>!", user: jo, photo: photo1
   };

   var comment2 = {
      id: 2,
      date_time: "2013-09-06 14:02:00",
      comment: "This is another comment, with a bit more text; " +
      "if the text gets long enough, does it wrap properly " +
      "from line to line?", user: jo, photo: photo1
   };

   var comment3 = {
      id: 3,
      date_time: "2013-09-08 14:06:00",
      comment: "If you see this text in <b>boldface</b> " +
      "then HTML escaping isn't working properly.", user: jo, photo: photo1
   };

   var comment4 = {
      id: 4,
      date_time: "2009-09-14 18:07:00",
      comment: "If there is one thing the history of evolution has" +
      " taught us it's that life will not be contained. Life breaks " +
      "free, it expands to new territories and crashes through " + 
      "barriers, painfully, maybe even dangerously, but, uh... well, " +
      "there it is. Life finds a way.", user: im, photo: photo2
   };

   var comment5 = {
      id: 5,
      date_time: "2013-11-28 17:45:13",
      comment: "Back from my trip. Did IQs just... drop sharply while I was " +
      "away?", user: er, photo: photo5
   };

   var comment6 = {
      id: 6,
      date_time: "2013-11-02 14:07:00",
      comment: "Hey Rey, great form. Love what " +
      "you do with the scavenged tech, got any tips?", user: er, photo: photo7
   };

   var comment7 = {
      id: 7,
      date_time: "2013-11-02 14:07:00",
      comment: "Definitely! I love your work! I'm away on a trip at " +
      "the moment, but let's meet up when I get back! :)", user: rk, photo: photo7
   };

   var comment8 = {
      id: 8,
      date_time: "2010-09-06 13:59:33",
      comment: "Made a new friend today! Well, they followed me " + 
      "home, anyway.", user: rk, photo: photo8
   };

   var comment9 = {
      id: 9,
      date_time: "2008-10-16 18:04:55",
      comment: "Wouldn't get anywhere without this beauty! " +
      "Completely built from scraps by hand, but she goes at top " +
      "speeds that'll rival any First Order piece of junk.", user: rk, photo: photo12
   };

   var comment10 = {
      id: 10,
      date_time: "2013-12-04 13:12:00",
      comment: "What do you mean you haven't heard of second " + 
      "breakfast?", user: pt, photo: photo10
   };

   var comment11 = {
      id: 11,
      date_time: "2013-09-04 10:14:32",
      comment: "Beautiful yet cold and aloof. Loner. Does not obey, " + 
      "occasionally chooses to cooperate. ", user: al, photo: photo11
   };
   
   var comment12 = {
      id: 12,
      date_time: "2016-01-04 2:00:01",
      comment: "Which one are you?", user: al, photo: photo9
   };
   
   var comment13 = {
      id: 13,
      date_time: "2016-01-04 2:04:01",
      comment: "The tall one.", user: pt, photo: photo9
   };
   
   var comments = [comment1, comment2, comment3, comment4, comment5, comment6, comment7, 
   comment8, comment9, comment10, comment11, comment12, comment13];

   comments.forEach(function (comment) {
      var photo = comment.photo;
      if (!photo.comments) {
         photo.comments = [];
      }
      photo.comments.push(comment);
   });

   var userListModel = function() {
      return users;
   };

   var userModel = function(userId) {
      for (var i = 0; i < users.length; i++) {
         if (users[i].id === userId) {
            return users[i];
         }
      }
      return null;
   };


   var postListModel = function() {
      return posts;
   }


   var photoOfUserModel = function(userId) {
      return photos.filter(function (photo) {
         return (photo.user.id === userId);
      });
   };

   var cs142models =  {
      userListModel: userListModel,
      userModel: userModel,
      photoOfUserModel: photoOfUserModel,
      postListModel: postListModel
   };

   if( typeof exports !== 'undefined' ) {
      // We're being loaded by the Node.js module loader ('require') so we use its
      // conventions of returning the object in exports.
      exports.cs142models = cs142models;
   } else {
      // We're not in the Note.js module loader so we assume we're being loaded
      // by the browser into the DOM.
      window.cs142models = cs142models;
   }
})();
