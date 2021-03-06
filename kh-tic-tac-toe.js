// To Do
// A new choice, after choosing who goes first, they can choose who is X and who is O
// Another choice is whether or not to use photos!
// The winner gets a photo pop-up prize! Figure out how to use a modal for this.
// Change in the code: Use only one Katie pic and one Hannah pic per game!
// Stop the ability to toggle through photos on click after a cell has been populated.
// make the script load the images from a file instead of hard coded.
// implement random images on the board. -DONE (but put on hold)
// Fix the bug that allows a player to change an X to an O (and vice versa) -DONE

// The Game componenet is the parent component. It keeps track of most of the state in the game.
// It also renders the game board.
class Game extends React.Component {
  constructor(props) {
    super(props)
    this.incrementNumberTurns = this.incrementNumberTurns.bind(this);
    this.populateXLocations = this.populateXLocations.bind(this);
    this.cellClicked = this.cellClicked.bind(this);
    this.updateBoard = this.updateBoard.bind(this);
    this.newGame = this.newGame.bind(this);
    this.changeTurns = this.changeTurns.bind(this);
    this.setGameInProgress = this.setGameInProgress.bind(this);
    this.setCatsGame = this.setCatsGame.bind(this);
    this.loadRandImages = this.loadRandImages.bind(this);

    // set initial states
    this.state = {
      x_locations : [],
      o_locations : [],
      x_and_os: ['', '', '', '', '', '', '', '', ''],   // to keep track of the board
      img_board: ['', '', '', '', '', '', '', '', ''],
      number_of_turns: 0,
      currentTurn: 'X',
      gameInProgress: false,
      winner: "",
      gameWon: false,
      catsGame: false
    };
  }

  setGameInProgress(){
    this.setState({
      gameInProgress: !this.state.gameInProgress
    });
  }

  setCatsGame(){
    this.setState({
      catsGame: !this.state.catsGame
    });
  }

  updateBoard(id) {
    let updated_board = this.state.x_and_os;
    updated_board[id-1] = this.state.currentTurn;
    this.setState({
      x_and_os: updated_board
    });
    console.log("Board so far: " + this.state.x_and_os)
  }

  incrementNumberTurns(id) {
    // Make sure the number of turns is not being updated if the player clicks a cell that is already filled
    if(this.state.x_and_os[id-1] == '') {
      console.log("NumberTurns so far: " + this.state.number_of_turns)
      var prevCount = this.state.number_of_turns;
      this.setState({
        number_of_turns: prevCount += 1
      });
    }
  }

  loadRandImages(clicked_id) {
    let k_images = ["k1.jpg", "k2.jpg", "k3.jpg", "k4.jpg", "k5.jpg"];
    let h_images = ["h1.jpg", "h2.jpg", "h3.jpg", "h4.jpg", "h5.jpg", "h6.jpg"];
    console.log("*img_board:", this.state.img_board);
    console.log("*clicked_id:", clicked_id);
    console.log("*xo_value", this.state.x_and_os[clicked_id-1]);

    if(this.state.x_and_os[clicked_id-1] == "X"){
      let img = k_images[Math.floor(Math.random() * k_images.length)];
      let img_path = './images/' + img;
      let updated_board = this.state.img_board;
      updated_board[clicked_id-1] = img_path;
      this.setState({
        img_board: updated_board
      });
    }
    if(this.state.x_and_os[clicked_id-1] == "O"){
      let img = h_images[Math.floor(Math.random() * h_images.length)];
      let img_path = './images/' + img;
      let updated_board = this.state.img_board;
      updated_board[clicked_id-1] = img_path;
      this.setState({
        img_board: updated_board
      });
    }
  }

  cellClicked(id){
    // Make sure the player can't click a cell that has already been clicked
    if(this.state.x_and_os[id-1] == '') {
      this.updateBoard(id);
      this.populateXLocations(id);
      this.populateOLocations(id);
      this.checkForWinner();
      this.changeTurns();
    }
  }

  newGame(){
    // reset all states
    let new_board = ['', '', '', '', '', '', '', '', ''];
    let new_img_board = ['', '', '', '', '', '', '', '', ''];
    let x_loc = [];
    let o_loc = [];
    this.setState({
      x_locations: x_loc,
      o_locations: o_loc,
      x_and_os: new_board,   // to keep track of the board
      img_board: new_img_board,
      number_of_turns: 0,
      currentTurn: 'X',
      gameInProgress: false,
      winner: "",
      gameWon: false,
      catsGame: false,
      modal: false
    });
  }

