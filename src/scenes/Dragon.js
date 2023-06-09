//This is the scene for the boss the Dragon (Last Boss)
//This scene creates the text of the name of the boss, the sprite of the boss and also the healthbar and textfield for damage input.
//It also looks adds the 'You won!' text in the update function if the boss's health is zero.
//The update function updates the game or reads for key controls.
//Press enter to damage boss based on the number in the textfield. Press left arrow key to change boss's prompt.
//update() also reads if it is gameOver, then the player can press right arrow to enter the menuScene.

class Dragon extends Phaser.Scene {
    constructor() {
        super("dragonScene");
        this.inputting = false; //Not used
        this.currentNumber = ""; //Not used
        this.numbersArray = []; //Not used
        this.currentNumberText = null; //Not used
        this.entryLineText = null; //Not used
        


        //this.round = 0;//For future uses but not yet implemented or used
    }
    preload() {
        // load images/tile sprites
        this.load.image('healthbar', './assets/green.png');
        this.load.image('back', './assets/back1.png');
        this.load.image('dragon', './assets/dragon.png');
        // load spritesheet
        //this.load.spritesheet('', './assets/.png', {frameWidth: 0, frameHeight: 0, startFrame: 0, endFrame: 0});
    }
    create() {
        this.round = 1;//keeps track of rounds

        this.actionPhase = false;
        this.announcePhase = true;
        this.bossPhase = false;
        this.scalearmor = 0;
        this.rubblefalling = false;
        //This sets playerdmg to zero initially because the room just got created, and no damage exist yet.
        playerdmg = 0;

        //this is for checking if the game is over, so when initilized it is false.
        this.gameOver = false;

        //configuration for the boss title text
        let menuConfig = {
            fontFamily: 'fantasy',
            fontSize: '48px',
            backgroundColor: '#000',
            color: '#FFFFFF',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        
        //Defining bossHealth and bossMaxHealth which are the global variable number_of_players * 40
        this.bossHealth = number_of_players*40;
        this.bossMaxHealth = number_of_players*40;

        //Adding our boss title text for Dragon
        this.bosstitle = this.add.text(game.config.width/2, game.config.height/2 -  5.5*borderUISize, 'The Dragon',menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '24px';
        this.phase = this.add.text(game.config.width/2, game.config.height/2 -  4*borderUISize, 'Announcement',menuConfig).setOrigin(0.5);
        this.roundtext = this.add.text(20, game.config.height -  1.5*borderUISize, 'Round: '+this.round,menuConfig);
        //Comments below were code for tweening that does not work.
        //this.bossHealth = 120;
        //this.bossMaxHealth = 120;
        // place title sprite
        //this.sheetPlaceHolder = this.add.tileSprite(0, 0, 640, 480, '').setOrigin(0, 0);
        // animation config
        // this.anims.create({
        //     key: '',
        //     frames: this.anims.generateFrameNumbers('', { start: 0, end: 0, first: 0}),
        //     frameRate: 30
        // });

        // create text objects to display current number and entry line (not important or used at all)
        this.currentNumberText = this.add.text(10, 10, this.currentNumber);
        this.entryLineText = this.add.text(10, 50, "");
    
        // add keyboard input (some fragmented code not used that I copied)
        //this.input.keyboard.on('keydown', this.handleInput, this); 

        let bossList; //Not used
        this.num_rubble = Math.floor((Math.random()*number_of_players)+1);

        // make Dragon boss
        //Making const DragonMoves a List of typed out moves of the Traveler based on the rule's sheet or card.
        const DragonMoves = ["Attack: I hit a random player for 8 damage","Fire Breath: I bellow fire to hit all players for 6 damage", "Cave-In: I smash the ground dealing 2 damage to all players and causing " +this.num_rubble+" rubble to fall on random players for 2 damage each next round", "Scale Armor: Whenever I take damage, reduce it by 2, this stacks."];
        this.DragonMoves2 = [["Attack", "I hit a random player for 8 damage"],["Fire Breath", "I bellow fire to hit all players for 6 damage"],["Cave-In","I smash the ground dealing 2 damage to all players\ncausing " + this.num_rubble+ " rubble to fall on \nrandom players for 2 damage each round"], ["Scale Armor", "Whenever I take damage, \nreduce it by 2, this stacks."]];
        //create the Dragon boss sprite and also pass its moves over for announce() later.
        this.Dragon = new Boss(this, game.config.width/2, game.config.height/3, 'dragon', this.DragonMoves2, 40,).setOrigin(0.5, 0).setScale(0.35);
        
        //Makes the bossHeathBar
        this.BosshealthBar=this.makeBar(0,0,0x2ecc71,this.bossHealth);
       
        //this is the text that shows what the bosses's move is.
        this.bosslog2 = this.add.text(game.config.width/2, game.config.height/2 - 4.5* borderUISize, '').setOrigin(0.5);
        this.bosslog = this.add.text(game.config.width/2, game.config.height/2 - 3* borderUISize, '').setOrigin(0.5);
        this.bosslog.text = "The boss's next move is: " +this.Dragon.announce();
        this.bossstatus1 = this.add.text(20, game.config.height -  2*borderUISize, 'Scale Armor: '+this.scalearmor,menuConfig);
        this.nexturnDialogue = this.add.text(game.config.width/2, game.config.height/2 - 1.9* borderUISize, '').setOrigin(0.5);
        
 
        //console.log(this.MoveElement);
        this.nexturnDialogue.text = '';
        
        //Instruction text below the textfield tell them to edit and enter for damage.
        this.add.text(20, 110, 'Click grey textbox to start editing\ndamage calculation.');

        //Instruction text below the health bar that says to press left arrow and end turn for the boss's next announcement
        this.add.text(20, 70, 'Press right arrow to switch or move\nto the next turn');
        this.add.text(20, 150, 'press enter key to damage the boss. \npress left arrow to debuff boss.\n*note only works during action phase.');
        
        //Adding REXUI textfield now
        game.config.dom = true;
        game.config.parent = this;
        var printText = this.add.rexBBCodeText(game.config.width/9, game.config.height/2 - borderPadding*2, '0', {
            color: 'white',
            fontSize: '24px',
            //fontFamily: 'fantasy',
            align: 'center',
            fixedWidth: 200,
            fixedHeight: 40,
            backgroundColor: '#333333',
            valign: 'center'
        }).setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', function () {
            var config = {
                type: 'number',
                onTextChanged: function (textObject, text) {
                    // Check input text here.
                    textObject.text = text;
                }
            };               
            this.plugins.get('rextexteditplugin').edit(printText, config);
        }, this);
        this.warning = this.add.text(game.config.width/2, game.config.height/2 + borderUISize +80, '').setOrigin(0.5);
        this.plugins.get('rextexteditplugin').add(printText, {
            onOpen: function (textObject) {
                console.log('Open text editor');
            },
            onTextChanged: function (textObject, text) {
                textObject.text = text;
                console.log(`Text: ${text}`);

                //We turn the textfield text input the value of the global variable playerdmg.
                playerdmg = parseInt(text);
            },
            onClose: function (textObject) {
                console.log('Close text editor');
            },
            selectAll: true,
            // enterClose: false
        });
        //the comments below were code that did not work when trying to add the stateMachine or call damage from the bossObject
        //test.damage(5);
        //bossList[0] = test;
        /*
        this.rounds = new StateMachine('new', {
            newRound: new NewRoundState(),
            announcment: new AnnoucmentState(),
            player: new PlayerState(),
            boss: new BossState(),
            victory: new VictoryState(),
        }, [this, bossList[round]]);
        */
    }

