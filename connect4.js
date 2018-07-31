class Connect4 {
	constructor(selector) {
		this.ROWS = 6;
		this.COLS = 7;
        this.selector = selector;
        this.player = 'red';
        this.isGameOver = function(){};
        this.onPlayerMove = false;
		// const $grid = $(selector);
		// $grid.html('hello');
		this.createGrid();
		this.setupEventListeners();
	}

	createGrid(){
		const $board = $(this.selector); // board is assigned the <div> id connect4. so that the rows and tabels are added there.
		$board.empty();
		this.isGameOver = false;
		this.player = 'red';
		for (let row = 0; row < this.ROWS; row++){
			const $row = $('<div>')
			 .addClass('row');
			for (let col = 0; col < this.COLS; col++){
				const $col = $('<div>')
				 .addClass('col empty')
				 .attr('data-col', col)
				 .attr('data-row', row);
				$row.append($col); //each row is appended with 7 columns
		    }
			$board.append($row); // 6 rows and 7 columns are appended to the board.
		}
	}

	setupEventListeners(){ // to track the empty cells
		const $board = $(this.selector);
		const that = this;
		function findLastEmptyCell(col){
			const cells = $(`.col[data-col = '${col}']`); // to grab all the cells with the same data-col index value as the col value we pass in 
			//console.log(cells);
			for (let i = cells.length -1; i>=0; i--){
				const $cell = $(cells[i]);
				//console.log($cell);
				if($cell.hasClass('empty')) {
					return $cell;
				}
			}
			return null;
		}

		$board.on('mouseenter', '.col.empty', function() {
			if(that.isGameOver){
				return;
			}
			const col = $(this).data('col');
			const $lastEmptyCell = findLastEmptyCell(col);
			$lastEmptyCell.addClass(`next-${that.player}`);
		//console.log(col);	
		}); // to find the last empty cell in the column selected and to change the color of that last empty cell. without mouseleave function it will just keep selecting all the empty last cells of the column we select. 

		$board.on('mouseleave', '.col', function(){
			$('.col').removeClass(`next-${that.player}`);
		}); // this piece of code will remove color from the previously colored cell as soon as the mouse leaves that particular cell. It just colors the present cell where the mouse enters. 

		$board.on('click', '.col.empty', function(){
			if(that.isGameOver){
				return;
			}
			const col = $(this).data('col');
			//const row = $(this).data('row');
			const $lastEmptyCell = findLastEmptyCell(col);
			$lastEmptyCell.removeClass(`empty next-${that.player}`);
			$lastEmptyCell.addClass(that.player);
			$lastEmptyCell.data('player', that.player);
			
			const winner = that.checkForWinner($lastEmptyCell.data('row'), 
            $lastEmptyCell.data('col'));
			if (winner) {
				that.isGameOver = true;
				//alert(`Game over! player ${that.player} has won`);
				$('#gameover').text(`Game over! player ${that.player} has won`);
				$('.col.empty').removeClass('empty');
				return;
			}

			that.player = (that.player === 'red') ? 'black' : 'red';
			that.onPlayerMove();  
			$(this).trigger('mouseenter'); //to retain the position of each player as to where they put their dot

		}); // to change the color of the last empty cell  on the column that we click on to red 
	}

     checkForWinner(row,col){
     	const that = this;

     	function getCell(i, j){
     		return $(`.col[data-row='${i}'][data-col='${j}']`);
     	}

     	function checkDirection(direction){
     		//debugger;
     		let total = 0;
     		let i = row + direction.i;
     		let j = col + direction.j;
     		let $next = getCell(i,j);
     		while(i >= 0 && 
     			i < that.ROWS &&
     			j >= 0 &&
     			j < that.COLS && 
     			$next.data('player') === that.player) {
     			total++;
     		    i += direction.i;
     		    j += direction.j; 
     		    $next = getCell(i, j);
     		}
     		return total;
     	}
        function checkWin(directionA, directionB){
        	const total = 1+
        	 checkDirection(directionA)+
        	 checkDirection(directionB);
        	if(total >=4){
        		return that.player;
        	}
        	else{
        		return null;
        	}
        }

        function checkDiagonalBLtoTR(){
        	return checkWin({i: 1, j: -1}, {i: 1, j:1});
        }

        function checkDiagonalTLtoBR(){
        	return checkWin({i: 1, j: 1}, {i: -1, j: -1});
        }

        function checkVerticals(){
        	return checkWin({i: -1, j: 0}, {i: 1, j:0});
        }

        function checkHorizontals(){
        	return checkWin({i: 0, j: -1}, {i: 0, j:1});
        }

        return checkVerticals() || checkHorizontals() || checkDiagonalTLtoBR() || checkDiagonalBLtoTR();
    }

    restart() {
    	this.createGrid();
    	this.onPlayerMove();
    }
}
     	
     	
