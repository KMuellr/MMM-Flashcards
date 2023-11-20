/* Magic Mirror
 * Module: MMM-Flashcards
 *
 * By Hua KRUNG
 */
Module.register("MMM-Flashcards", {

	// Module config defaults.
	defaults: {
		header: "MMM-Flashcards",
		fadeSpeed: 1000,
		nbBuckets: 4,
		step: 3,
		topics: [
			{
				name: "Learning addition",
				cards: [
					{
						question: "1 + 1",
						answer: "2"
					},
					{
						question: "2 + 2",
						answer: "4"
					},

				]
			},

			{
				name: "French vocabulary",
				cards: [
					{
						question: "Apple",
						answer: "Pomme"
					},
					{
						question: "To learn",
						answer: "Apprendre"
					},
					{
						question: "Vocabulary",
						answer: "Vocabulaire"
					},

				]
			},
		],

	},
	keyBindings: {
		enabled: true,
		mode: "DEFAULT",
		map: {
			correct: "ArrowRight",
			wrong: "ArrowLeft",
			flip: "Home",
			prefTopic: "ArrowUp",
			nextTopic: "ArrowDown",
		}
	},
	settings:{},
	allNames:[],
	collection:"",
	flashcard:{question:"",answer:""},
	showAnswer:false,

	getStyles: function () {
		return ["MMM-Flashcards.css", "font-awesome.css"];
	},

	getHeader: function() {
		return this.config.header;
	},

	validButtonPress: function(button) {
		if (button === "CORRECT") {
			this.correctAnswer();
		} else if (button === "WRONG") {
			this.wrongAnswer();
		} else if (button == "FLIP"){
			this.showAnswer = !this.showAnswer;
			this.updateDom();
		} // else if (kp.keyName == this.keyHandler.config.map.prefTopic){
		// 	this.prefTopic();
		// } else if (kp.keyName == this.keyHandler.config.map.nextTopic){
		// 	this.nextTopic();
		// }
	},

	correctAnswer: function(){
		this.sendSocketNotification("FLASHCARDS_CORRECT",{});
	},

	wrongAnswer: function(){
		this.sendSocketNotification("FLASHCARDS_WRONG",{});
	},

	prefTopic: function(){
		this.sendSocketNotification("FLASHCARDS_PREVCOLLECTION",{});
	},
	nextTopic: function(){
		this.sendSocketNotification("FLASHCARDS_NEXTCOLLECTION",{});
	},

	// Define start sequence.
	start: function() {
		var self = this;
		this.settings.nbBuckets = this.config.nbBuckets;
		this.settings.step = this.config.step;
		this.settings.topics = this.config.topics;
		this.settings.collections = this.config.collections;
		this.sendSocketNotification("FLASHCARDS_INIT",this.settings);
	},

	// Override dom generator.
	getDom: function() {
		var container = document.createElement("div");
		container.className = "flashcard";
		var headerC = document.createElement("div");
		headerC.className = "collection";
		var header = document.createElement("p");
		header.appendChild(document.createTextNode(this.collection));
		headerC.appendChild(header);
		container.appendChild(headerC);

		var flashcard = document.createElement("div");
		flashcard.setAttribute("id","myFlashcard");
		//		flashcard.className="flip-card";
		flashcard.className=this.showAnswer?"flip-container flip":"flip-container";
		var inner = document.createElement("div");
		//inner.className="flip-card-inner";
		inner.className="flipper";
		var front = document.createElement("div");
		front.className = "front";
		var back = document.createElement("div");
		//back.className = "flip-card-back";
		back.className = "back";

		var frontIcon = document.createElement("i");
		frontIcon.className = "fas fa-question-circle";
		var question = document.createElement("p");
		question.appendChild(document.createTextNode(this.flashcard.question));
		front.appendChild(frontIcon);
		front.appendChild(question);

		var backIcon = document.createElement("i");
		backIcon.className = "fas fa-search";
		var answer = document.createElement("p");
		answer.appendChild(document.createTextNode(this.flashcard.answer));
		back.appendChild(backIcon);
		back.appendChild(answer);

		inner.appendChild(front);
		inner.appendChild(back);
		flashcard.appendChild(inner);

		container.appendChild(flashcard);

		return container;
	},

	socketNotificationReceived: function(notification, payload) {
		if(notification === "FLASHCARDS_NEW"){
			this.flashcard = payload;
			this.showAnswer = false;
			this.updateDom(self.config.fadeSpeed);
		} else if(notification === "FLASHCARDS_COLLLECTION_LOADED"){
			this.collection = payload;
			this.showAnswer = false;
			this.updateDom(self.config.fadeSpeed);
		}
	},

	notificationReceived: function(notification, payload){
		// For all notifications, check if it is a button press and what to do
		if (notification === 'FLASHCARDS_BUTTON') {
			this.validButtonPress(payload);
		}
	},

});
