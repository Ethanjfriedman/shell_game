var game = {
  level: 1, //start off with the key game variables
  swapCount: 0,
  cards: [],
  numOfCards: 3,
  numOfSwaps: 5,
  guessedCard: false,
  swapDuration: 1000,

  ball: {
    cardNumber: 1
  },
  randNum: function() {
    return Math.floor(Math.random() * 3);
  },
  initialize: function() {
    var Card = function(num) {
      this.hasBall = false;
      this.position = num;
      this.cardNumber = num;
    };
    for (var i = 0; i < this.numOfCards; i++) {
      this.cards.push(new Card(i));
    }
    this.cards[1].hasBall = true;
    views.initalizeViews();
  },
  play: function() {
    this.setNumOfSwaps();
    this.setSwapTiming();
    views.ballView.hide();
    this.swap(this.randNum(),this.randNum());
  },
  setNumOfSwaps: function() {
    this.numOfSwaps = 4 + this.level;
  },
  setSwapTiming: function() {
    var $cards = $('.card');
    this.swapDuration = this.swapDuration * (1 + (this.level - 1) / 10)
    var duration = this.swapDuration + "ms";
    // var duration = '0.4s';
    $cards.css('transition-duration',duration);
},
  swap: function(card1, card2) {
    if (this.swapCount < this.numOfSwaps) {
      while (card1 == card2) {
        card1 = this.randNum();
      }
      this.cards[card1].position = card2;
      this.cards[card2].position = card1;
      this.sortCards(); //sorts the game.cards array by position. Otherwise multiple cards could have same position
      views.cardViews[card1].setAttrs();
      views.cardViews[card2].setAttrs();
      views.sortViews();//ditto for the views.cardViews.
      this.swapCount++
      setTimeout(function(){
        this.swap(this.randNum(),this.randNum());
      }.bind(this), this.swapDuration);
    }
    if (this.swapCount === this.numOfSwaps) {
      views.swapEnd();
    }
  },
  sortCards: function() {
    this.cards.sort(function(a,b) {
      return a.position - b.position;
    });
  }
};

var views = {
  cardViews: [],
  ballView: {
    ball: game.ball,
    hide: function() {
      $('#ball').addClass('hidden');
    },
    show: function() {
      $('#ball').removeClass('hidden');
      views.gameOver();
    },
    initialize: function() {
      var $ball = $('<p id="ball">');
      this.$el = $ball; // now ballView.$el is the one and only ball.
    },
  },
  CardView: function(num) { //creates a CardView constructor function
    this.card = game.cards[num];
    this.$el =  $('<div class="card">');
    this.setAttrs = function () {
      var card     = this.card,
          $card    = this.$el,
          position = card.position;
      switch(position) {
        case 0:
          $card.attr('id', 'left');
          break;
        case 1:
          $card.attr('id', 'center');
          break;
        case 2:
          $card.attr('id', 'right');
          break;
      }
    };
    this.setAttrs();
  },
  sortViews: function () {
    this.cardViews.sort(function(a,b) {
      return a.card.position - b.card.position;
    });
  },
  initalizeViews: function() {
    this.$gameboard = $('#gameboard');
    this.ballView.initialize();
    for (var i = 0; i < game.cards.length; i++) { //creates three new cardViews and add each to the dom
      var newCardView = new this.CardView(i);
      if (newCardView.card.hasBall) {
        newCardView.$el.append(this.ballView.$el);
      }
      this.$gameboard.append(newCardView.$el);
      this.cardViews.push(newCardView);
    };
    this.setStartButton();
  },
  swapEnd: function() {
    $display = $('#display');
    $display.text('So... which card is hiding the ball?');
    this.setCardEvents();
    $('#reset').removeClass('hidden');
  },
  gameOver: function() {
    $display = $('#display');
    if (game.guessedCard) {
      $display.text("That's right! Well done. Want to play again?");
    } else {
      $display.text("Nope. Better luck next time.");
    }
    this.setResetButton();
  },
  setStartButton: function() {
    $start = $('#start'); //creates a jQuery object for the start button
    $display = $('#display') //..and one for the display text area
    $start.on('click', function(eventObject) {
      $display.html('Follow the cards closely! Level: ' + game.level);
      if (eventObject.shiftKey) {
        game.level = 15;
        $display.html('YOU HAVE ENTERED NYC MODE! BEWARE!');
        game.swapDuration = 200;
      }
      $start.addClass('hidden');

      game.play();
      if (game.guessedCard) {
        game.level++;
      }
    });
  },
  setCardEvents: function() {
    var $cards = $('.card'); //jQuery object for the card elements in the DOM
    var $card0 = $($cards[0]);
    var $card1 = $($cards[1]);
    var $card2 = $($cards[2]);
//TODO: REPLACE WITH CLEAN CODE AND A FOR LOOP!
    $card0.on('click', function(eventObject) {
      game.guessedCard = false;
      views.ballView.show();
      });
    $card1.on('click', function(eventObject) {
      game.guessedCard = true;
      views.ballView.show();
      });
    $card2.on('click', function(eventObject) {
      game.guessedCard = false;
      views.ballView.show();
      });
  },
  setResetButton: function() {
    $reset = $('#reset');
    $reset.on('click',function(eventObject) {
      game.swapCount = 0;
      $reset.addClass('hidden');
      $('#start').removeClass('hidden');
    });
  }
};
game.initialize();