  changeTurns(){
    let new_turn = (this.state.currentTurn == "X") ? "O" : "X"
    this.setState({ currentTurn: new_turn })
  }

  populateXLocations(x_id){
    console.log("populateXLocations() Cell that was clicked " + x_id)
    if(this.state.currentTurn == 'X'){
      this.state.x_locations.push(x_id)
    }
    console.log("X positions so far: " + this.state.x_locations)
  }

  populateOLocations(id){
    console.log("populateOLocations() Cell that was clicked " + id)
    if(this.state.currentTurn == 'O'){
      this.state.o_locations.push(id)
    }
    console.log("O positions so far: " + this.state.o_locations)
  }

  checkForWinner(){
    const winning_combos = [ [1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7],
                             [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7] ];

    if (this.state.x_locations.length >= 3) {

        // Convert the React state array of strings into an array of numbers
        let x_locations = this.state.x_locations;
        let x_array = []
        for(let i=0; i < x_locations.length; i++ ){
          x_array.push(parseInt(x_locations[i]))
        }
        let x_loc = new Set(x_array);

        for(let i=0; i < winning_combos.length; i++){
          let ts = new Set(winning_combos[i]);
          let win = x_loc.intersection(ts);

          if(win.size === 3){
            let winarray = Array.from(win);
            console.log("X is the Winner!" , winarray);
            this.setState({
              winner: "X",
              gameWon: !this.state.gameWon
            });
          }
        }
    }
    if (this.state.o_locations.length >= 3){
        // Convert the React state array of strings into an array of numbers
        let o_locations = this.state.o_locations;
        let o_array = []
        for(let i=0; i < o_locations.length; i++ ){
          o_array.push(parseInt(o_locations[i]))
        }
        let o_loc = new Set(o_array);

        for(let i=0; i < winning_combos.length; i++){
          let ts = new Set(winning_combos[i]);
          let win = o_loc.intersection(ts);

          if(win.size === 3){
            let winarray = Array.from(win);
            console.log("O is the Winner!" , winarray);
            this.setState({
              winner: "O",
              gameWon: !this.state.gameWon
            });
          }
        }
    }
  }