    //I found a example of a healthBar function.  It makes a retangular bar and takes x, y, color and health as arguments
    makeBar(x, y,color,health) {
        //draw the bar
        let bar = this.add.graphics();

        //color the bar
        bar.fillStyle(color, 1);

        //fill the bar with a rectangle
        bar.fillRect(0, 0, health*10, 50);
        
        //position the bar
        bar.x = x;
        bar.y = y;

        //return the bar
        return bar;
    }
    //Scales the health bar, useful for after the boss is damage.
    setValue(bar,percentage) {
        //scale the bar
        bar.scaleX = percentage;
    }

    //Our function defined in the scene that takes away the bosses health and also scales
    //It also calls setValue to scale the health bar based on the percentage (bosshealth - n)/maxbosshealth
    damage(n){
        if(this.bossHealth < 0) {
            this.bossHealth = 0;
        }
        else {
            this.bossHealth = this.bossHealth-n;//the height of the rectangle is 50 pixels, width is health*height
        }
        /*
        //Segment below was trying to test tweening, but errors occured
        let newWidth = this.bossMaxHealth*10 * (this.bossHealth / this.bossMaxHealth);
        let height = 80;
        this.tweens.add({

            targets: this.BosshealthBar,
            duration: 300, // Replace with desired duration of animation in milliseconds
            ease: Phaser.Math.Easing.Linear,
            x: this.bossMaxHealth*10-newWidth,
            onComplete: () => {
                //this.BosshealthBar.clear();
                //this.BosshealthBar.clearMask();
                //this.BosshealthBar.fillRect(0, 0, newWidth, height);
            
            },
        });
        */
       
        this.setValue(this.BosshealthBar,((this.bossHealth)/this.bossMaxHealth));
    }
    heal(n){
        if(this.bossHealth < 0) {
            this.bossHealth = 0;
        }
        else {
            this.bossHealth = this.bossHealth+n;
        }

        this.setValue(this.BosshealthBar,((this.bossHealth)/this.bossMaxHealth));
    }
    sample_range(range,n){
        var sample = [];
        for(var i=0; i <n; i++) {
            sample.push(range.splice(Math.random()*range.length,1))
        }

    }
    update() {
        //We are constantly checking and changing the phase text to the current phase based on whether actionPhase or announcePhase is true.
        this.roundtext.text = 'Round: ' + this.round;
        this.bossstatus1.text = "Scale Armor: "+this.scalearmor;
        //We are constantly checking and changing the phase text to the current phase based on whether actionPhase or announcePhase is true.
        if(this.actionPhase == true && this.announcePhase == false) {
            this.phase.text = "Players' Turn";
        }
        if(this.announcePhase == true) {
            this.phase.text = "Announcement";
            this.phase.color = '#880808';
            
        }

        

        if(this.bossPhase == true) {
            this.phase.text = "Boss's Turn";
            this.phase.color = '#880808';
            
        }
        //If the game is over and the input is keyRight, we move to the Menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            //this.scene.start("menuScene");
            //this.scene.restart();
            this.scene.start('menuScene');
        }
        //If the game is over and the input is keyRight, we move to the menu, else we change phases
        if(!this.gameOver && Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
             
            if (this.bossHealth > 0 && this.announcePhase == true && this.actionPhase == false &&this.bossPhase==false){
                console.log("It is changing from announcement"+ this.bossHealth);
                
            
                this.bosslog.text = 'players now input their damage on the grey box'
                this.actionPhase = true;
                this.announcePhase = false;
                this.bossPhase = false;
                
                }   
            else if (this.bossHealth > 0 && this.announcePhase == false && this.actionPhase == true &&this.bossPhase == false){
                this.bosslog.text = currentBossmove;
                
                let random = Math.floor((Math.random()*number_of_players)+1);
                var sample = [];
                    for(var i =0; i < number_of_players; i++){
                        sample.push(i+1);
                    }
                if (this.bosslog.text == 'I hit a random player for 8 damage') {
                    this.bosslog.text = 'I hit player ' + random + ' for 8 damage';
        
                }
                else if (this.bosslog.text == 'Whenever I take damage, \nreduce it by 2, this stacks.') {
                    this.scalearmor += 2;
        
                }
                else if (this.bosslog.text == "I smash the ground dealing 2 damage to all players\ncausing "+ this.num_rubble+ " rubble to fall on \nrandom players for 2 damage each round" && number_of_players > 1) {
                    this.rubblefalling = true;
                    var playertargets = this.sample_range(sample,this.num_rubble);
                    this.bosslog2.text = 'Players hit by rubble for 2 damage: '+sample;
                    console.log(sample);


        
                }
                else if (this.bosslog.text == "I smash the ground dealing 2 damage to all players\ncausing "+ this.num_rubble+ " rubble to fall on \nrandom players for 2 damage each round" && number_of_players == 1) {
                    this.rubblefalling = true;
                    var playertargets = this.sample_range(sample,this.num_rubble);
                    this.bosslog.text = "I smash the ground dealing 2 damage to all players\ncausing "+ 1+ " rubble to fall on one player for 2 damage each round";
                    this.bosslog2.text = 'Players hit by rubble for 2 damage: '+1;
                    console.log(sample);


        
                }
                else if (this.bosslog.text == 'I hit a random player for 3 damage') {
                    this.bosslog.text = 'I hit player ' + random + ' for 3 damage';
        
                }
                console.log('hi');
                this.actionPhase = false;
                this.announcePhase = false;
                this.bossPhase = true;
                
            }
            else if (this.bossHealth > 0 && this.announcePhase == false && this.actionPhase == false &&this.bossPhase == true) {
                let nextmove = this.Dragon.announce();
                this.bosslog2.text = '';
                this.bosslog.text = "The boss's next move is: " +nextmove;
                this.bossPhase = false;
                this.actionPhase = false;
                this.announcePhase = true;
                this.round++;
                console.log(this.round);
                
            }
        }
        //Press Enter to damage the boss
        if (Phaser.Input.Keyboard.JustDown(keyENTER)) {

            
            console.log("damage");
            console.log(playerdmg);
            if (this.bossHealth >= 0 && !isNaN(playerdmg)&&this.actionPhase == true){
                if (this.scalearmor >= playerdmg){
                    this.damage(0);
                }
                else {
                    this.damage(playerdmg-this.scalearmor);
                }
                //this.bosslog.text = this.Dragon.announce();
                }
   
        }
        //Ends players' turn or shows the next boss's announcement/move
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            if (this.bossHealth >= 0 && !isNaN(playerdmg) &&this.actionPhase == true){
                //     this.heal(playerdmg);
                //     //this.bosslog.text = this.Traveler.announce();
                        
                        this.armor = false;
                        this.scalearmor = 0;
                     }   
        }
        //If the bossHealth is 0 or negative, add text, 'You Won' and 'Press right arrow' and set gameOver to true.
        if(this.bossHealth <= 0) {
            this.add.text(game.config.width/2, game.config.height/2, 'You Won!').setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press any right arrow to move to the next boss').setOrigin(0.5);
            this.gameOver = true;
        }
    }
}






