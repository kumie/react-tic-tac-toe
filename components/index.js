import React from 'react';
import _ from 'lodash';
import Square from './square';
import ResetButton from './reset-button';

class TicTacToe extends React.Component {

  constructor(props) {
    super(props);
    this.players = ['x', 'o'];
    this.BOARD_LENGTH = 9;

    this.state = {
      winner: null,
      winningSquares: [],
      turn: null,
      activeSquares: []
    };
  }

  componentDidMount() {
    this.setRandomFirstTurn();
  }

  setRandomFirstTurn() {
    this.setState({ turn: this.players[Math.floor(Math.random() * 2)] });
  }

  setTurn() {
    this.setState({ turn: this.state.turn === this.players[1] ? this.players[0] : this.players[1] });
  }

  addActiveSquare(position) {
    const activeSquares = this.state.activeSquares;

    activeSquares.push({ player: this.state.turn, position });
    this.setState(activeSquares);
  }

  reset() {
    this.setState({
      activeSquares: [],
      winner: null,
      winningSquares: []
    });
  }

  handleSquareClick({ clickedSquare, player = this.state.turn }) {
    if (!_.isEmpty(this.state.winningSquares)) return;

    this.addActiveSquare(clickedSquare);

    const winningSquares = this.getWinner({ clickedSquare, player });

    if (!_.isEmpty(winningSquares)) {
      this.setWinner({ player, winningSquares });
    } else {
      this.setTurn();
    }
  }

  getWinner({ clickedSquare, player }) {
    if (this.isACornerSquare(clickedSquare) || this.isCenterSquare()) {
      const diagonalWin = this.getDiagonalWin(clickedSquare, player);
      if (!_.isEmpty(diagonalWin)) {
        return diagonalWin;
      }
    }

    const horizontalWin = this.getHorizontalWin(clickedSquare, player);
    if (!_.isEmpty(horizontalWin)) return horizontalWin;

    const verticalWin = this.getVerticalWin(clickedSquare, player);
    if (!_.isEmpty(verticalWin)) return verticalWin;
  }

  isCenterSquare(position) {
    return position === this.getCenterSquare();
  }

  getCenterSquare() {
    return (this.BOARD_LENGTH - 1) / 2;
  }

  getCornerSquares() {
    return _.chain(0)
        .range(this.BOARD_LENGTH, 2)
        .without(4)
        .value();
  }

  isACornerSquare(position) {
    return _.includes(this.getCornerSquares(), position);
  }

  allSquaresMarkedSame(squares, player) {
    if (!player) throw new Error('Player argument is required.');

    return _.every(squares, (position) => {
      const activeSquare = _.find(this.state.activeSquares, { position });
      return _.get(activeSquare, 'player') === player;
    });
  }

  getHorizontalWin(square, player) {
    let winningRow = null;

    _.each(this.getGrid(), (row) => {
      if (_.includes(row, square) && this.allSquaresMarkedSame(row, player)) {
        winningRow = row.sort();
        return false;
      }
    });

    return winningRow;
  }

  getVerticalWin(square, player) {
    const column = [];
    let columnNumber;

    _.each(this.getGrid(), (row) => {
      const positionIndex = row.indexOf(square);
      if (positionIndex !== -1) {
        columnNumber = positionIndex;
      }
    });

    if (_.isNumber(columnNumber)) {
      _.each(this.getGrid(), (row) => {
        column.push(row[columnNumber]);
      });
    }

    if (this.allSquaresMarkedSame(column, player)) {
      return column.sort();
    }

    return null;
  }

  getDiagonalWin(square, player) {
    const centerSquare = _.find(this.state.activeSquares, { position: square });
    const centerMarked = _.get(centerSquare, 'player') === player;

    if (!centerMarked) return null;

    const leftDiag = [0, 8];
    const rightDiag = [2, 6];

    if (_.includes(leftDiag, square)) {
      const squares = leftDiag.concat(this.getCenterSquare()).sort();
      const allMarkedSame = this.allSquaresMarkedSame(squares, player);
      if (allMarkedSame) return squares;
    }
    if (_.includes(rightDiag, square)) {
      const squares = rightDiag.concat(this.getCenterSquare()).sort();
      const allMarkedSame = this.allSquaresMarkedSame(squares, player);
      if (allMarkedSame) return squares;
    }
    if (this.isCenterSquare(square)) {
      const leftSquares = leftDiag.concat(this.getCenterSquare()).sort();
      const rightSquares = rightDiag.concat(this.getCenterSquare()).sort();

      if (this.allSquaresMarkedSame(leftSquares, player)) return leftSquares;
      if (this.allSquaresMarkedSame(rightSquares, player)) return rightSquares;
    }
  }

  getGrid() {
    return _.chain(0)
        .range(this.BOARD_LENGTH)
        .chunk(3)
        .value();
  }

  setWinner({ player, winningSquares }) {
    this.setState({ winningSquares, winner: player });
  }

  renderSquares() {
    return _.map(_.range(this.BOARD_LENGTH), (position) => {
      const findInActiveSquares = _.find(this.state.activeSquares, { position });
      const player = _.get(findInActiveSquares, 'player');
      const isWinner = this.state.winner === player &&
          _.includes(this.state.winningSquares, position);

      return (<Square
              key={ position }
              onClick={ this.handleSquareClick.bind(this, { clickedSquare: position, player }) }
              position={ position }
              marker={ player }
              isWinner={ isWinner }
             />);
    });
  }

  render() {
    return (
        <div className="grid">
          { this.renderSquares() }
          <ResetButton onClick={ this.reset.bind(this) } />
        </div>
    );
  }

}

export default TicTacToe;
