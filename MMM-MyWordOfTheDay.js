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

  getDom: function() {

    var wrapper = document.createElement("div");    

    if (this.loading) {
      var loading = document.createElement("div");
      loading.innerHTML = this.translate("LOADING");
      loading.className = "dimmed light small";
      wrapper.appendChild(loading);
      return wrapper;
    }

    console.log(JSON.stringify(this.wordData));

    var word = document.createElement("div");
    word.classList.add("word");
    word.innerHTML = this.wordData.word;
    wrapper.appendChild(word);

    if (this.wordData.pronounciation) {
      var pronKey = document.createElement("div");
      pronKey.classList.add("pronouciation");
      pronKey.innerHTML = this.wordData.pronounciation;
      wrapper.appendChild(pronKey);
    } 

    var definition = document.createElement("div");
    definition.classList.add("definition");

    var partOfSpeech = document.createElement("span");
    partOfSpeech.classList.add("part-of-speech");
    partOfSpeech.innerHTML = this.wordData.definition.partOfSpeech;
    definition.appendChild(partOfSpeech);

    var definitionText = document.createElement("span");
    definitionText.classList.add("definition-text");
    definitionText.innerHTML = this.wordData.definition.text;
    definition.appendChild(definitionText);

    wrapper.appendChild(definition);

    if (this.wordData.note) {
      var note = document.createElement("div");
      note.classList.add("note");
      note.innerHTML = this.wordData.note;
      wrapper.appendChild(note);
    }

    return wrapper;

  },


});