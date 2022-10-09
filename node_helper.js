/* Magic Mirror
 * Module: MMM-MyWordofTheDay
 *
 * By Dominic Marx
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var axios = require("axios");

module.exports = NodeHelper.create({

  start: function() {

  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "GET_WORD") {
      this.getWord(payload);
    }
  },

  getWord: async function(apiKey) {

    var self = this;
    var WoD_URL = "http://api.wordnik.com:80/v4/words.json/wordOfTheDay?api_key=" + apiKey;

    axios.get(WoD_URL)
     .then( (response) => {

        var wordnikJSON = response.data;
        var wordData = new Object({
          word: wordnikJSON.word,
          definition: wordnikJSON.definitions[0], //just take the first definition
        });

        if (wordnikJSON.note) {
          wordData.note = wordnikJSON.note;
        } 

        //try and get pronunciation key
        var pronounciationKeyURL = "http://api.wordnik.com:80/v4/word.json/" + wordnikJSON.word + "/pronunciations?useCanonical=false&limit=50&api_key=" + apiKey;

        axios.get(pronounciationKeyURL)
          .then( (response2) => {

            var pronKey = response2.data;
            if (pronKey.length > 0) {
              wordData.pronounciation = pronKey[0].raw;
            }

          })
          .catch( (error2) => {
            console.log("[MMM-MyWordOfTheDay] **ERROR getting Pronounciation Key ** : " + error2);
          })
          .finally( () => {
            self.sendSocketNotification("WORD_UP", wordData);
          })

      })
      .catch( (error) => {
        console.log("[MMM-MyWordOfTheDay] **ERROR getting Word of the Day ** : " + error);      
      });
  },



});