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

  getWord: function(apiKey) {

    var self = this;
    // var WoD_URL = "http://api.wordnik.com:80/v4/words.json/wordOfTheDay?api_key=" + apiKey;
    var WoD_URL = "https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=" + apiKey;

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

        if (wordnikJSON.examples && wordnikJSON.examples[0]) {
          wordData.example = wordnikJSON.examples[0].text;
        } 




        // try and get pronunciation key and hyphenation
        var pronDone = false;
        var hyphDone = false;

        const pronounciationKeyURL = "https://api.wordnik.com/v4/word.json/" + wordnikJSON.word + "/pronunciations?api_key=" + apiKey;

        axios.get(pronounciationKeyURL)
          .then( (r2)  => {

            var pronKey = r2.data;
            if (pronKey.length > 0) {
              wordData.pronounciation = pronKey[0].raw;
            }


          })
          .catch( (e2) => {
            //no pronunciation key available
            wordData.pronounciation = "";
          })
          .finally( () => {
            pronDone = true;

            if (hyphDone) {
              self.sendSocketNotification("WORD_UP", wordData);              
            }
            
          });

        
        const hyphenationURL = "https://api.wordnik.com/v4/word.json/" + wordnikJSON.word + "/hyphenation?api_key=" + apiKey;

        axios.get(hyphenationURL)
          .then( (r3)  => {

            var hyphenationText = "";
            r3.data.forEach( (syl) => {
              if (hyphenationText !== "") {
                hyphenationText = hyphenationText + "-";
              }
              if (syl.type && syl.type == "stress") {
                hyphenationText = hyphenationText + syl.text.toUpperCase();
              } else {
                hyphenationText = hyphenationText + syl.text.toLowerCase();
              }
            });
            wordData.hyphentation = hyphenationText;


          })
          .catch( (e3) => {
            //no hyphenation available
            wordData.hyphentation = "";
          })
          .finally( () => {
            hyphDone = true;

            if (pronDone) {
              self.sendSocketNotification("WORD_UP", wordData);              
            }

          });

      })
      .catch( (error) => {
        console.log("[MMM-MyWordOfTheDay] **ERROR getting Word of the Day ** : " + error);      
      });
  },



});