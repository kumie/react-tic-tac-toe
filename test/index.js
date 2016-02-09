import 'jasmine-expect';
import _ from 'lodash';
import React from 'react';
import { shallow as shallowRenderer } from 'enzyme';

import TicTacToe from '../components';

describe('Tic Tac Toe', () => {
  let ticShallowWrapper;
  let tic;

  beforeEach(() => {
    ticShallowWrapper = shallowRenderer(<TicTacToe />);
    tic = ticShallowWrapper.instance();
  });

  it('Should determine whether a square is a corner square', () => {
    const topLeft = 0;
    const topRight = 2;
    const bottomLeft = 6;
    const bottomRight = 8;

    expect(tic.isACornerSquare(topLeft)).toBeTrue();
    expect(tic.isACornerSquare(topRight)).toBeTrue();
    expect(tic.isACornerSquare(bottomLeft)).toBeTrue();
    expect(tic.isACornerSquare(bottomRight)).toBeTrue();

    expect(tic.isACornerSquare(1)).toBeFalse();
    expect(tic.isACornerSquare(3)).toBeFalse();
    expect(tic.isACornerSquare(4)).toBeFalse();
    expect(tic.isACornerSquare(7)).toBeFalse();
  });

  it('Should get the center square of a board', () => {
    expect(tic.getCenterSquare()).toBe(4);
  });

  it('Should determine whether a square is the center of a board', () => {
    expect(tic.isCenterSquare(4)).toBeTrue();
    expect(tic.isCenterSquare(2)).toBeFalse();
  });

  it('Should determine whether all squares in a given row or column are marked by the same player', () => {
    tic.setState({ turn: 'x' });
    tic.addActiveSquare(0);
    tic.addActiveSquare(1);
    tic.addActiveSquare(2);

    expect(tic.allSquaresMarkedSame([0, 1, 2], 'x')).toBeTrue();
    expect(tic.allSquaresMarkedSame([0, 1, 2], 'o')).toBeFalse();
    expect(tic.allSquaresMarkedSame([1, 2, 3], 'x')).toBeFalse();
  });

  it('Should determine whether a given row is a winner', () => {
    tic.setState({ turn: 'x' });
    tic.addActiveSquare(0);
    tic.addActiveSquare(1);
    tic.addActiveSquare(2);

    expect(tic.getHorizontalWin(0, 'x')).toEqual([0, 1, 2]);
    expect(tic.getHorizontalWin(1, 'x')).toEqual([0, 1, 2]);
    expect(tic.getHorizontalWin(2, 'x')).toEqual([0, 1, 2]);
    expect(tic.getHorizontalWin(3, 'x')).toBeNull();
  });

  it('Should determine whether a given column is a winner', () => {
    tic.setState({ turn: 'o' });
    tic.addActiveSquare(1);
    tic.addActiveSquare(4);
    tic.addActiveSquare(7);

    expect(tic.getVerticalWin(1, 'o')).toEqual([1, 4, 7]);
    expect(tic.getVerticalWin(4, 'o')).toEqual([1, 4, 7]);
    expect(tic.getVerticalWin(7, 'o')).toEqual([1, 4, 7]);
    expect(tic.getVerticalWin(2, 'o')).toBeNull();
  });

  it('Should determine whether the board has a diagonal win', () => {
    tic.setState({ turn: 'x' });
    tic.addActiveSquare(0);
    tic.addActiveSquare(4);
    tic.addActiveSquare(8);

    expect(tic.getDiagonalWin(0, 'x')).toEqual([0, 4, 8]);
    expect(tic.getDiagonalWin(4, 'x')).toEqual([0, 4, 8]);
    expect(tic.getDiagonalWin(8, 'x')).toEqual([0, 4, 8]);

    expect(tic.getDiagonalWin(2, 'x')).toBeNull();
    expect(tic.getDiagonalWin(6, 'x')).toBeNull();

    expect(tic.getDiagonalWin(0, 'o')).toBeNull();
    expect(tic.getDiagonalWin(4, 'o')).toBeNull();
    expect(tic.getDiagonalWin(8, 'o')).toBeNull();
  });

  it('Should call the addActiveSquare, getWinner, and setTurn methods when handleSquareClick', () => {
    spyOn(tic, 'addActiveSquare');
    spyOn(tic, 'getWinner');
    spyOn(tic, 'setWinner');
    spyOn(tic, 'setTurn');

    tic.handleSquareClick({ clickedSquare: 0, player: 'x' });

    expect(tic.addActiveSquare).toHaveBeenCalledWith(0);
    expect(tic.getWinner).toHaveBeenCalledWith({ clickedSquare: 0, player: 'x' });
    expect(tic.setWinner).not.toHaveBeenCalled();
    expect(tic.setTurn).toHaveBeenCalled();
  });

  it('Should do nothing when handleSquareClick is called and a winner has already been set', () => {
    spyOn(tic, 'addActiveSquare');

    tic.setState({ winningSquares: [{}] });

    tic.handleSquareClick({});
    expect(tic.addActiveSquare).not.toHaveBeenCalled();
  });

  it('Should reset the board', () => {
    tic.setState({ activeSquares: [{ position: 0, player: 'x' }], winner: 'x', winningSquares: [0, 1, 2] });

    tic.reset();
    expect(tic.state.activeSquares).toBeEmptyArray();
    expect(tic.state.winner).toBeNull();
    expect(tic.state.winningSquares).toBeEmptyArray();
  });
});