  render() {
    return (
      <div>
        <div className="game-container">
          <div className="grid-1">
            <Cell className="cell" id="1" currentTurn={this.state.currentTurn} xo={this.state.x_and_os} newGame={this.newGame} img_board={this.state.img_board}
                                          gameWon={this.state.gameWon} numturns={this.state.number_of_turns} loadRandImages={this.loadRandImages}
                                          incrementNumberTurns={this.incrementNumberTurns} cellClicked={this.cellClicked} gameinprogress={this.state.gameInProgress} setCatsGame={this.setCatsGame}/>
            <Cell className="cell" id="2" currentTurn={this.state.currentTurn} xo={this.state.x_and_os} newGame={this.newGame} img_board={this.state.img_board}
                                          gameWon={this.state.gameWon} numturns={this.state.number_of_turns} loadRandImages={this.loadRandImages}
                                          incrementNumberTurns={this.incrementNumberTurns} cellClicked={this.cellClicked} gameinprogress={this.state.gameInProgress} setCatsGame={this.setCatsGame}/>
            <Cell className="cell" id="3" currentTurn={this.state.currentTurn} xo={this.state.x_and_os} newGame={this.newGame} img_board={this.state.img_board}
                                          gameWon={this.state.gameWon} numturns={this.state.number_of_turns} loadRandImages={this.loadRandImages}
                                          incrementNumberTurns={this.incrementNumberTurns} cellClicked={this.cellClicked} gameinprogress={this.state.gameInProgress} setCatsGame={this.setCatsGame}/>
            <Cell className="cell" id="4" currentTurn={this.state.currentTurn} xo={this.state.x_and_os} newGame={this.newGame} img_board={this.state.img_board}
                                          gameWon={this.state.gameWon} numturns={this.state.number_of_turns} loadRandImages={this.loadRandImages}
                                          incrementNumberTurns={this.incrementNumberTurns} cellClicked={this.cellClicked} gameinprogress={this.state.gameInProgress} setCatsGame={this.setCatsGame}/>
            <Cell className="cell" id="5" currentTurn={this.state.currentTurn} xo={this.state.x_and_os} newGame={this.newGame} img_board={this.state.img_board}
                                          gameWon={this.state.gameWon} numturns={this.state.number_of_turns} loadRandImages={this.loadRandImages}
                                          incrementNumberTurns={this.incrementNumberTurns} cellClicked={this.cellClicked} gameinprogress={this.state.gameInProgress} setCatsGame={this.setCatsGame}/>
            <Cell className="cell" id="6" currentTurn={this.state.currentTurn} xo={this.state.x_and_os} newGame={this.newGame} img_board={this.state.img_board}
                                          gameWon={this.state.gameWon} numturns={this.state.number_of_turns} loadRandImages={this.loadRandImages}
                                          incrementNumberTurns={this.incrementNumberTurns} cellClicked={this.cellClicked} gameinprogress={this.state.gameInProgress} setCatsGame={this.setCatsGame}/>
            <Cell className="cell" id="7" currentTurn={this.state.currentTurn} xo={this.state.x_and_os} newGame={this.newGame} img_board={this.state.img_board}
                                          gameWon={this.state.gameWon} numturns={this.state.number_of_turns} loadRandImages={this.loadRandImages}
                                          incrementNumberTurns={this.incrementNumberTurns} cellClicked={this.cellClicked} gameinprogress={this.state.gameInProgress} setCatsGame={this.setCatsGame}/>
            <Cell className="cell" id="8" currentTurn={this.state.currentTurn} xo={this.state.x_and_os} newGame={this.newGame} img_board={this.state.img_board}
                                          gameWon={this.state.gameWon} numturns={this.state.number_of_turns} loadRandImages={this.loadRandImages}
                                          incrementNumberTurns={this.incrementNumberTurns} cellClicked={this.cellClicked} gameinprogress={this.state.gameInProgress} setCatsGame={this.setCatsGame}/>
            <Cell className="cell" id="9" currentTurn={this.state.currentTurn} xo={this.state.x_and_os} newGame={this.newGame} img_board={this.state.img_board}
                                          gameWon={this.state.gameWon} numturns={this.state.number_of_turns} loadRandImages={this.loadRandImages}
                                          incrementNumberTurns={this.incrementNumberTurns} cellClicked={this.cellClicked} gameinprogress={this.state.gameInProgress} setCatsGame={this.setCatsGame}/>
          </div>
        </div>
        <Choosefirstplayer currentTurn={this.state.currentTurn}
                           catsGame={this.state.catsGame}
                           changeTurns={this.changeTurns}
                           setGameInProgress={this.setGameInProgress}
                           gameinprogress={this.state.gameInProgress}
                           newGame={this.newGame}
                           winner={this.state.winner}
                           gameWon={this.state.gameWon}
                           numturns={this.state.number_of_turns}/>
    </div>
    )
  }
}

// The Choosefirstplayer componenet is a child component that allows the player to choose either X or O to go first.
class Choosefirstplayer extends React.Component {
  constructor(props) {
     super(props)
     this.selectFirst = this.selectFirst.bind(this);
  }
  selectFirst(fp){
      console.log("Made it to selectFirst.", fp)
      if (fp === 'O'){
        this.props.changeTurns();
      }
      this.props.setGameInProgress();
  }

