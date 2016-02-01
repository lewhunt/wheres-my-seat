// Copyright (c) 2016 Lewis Hunt

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RabbitSitter is the main JavaScript object for the 'Where's My Seat' educational game.
// A namespace module pattern is used to safely encaptulate the JavaScript code
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var RabbitSitter = RabbitSitter || {};

RabbitSitter = (function () { 

	var rowsArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
	
	var seatsPerRowCount = 10;
	
	var currentTicket = "";
	
	var score = 0;
	
	// vars for animation classes and transition event names
	var animEndPrefixes = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
	var animTicketEntrance = "bounceInLeft";
	var animRabbitEntrance = "bounceInLeft";
	var animMessageEntrance = "bounceInLeft";
	var animTicketMatch = "zoomOutUp";
	var animRabbitMatch = "zoomOutUp";
	var animRabbitNoMatch = "shake";
	var animTicketPulse = "pulse infinite";
	var animMessageFadeIn = "fadeIn";
	var animMessageUpdate = "tada";
	var animMessageFlash = "flash";
	var animMessageMatch = "fadeOutUp";
	var animScoreUpdate = "tada";


	////////////////////////////////////////////////////////////////////////////////////////////////////
	// main init function gets called when HTML page is fully loaded
	////////////////////////////////////////////////////////////////////////////////////////////////////
		
	var init = function () {

			createSeating();
		
			generateRandomTicket();
		
			checkSelection();	

	};
	

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// generateRandomTicket creates a new random ticket id from remaining available seats and kicks off entrance animations
	////////////////////////////////////////////////////////////////////////////////////////////////////
		
	var generateRandomTicket = function () {
		
	
		$.fn.random = function() {
		  return this.eq(Math.floor(Math.random() * this.length));
		}          

		currentTicket = $('.available').random().attr('id');	
		
		$('.ticket div').text(currentTicket);
				
		animateRabbit(animRabbitEntrance);
	
		animateTicket(animTicketEntrance);	
				
	};
	

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// createSeating constructs all the div seats for the game based on A-Z rowsArray and seatsPerRowCount
	////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var createSeating = function () {

		var seatsArray = [];
	
		for ( var i = 0; i < rowsArray.length; i++) {

			for (var j = 1; j <= seatsPerRowCount; j++){
				
				if ( j === 1) {
					var rowLabel = "<div class='row-label' id='" + rowsArray[i] + "'>" + rowsArray[i] + "</div>";
					seatsArray.push(rowLabel);
				}
				
				var seatDiv = "<div class='seat available' id='" + rowsArray[i] + j + "'>" + j + "</div>";
				seatsArray.push(seatDiv);

				 if ( j === seatsPerRowCount){
				 	var newRowBreak = "<br>";
					seatsArray.push(newRowBreak);  
			 	}
	 
			}  
		}

		$('#seats-container').html(seatsArray);

	};
	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// completeMatchedSeat is called at the end of a successful match and then calls a new random ticket
	////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var completeMatchedSeat = function(matchedSeat) {
			
		$( matchedSeat ).addClass( "taken" );
		
		$( matchedSeat ).text('\u25CF');
		
		$('.message').html('');
		$('.message').removeClass(animMessageMatch);	
		
		generateRandomTicket();
		
	};
	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// animateRabbit handles animations and completed animations for the rabbit
	////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var animateRabbit = function (animClassName, matchedSeat) {
	
		$('.rabbit').addClass(animClassName).one(animEndPrefixes, function(){
			
			$(this).removeClass(animClassName);
						
			if (matchedSeat) {
				
				completeMatchedSeat(matchedSeat);
			}	
			if (animClassName===animRabbitNoMatch) {
				animateMessage(animMessageFlash, "Try another seat");	
			}
									
		});
	};
	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// animateTicket handles animations and completed animations for the ticket
	////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var animateTicket = function (animClassName) {
	
		$('.ticket').addClass(animClassName).one(animEndPrefixes, function(){
			
			$(this).removeClass(animClassName);	
			
			if (animClassName==animTicketEntrance) {

				animateMessage(animMessageFadeIn, "Pick the correct seat");
				animateTicket(animTicketPulse);
			}		
		});
	};
	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// animateMessage handles animations and completed animations for the message text
	////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var animateMessage = function (animClassName, messageString) {
	
		$('.message').html(messageString);
	
		$('.message').addClass(animClassName).one(animEndPrefixes, function(){
			
			$(this).removeClass(animClassName);	
				
		});
	};


	////////////////////////////////////////////////////////////////////////////////////////////////////
	// animateUpdateScore updates score and handles animations/completed animations for the score text
	////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var animateUpdateScore = function(animClassName, matchedSeat) {
	
		score = score + 1;
		
		$('.score div').html(score);
		
		$('.score').addClass(animClassName).one(animEndPrefixes, function(){
			
			$(this).removeClass(animClassName);
			
			animateTicket(animTicketMatch);
			
			animateRabbit(animRabbitMatch, matchedSeat);
			
			animateMessage(animMessageMatch, "Well done!");		
		});
		
	};
	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// checkSelection sets up the seat click event handlers and checks for a matching clicked seat + ticket
	////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var checkSelection = function () {
		
		$('.seat').on('click',function(){ 
	
			if ($(this).hasClass( "available" )){
						
				if ($(this).attr('id') == currentTicket) {
				
					animateMessage(animMessageUpdate, "Well done!");
				
					$( this ).removeClass( "available hovering" );
					
					if ($('.ticket').hasClass(animTicketPulse)) $('.ticket').removeClass(animTicketPulse);

					animateUpdateScore(animScoreUpdate, this);
										
				}
				
				else {
					animateRabbit(animRabbitNoMatch);		
				}

			}

		});

		$('.seat').mouseenter(function(){   
	
			if ($(this).hasClass( "available" )){
		  
				$( this ).addClass( "hovering" );
		
			}
		
		});

		$('.seat').mouseleave(function(){ 
		   
			$( this ).removeClass( "hovering" );

		});
		
	
	};

	
	// expose init as public because it's called from the HTML page
	return {
		init: init
	};

})();