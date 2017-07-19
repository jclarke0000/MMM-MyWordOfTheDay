/* Magic Mirror
 * Module: MMM-MyWordofTheDay
 *
 * By Dominic Marx
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({

  start: function() {

  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "GET_WORD") {
      this.getWord(payload);
    }
  },

  getWord: function(apiKey) {

    var self = this;
    var WoD_URL = "http://api.wordnik.com:80/v4/words.json/wordOfTheDay?api_key=" + apiKey;

    request(WoD_URL, function (error, response, body) {

      if (!error && response.statusCode == 200) {

        var wordnikJSON = JSON.parse(body);
        var wordData = new Object({
          word: wordnikJSON.word,
          definition: wordnikJSON.definitions[0], //just take the first definition
        });

        if (wordnikJSON.note) {
          wordData.note = wordnikJSON.note;
        } 


        //try and get pronunciation key
        var pronounciationKeyURL = "http://api.wordnik.com:80/v4/word.json/" + wordnikJSON.word + "/pronunciations?useCanonical=false&limit=50&api_key=" + apiKey;

        request(pronounciationKeyURL, function(error2, response2, body2) {

          if (!error2 && response2.statusCode == 200) {

            var pronKey = JSON.parse(body2);
            if (pronKey.length > 0) {
              wordData.pronounciation = pronKey[0].raw;
            }
          } else {
            console.log("[MMM-MyWordOfTheDay] **ERROR getting Pronounciation Key ** : " + error2);
          }

          // console.log(JSON.stringify(wordData));


          self.sendSocketNotification("WORD_UP", wordData);

        });



      } else {
          console.log("[MMM-MyWordOfTheDay] **ERROR getting Word of the Day ** : " + error);
      }


    });
  }



});