  render() {
    if (this.props.gameinprogress){
      if (this.props.gameWon){
        let winner_name = (this.props.winner == 'X') ? "Katie" : "Hannah"
        return (
          <div>
            <h2 className="center-label">{winner_name} is the Winner! </h2>
            <Playagain className="cell-3" newGame={this.props.newGame} gameWon={this.props.gameWon}/>
          </div>
        )
      }
      else {
        if (this.props.catsGame || this.props.numturns == 9){

          // For loading cat images on Cat's Game
          // let cat_images = ["c1.jpg", "c2.jpg", "c3.jpg", "c4.jpg", "c5.jpg", "c6.jpg",
          //                   "c7.jpg", "c8.jpg", "c9.jpg", "c10.jpg", "c11.jpg", "c12.jpg", "c13.jpg"];
          // let img = cat_images[Math.floor(Math.random() * cat_images.length)];
          // let img_path = './images/cats/' + img;
          // <h2 className="center-label" data-toggle="modal" data-target="#myModal">Cat&#39;s Game!</h2>
          // $('#myModal').modal('toggle');
          return (
              <div>
                <h2 className="center-label">Cat&#39;s Game!</h2>
                <Playagain className="cell-3" newGame={this.props.newGame} gameWon={this.props.gameWon}/>
              </div>
          )
        }
        else {
          let current_turn_name = (this.props.currentTurn == 'X') ? "Katie" : "Hannah"
          return <h2 className="center-label">Current turn: {current_turn_name}</h2>;
        }
      }
    }
    else {
      return (
        <div>
          <h3 className="center-label">New Game:<br/>Choose who goes first:</h3>
          <div className="component">
            <div className="grid-2">
              <Playerbox className="cell-2" selectFirst={this.selectFirst}
                                            changeTurns={this.props.changeTurns}
                                            currentTurn={this.props.currentTurn}
                                            setGameInProgress={this.props.setGameInProgress}
                                            firstplayer="X" />
              <Playerbox className="cell-2" selectFirst={this.selectFirst}
                                            changeTurns={this.props.changeTurns}
                                            currentTurn={this.props.currentTurn}
                                            setGameInProgress={this.props.setGameInProgress}
                                            firstplayer="O" />
            </div>
          </div>
        </div>
      )
    }
  }
}




// The Playerbox component is a child of the Choosefirstplayer component. It renders the hoverable X and O 'buttons'.
class Playerbox extends React.Component {
  constructor(props) {
     super(props)
     this.state = {  }
     this.handleClick = this.handleClick.bind(this);
  }

  handleClick (){
    this.props.selectFirst(this.props.firstplayer);
  }

  render() {
      let firstplayer_label = (this.props.firstplayer == 'X') ? "K" : "H"
      return (
        <div className="cell-2" onClick={this.handleClick} firstplayer={this.props.firstplayer}>
          {firstplayer_label}
        </div>
      )
  }
}

// The Playagain component is a child of the Choosefirstplayer component. It renders the hoverable Play Again button.
class Playagain extends React.Component {
  constructor(props) {
     super(props)
     this.handleClick = this.handleClick.bind(this);
  }
  handleClick (){
    console.log("Playagain gameWon?",this.props.gameWon);
    this.props.newGame();
  }
  render() {
      return (
        <div className="component">
          <div className="grid-3">
            <div className="cell-3" onClick={this.handleClick}>Play Again</div>
          </div>
        </div>
      )
  }
}

// The Cell component is a child of the Game component. It renders each of the individual
// cells on the boards and monitors them for clicks.
 class Cell extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
        clicked: false,
      }
     this.handleClick = this.handleClick.bind(this);

   }
   handleClick (){
     this.setState({
       clicked: !this.state.clicked,
     });


     let clicked_id = this.props.id;
     console.log("Cell " + clicked_id + " was clicked");

     if(this.props.gameWon){
       this.props.newGame();
     }
     else {
       // console.log("CatsGame? NumberTurns so far: " + this.props.numturns);
       if (this.props.numturns == 9){
         console.log("CatsGame!");
         this.props.setCatsGame();
       }

       else if (this.props.gameinprogress){
         // Call the parent functions:
         this.props.incrementNumberTurns(clicked_id);
         this.props.cellClicked(clicked_id);
         // this.props.loadRandImages(clicked_id);
       }
     }
   }

   render() {

      console.log("--Cell:", this.props.xo[this.props.id-1]);

      return (
        <div className="cell" onClick={this.handleClick} id={this.props.id}>
          {this.props.xo[this.props.id-1]}
        </div>
      )
   }
 }
 // This is for Xs and Os
 // {this.props.xo[this.props.id-1]}

 // This is for using images instead of Xs and Os
 // <img src={this.props.img_board[this.props.id-1]} />

// This is the main React render(). It loads the parent component Game.
ReactDOM.render(
  <div>
    <h1 style={{fontFamily:'Amatic SC'}}>Katie & Hannah Tic-Tac-Toe</h1>
    <Game/>
  </div>
  ,
  document.getElementById('app'));

// This Set function is for enabling set intersection in order to check for winning combos.
Set.prototype.intersection = function(setB) {
  var intersection = new Set();
  for (var elem of setB) {
    if (this.has(elem)) {
      intersection.add(elem);
    }
  }
  return intersection;
}
