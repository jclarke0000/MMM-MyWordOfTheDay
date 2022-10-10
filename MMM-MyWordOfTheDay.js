/*********************************

  Magic Mirror Module: 
  MMM-MyWordOfTheDay
  https://github.com/jclarke0000/MMM-MyWordOfTheDay

  By Jeff Clarke
  MIT Licensed
 
*********************************/

Module.register("MMM-MyWordOfTheDay",{

  // Define required styles.
  getStyles: function () {
    return ["MMM-MyWordOfTheDay.css"];
  },

  getTemplate: function () {
    return "mmm-my-word-of-the-day.njk";
  },

  /*
    Data object provided to the Nunjucks template. The template does not
    do any data minipulation; the strings provided here are displayed as-is.
    The only logic in the template are conditional blocks that determine if
    a certain section should be displayed, and simple loops for the hourly
    and daily forecast.
   */
  getTemplateData: function () {
    return {
      phrases: {
        loading: this.translate("LOADING")
      },
      loading: this.loading,
      wordData: this.wordData,
      scrabbleScore: this.wordData ? this.getScrabbleScore(this.wordData.word) : 0
    };
  },


  start: function() {
    this.loading = true;
    this.lastDate = null;
    this.wordData = null;

    this.sendSocketNotification("GET_WORD", this.config.apiKey);

    var self = this;
    setInterval(function() {
      self.sendSocketNotification("GET_WORD", self.config.apiKey);
    }, 60 * 60 * 1000); //update once an hour
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "WORD_UP") {
      this.loading = false;
      this.wordData = payload;
      this.updateDom(2000);
    }
  },

  getScrabbleScore: function(word) {
    const pointsTable = {
      "A" : 1,
      "B" : 3,
      "C" : 3,
      "D" : 2,
      "E" : 1,
      "F" : 4,
      "G" : 2,
      "H" : 4,
      "I" : 1,
      "J" : 8,
      "K" : 5,
      "L" : 1,
      "M" : 3,
      "N" : 1,
      "O" : 1,
      "P" : 3,
      "Q" : 10,
      "R" : 1,
      "S" : 1,
      "T" : 1,
      "U" : 1,
      "V" : 4,
      "W" : 4,
      "X" : 8,
      "Y" : 4,
      "Z" : 10
    }

    var score = 0;
    for (var i = 0; i < word.length; i++) {
      score = score + pointsTable[word.charAt(i).toUpperCase()];
    }

    return score;
  }


});