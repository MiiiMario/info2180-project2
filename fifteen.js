/* 								Extra Features Added
	- Added a feature to change the background image of the puzzle
		A control can be selected to ensure the image changes upon click

	- Added animation for moving the puzzle pieces
	 	Pieces now slide into empty spaces instead of instantly appearing
*/

"use strict"; 
window.onload = function()
{
	var puzzlearea;
	var squares;
	var shufflebutton;
	var validMoves=[];
	var emptySpaceX = '300px'; 
	var emptySpaceY = '300px';
	var changePicBoxlabel;
	var changePicBox;

	setUpCheckBoxes();

	puzzlearea = document.getElementById("puzzlearea");
	squares = puzzlearea.getElementsByTagName("div");
	shufflebutton = document.getElementById("shufflebutton");
	
	makeGrid();
	shufflebutton.onclick = shufflePieces;
	
	// Used to check the valid moves on start
	calcValidMoves();



	/*Function to to make the grid when the game first starts*/
	function makeGrid()
	{
		for (var i=0; i<squares.length; i++)
		{
			squares[i].className = "puzzlepiece";

			// Used to arrange the pieces into a grid formation
			squares[i].style.left = (i % 4 * 100) + "px";
			squares[i].style.top = (parseInt(i / 4) * 100) + "px";

			squares[i].style.backgroundPosition = "-" + squares[i].style.left + " " + "-" + squares[i].style.top;
			
			squares[i].onclick = function()
			{
				// Code to check if the piece can be moved
				if (isValidMove(this.style.left, this.style.top))
				{
					animatedSwitchPieces(parseInt(this.innerHTML-1));
				}				
			};
			

			squares[i].onmouseover = function()
			{
				// Code to check if the piece can be moved
				if (isValidMove(this.style.left, this.style.top))
				{
					this.classList.add("movablepiece");
				}
			};

			squares[i].onmouseout = function()
			{
				this.classList.remove("movablepiece");
			};
		}
	}

	// Function used to shuffle pieces on the grid when called
	function shufflePieces() 
	{
		var rndNum;
		
		// Changes the picture before randomizing if changePicBox is true
		if (changePicBox.checked) 
			{
				changePic();
			}
		
		for (var i = 0; i < 100; i++) 
		{
			// Used to randomly select a piece to move from the valid moves array
			rndNum = Math.floor(Math.random() * validMoves.length);

			for (var x = 0; x < squares.length; x++)
			{
				if ((validMoves[rndNum][0] === parseInt(squares[x].style.left)) && 
					(validMoves[rndNum][1] === parseInt(squares[x].style.top)))
				{
					switchPieces(parseInt(squares[x].innerHTML-1));
					calcValidMoves();

					break;
				}
			}
		}
	}

	// Animation for moving the pieces
	function animatedSwitchPieces(puzzlePiece)
	{
		var posX = squares[puzzlePiece].style.left;
	  	var posY = squares[puzzlePiece].style.top;	  	
	  	var xFinished = (squares[puzzlePiece].style.left === emptySpaceX); // Evaluates to either true or false
	  	var yFinished = (squares[puzzlePiece].style.top === emptySpaceY);
	  	
	  	var movement = setInterval(MovePiece, 1); // Executes the animation

		function MovePiece() 
		{
			if ((xFinished) && (yFinished))
			{
				emptySpaceX = posX;
				emptySpaceY = posY;
				clearInterval(movement);
				calcValidMoves();
				checkWin();
			} 
			else 
			{
				if (!(xFinished))
				{
					if (parseInt(squares[puzzlePiece].style.left) < parseInt(emptySpaceX))
					{
						squares[puzzlePiece].style.left = ((parseInt(squares[puzzlePiece].style.left) + 10) + 'px');
					}
					else
					{
						squares[puzzlePiece].style.left = ((parseInt(squares[puzzlePiece].style.left) - 10) + 'px');	
					}

					// Checks if the X coordinates have reached its destination
					if (squares[puzzlePiece].style.left === emptySpaceX)
					{
						xFinished = true;
					}
				}

				if (!(yFinished))
				{
					if (parseInt(squares[puzzlePiece].style.top) < parseInt(emptySpaceY))
					{
						squares[puzzlePiece].style.top = ((parseInt(squares[puzzlePiece].style.top) + 10) + 'px');
					}
					else
					{
						squares[puzzlePiece].style.top = ((parseInt(squares[puzzlePiece].style.top) - 10) + 'px');	
					}

					// Checks if the Y coordinates have reached its destination
					if (squares[puzzlePiece].style.top === emptySpaceY)
					{
						yFinished = true;
					}
				}
			}
		}
	}

	/*Function used to swap pieces upon pressing "Shuffle". Does so by switching X coordinates with Y*/
	function switchPieces(puzzlePiece)
	{
		// Swap all X positions
		var temp = squares[puzzlePiece].style.left;
		squares[puzzlePiece].style.left = emptySpaceX;
		emptySpaceX = temp;

		// Swap all Y positions
		temp = squares[puzzlePiece].style.top;
		squares[puzzlePiece].style.top = emptySpaceY;
		emptySpaceY = temp;
	}

	/*Fuction that checks for relative valid moves and stores them into a validMoves array for later use in the game*/
	function calcValidMoves()
	{
		//Converted empty space variables to integer for easier use
		var tempX = parseInt(emptySpaceX);
		var tempY = parseInt(emptySpaceY);

		// Clears the array for new values
		validMoves = [];

		//Checks for a piece above the empty space
		if (tempY != 0)
		{
			validMoves.push([tempX, tempY - 100]);
		}

		//Checks for a piece below the empty space
		if (tempX != 300)
		{
			validMoves.push([tempX + 100, tempY]);
		}

		//Checks for a piece to the right of the empty space
		if (tempY != 300)
		{
			validMoves.push([tempX, tempY + 100]);
		}

		//Checks for a piece to the let of the empty space
		if (tempX != 0)
		{
			validMoves.push([tempX - 100, tempY]);
		}
	}

	/*Funtion that checks the validMoves array to see if a move is valid*/
	function isValidMove(pieceX, pieceY)
	{
		pieceX = parseInt(pieceX);
		pieceY = parseInt(pieceY);

		for (var i = 0; i < validMoves.length; i++)
		{
			if ((validMoves[i][0] === pieceX) && (validMoves[i][1] === pieceY))
			{
				return true;
			}
		}
		return false;	
	}

	function checkWin() 
	{
		var win = true;

		//Checks if the empty space is still in the bottom right corner so as to save time not executing. 
		if ((emptySpaceX === "300px") && (emptySpaceY === "300px")) 
		{
			for (var i = 0; i < squares.length; i++) 
			{
				if ((squares[i].style.left !== (parseInt((i % 4) * 100) + "px")) &&
					(squares[i].style.top !== (parseInt((i / 4) * 100) + "px")))
				{
					win = false;
					break;
				}
			}
			if (win) 
			{
				gameWon();
				
			}
		}
	}

	/*Function to prompt the user they have won*/
	function gameWon()
	{
		alert("You Win, Congratulations!");
		
	} 

	// Used to randomly change the applied background picture
	function changePic() 
	{
		var listOfPics = ["https://drive.google.com/uc?id=1JopaRHh3cuadJxcivB63SPjNWokhsehj","https://drive.google.com/uc?id=1dj495bw-xoDh0rmUUfMui94n5sXSM5wo","https://drive.google.com/uc?id=1xf-0jUJ2rH46MPhApsJVhOjuSN2s_6AM","https://drive.google.com/uc?id=1HR6yY2jmIPuwWzuxVwfewgbCmYM5iIJw"];
		var currentPic = squares[0].style.backgroundImage.slice(5, -2); 
		var rndNum = Math.floor(Math.random() * listOfPics.length);

		if (currentPic.length === 0)
		{
			currentPic = "https://drive.google.com/uc?id=1JopaRHh3cuadJxcivB63SPjNWokhsehj";
		}
		
		// Used to prevent the random number from pointing
		// to the same pic that's already in use	
		if (currentPic === listOfPics[rndNum]) 
		{
			// Runs until the rndNum points to a different pic
			while (currentPic === listOfPics[rndNum]) 
			{
				rndNum = Math.floor(Math.random() * listOfPics.length);	
			}
		}

		// Applies the new pic to each square
		for (var x = 0; x < squares.length; x++)
		{
			squares[x].style.backgroundImage = "url('" + listOfPics[rndNum] +"')";
		}
		
	}

	/*Function to set up checkbox controls to div in HTML*/
	function setUpCheckBoxes()
	{
		// Creates the text label for the checkbox
		changePicBoxlabel = document.createElement('label');
		changePicBoxlabel.htmlFor = "changePicBox";
		changePicBoxlabel.appendChild(document.createTextNode('Change Background'));

		//Creates the checkbox
		changePicBox = document.createElement("input");
	    changePicBox.type = "checkbox";
	    changePicBox.id = "changePicBox";
	    
	    // Adds the label to the controls div in the html code before
	    // appending the checkbox so that the text instructions appear 
	    // before the checkbox control itself 		
		document.getElementById("controls").appendChild(changePicBoxlabel);
		document.getElementById("controls").appendChild(changePicBox);
	}
};