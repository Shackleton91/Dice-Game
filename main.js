var scores, roundScore, activePlayer, gamePlaying;

init();

var lastDice;

document.querySelector('.btn-roll').addEventListener('click', function() {
    if(gamePlaying) {
        // 1. Random number
        var dice1 = Math.floor(Math.random() * 6) + 1;
        var dice2 = Math.floor(Math.random() * 6) + 1;

        //2. Display the result
        document.getElementById('dice-1').style.display = 'block';
        document.getElementById('dice-2').style.display = 'block';
        document.getElementById('dice-1').src = 'dice-' + dice1 + '.png';
        document.getElementById('dice-2').src = 'dice-' + dice2 + '.png';

        //3. Update the round score IF the rolled number was NOT a 1
        if (dice1 !== 1 && dice2 !== 1) {
            //Add score
            roundScore += dice1 + dice2;
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        } else {
            //Next player
            nextPlayer();
        }
        
        /*
        if (dice === 6 && lastDice === 6) {
            //Player looses score
            scores[activePlayer] = 0;
            document.querySelector('#score-' + activePlayer).textContent = '0';
            nextPlayer();
        } else if (dice !== 1) {
            //Add score
            roundScore += dice;
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        } else {
            //Next player
            nextPlayer();
        }
        lastDice = dice;
        */
    }    
}); 

// Rules Modal
const modal = document.querySelector(".modal");
    const trigger = document.querySelector(".trigger");
    const closeButton = document.querySelector(".close-button");

    function toggleModal() {
        modal.classList.toggle("show-modal");
    }

    function windowOnClick(event) {
        if (event.target === modal) {
            toggleModal();
        }
    }

    trigger.addEventListener("click", toggleModal);
    closeButton.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);


document.querySelector('.btn-hold').addEventListener('click', function() {
    if (gamePlaying) {
        // Add CURRENT score to GLOBAL score
        scores[activePlayer] += roundScore;

        // Update the UI
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
        
        var input = document.querySelector('.final-score').value;
        var winningScore;
        
        // Undefined, 0, null or "" are COERCED to false
        // Anything else is COERCED to true
        if(input) {
            winningScore = input;
        } else {
            winningScore = 80;
        }
        
        // Check if player won the game
        if (scores[activePlayer] >= winningScore) {
            document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
            document.getElementById('dice-1').style.display = 'none';
            document.getElementById('dice-2').style.display = 'none';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            gamePlaying = false;
            // Confetti for Winner 
            class ConfettiParticle {
  
                constructor( context, width, height ) {
                  this.context = context;
                  this.width = width;
                  this.height = height;
                  this.color = '';
                  this.lightness = 60; 
                  this.diameter = 0;
                  this.tilt = 0;
                  this.tiltAngleIncrement = 0;
                  this.tiltAngle = 0;
                  this.particleSpeed = 1;
                  this.waveAngle = 0;
                  this.x = 0;
                  this.y = 0;
                  this.reset();
                }
                
                reset() {
                  this.lightness = 50;
                  this.color = Math.floor( Math.random() * 360 ); 
                  this.x = Math.random() * this.width;
                  this.y = Math.random() * this.height - this.height;
                  this.diameter = Math.random() * 6 + 4;
                  this.tilt = 0;
                  this.tiltAngleIncrement = Math.random() * 0.1 + 0.04;
                  this.tiltAngle = 0;
                }
                
                darken() {
                  if ( this.y < 100 || this.lightness <= 0 ) return; 
                  this.lightness -= ( 250 / this.height ); 
                }
                
                update() {
                  this.waveAngle += this.tiltAngleIncrement;
                  this.tiltAngle += this.tiltAngleIncrement;
                  this.tilt = Math.sin( this.tiltAngle ) * 12;
                  this.x += Math.sin( this.waveAngle );
                  this.y += ( Math.cos( this.waveAngle ) + this.diameter + this.particleSpeed ) * 0.4;
                  if ( this.complete() ) this.reset(); 
                  this.darken();
                }
                
                complete() {
                  return ( this.y > this.height + 20 );
                }
                
                draw() {
                  let x = this.x + this.tilt;
                  this.context.beginPath();
                  this.context.lineWidth = this.diameter;
                  this.context.strokeStyle = "hsl("+ this.color +", 50%, "+this.lightness+"%)";
                  this.context.moveTo( x + this.diameter / 2, this.y );
                  this.context.lineTo( x, this.y + this.tilt + this.diameter / 2 );
                  this.context.stroke();
                }
              }
              
              /**
               * Audio helper for AmpedOut stream
               */
              class AmpedOutStream {
                
                constructor() {
                  this.sto = null;
                  this.playing = false; 
                  this.track = document.querySelector( 'div.player-track > span' ); 
                  this.btn = document.querySelector( 'button.player-toggle' ); 
                  this.audio = new Audio(); 
                  this.audio.src = 'http://69.4.225.73/;';
                  this.audio.crossOrigin = 'anonymous';
                  this.audio.volume = 0;
                  
                  this.audio.addEventListener( 'canplaythrough', e => {
                    this.audio.play();
                  });
                  this.audio.addEventListener( 'waiting', e => {
                    this.setBtn( true, 'Waiting...' ); 
                    this.playing = false; 
                  });
                  this.audio.addEventListener( 'playing', e => {
                    this.fetchTrack(); 
                    this.fadeVolume();
                    this.setBtn( false, 'Stop' ); 
                    this.playing = true; 
                  });
                  this.audio.addEventListener( 'ended', e => {
                    this.setBtn( false, 'Play' ); 
                    this.playing = false; 
                    this.audio.volume = 0;
                  });
                  this.audio.addEventListener( 'pause', e => {
                    this.setBtn( false, 'Play' ); 
                    this.playing = false; 
                    this.audio.volume = 0;
                  });
                  this.audio.addEventListener( 'error', e => {
                    this.setTrack( e.target.error.message || 'Audio stream error.', 'error' );
                    this.setBtn( false, 'Play' ); 
                    this.playing = false; 
                    this.audio.volume = 0;
                  });
                  if ( this.btn ) {
                    this.btn.addEventListener( 'click', this.toggle.bind( this ) );
                  }
                }
                
                fetchTrack() {
                  if ( this.sto ) clearTimeout( this.sto ); 
                  this.sto = setTimeout( this.fetchTrack.bind( this ), 1000 * 60 );
                  
                  axios( {
                    method: 'GET', 
                    url: 'https://cors-anywhere.herokuapp.com/http://69.4.225.73/currentsong?sid=1',
                    responseType: 'text'
                  })
                  .then( res => {
                    if ( res && res.status < 400 && res.data ) return this.setTrack( res.data ); 
                    return this.setTrack( 'Error getting track!', 'error' ); 
                  })
                  .catch( err => {
                    return this.setTrack( err.message || 'Error getting track!', 'error' ); 
                  });
                }
                
                fadeVolume() {
                  if ( this.audio.volume >= 0.3 ) return; 
                  requestAnimationFrame( this.fadeVolume.bind( this ) );
                  this.audio.volume += 0.0005; 
                }
                
                setBtn( loading, text ) {
                  if ( !this.btn ) return; 
                  if ( loading ) { this.btn.setAttribute( 'disabled', 'disabled' ); }
                  else { this.btn.removeAttribute( 'disabled' ); }
                  this.btn.textContent = text;
                }
                
                setTrack( info, style ) {
                  if ( !this.track ) return; 
                  this.track.textContent = String( info || '' ).trim() || '...'; 
                  this.track.className = style || ''; 
                }
              
                play() {
                  if ( this.playing ) return; 
                  this.audio.load();
                }
                
                stop() {
                  if ( !this.playing ) return; 
                  try { this.audio.pause(); } catch ( e ) {}
                  try { this.audio.stop(); } catch ( e ) {}
                  try { this.audio.close(); } catch ( e ) {}
                }
                
                toggle() {
                  console.log( 'toggle', this.playing );
                  if ( this.playing ) { this.stop(); }
                  else { this.play(); }
                }
              }
              
              /**
               * Setup
               */
              (function() {
                let width = window.innerWidth;
                let height = window.innerHeight;
                let particles = [];
              
                // particle canvas
                const canvas = document.createElement( 'canvas' );
                const context = canvas.getContext( '2d' );
                canvas.id = 'particle-canvas';
                canvas.width = width;
                canvas.height = height;
                document.body.appendChild( canvas );
                
                // change body bg color 
                const changeBgColor = () => {
                  const hue = Math.floor( Math.random() * 360 ); 
                  document.body.style.backgroundColor = "hsl("+ hue +", 50%, 5%)";
                };
              
                // update canvas size
                const updateSize = () => {
                  width = window.innerWidth;
                  height = window.innerHeight;
                  canvas.width = width;
                  canvas.height = height;
                };
                
                // create confetti particles 
                const createParticles = () => {
                  particles = []; 
                  let total = 100; 
                  
                  if ( width > 1080 ) { total = 400; } else 
                  if ( width > 760 )  { total = 300; } else 
                  if ( width > 520 )  { total = 200; }
                  
                  for ( let i = 0; i < total; ++i ) {
                    particles.push( new ConfettiParticle( context, width, height ) );
                  }
                };
              
                // animation loop function
                const animationFunc = () => {
                  requestAnimationFrame( animationFunc );
                  if ( Math.random() > 0.98 ) changeBgColor();
                  context.clearRect( 0, 0, width, height );
                  
                  for ( let p of particles ) {
                    p.width = width;
                    p.height = height;
                    p.update();
                    p.draw();
                  }
                };
                
                // on resize 
                window.addEventListener( 'resize', e => {
                  updateSize();
                  createParticles();
                });
              
                // start
                updateSize();
                createParticles();
                changeBgColor();
                animationFunc();
                
                // setup audio  
                const aos = new AmpedOutStream(); 
                aos.play(); 
              })();
              

        } else {
            //Next player
            nextPlayer();
        }
    }
});


function nextPlayer() {
    //Next player
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    roundScore = 0;

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    //document.querySelector('.player-0-panel').classList.remove('active');
    //document.querySelector('.player-1-panel').classList.add('active');

    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
}

document.querySelector('.btn-new').addEventListener('click', init);

function init() {
    scores = [0, 0];
    activePlayer = 0;
    roundScore = 0;
    gamePlaying = true;

    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
} 


