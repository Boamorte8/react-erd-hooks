// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState('history', [
    Array(9).fill(null),
  ])
  const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', 0)

  let squares = history[currentStep]
  let nextValue = calculateNextValue(squares)
  let winner = calculateWinner(squares)
  let status = calculateStatus(winner, squares, nextValue)

  const selectMove = move => {
    setCurrentStep(move)
    squares = history[move]
  }

  const moves = history.map((step, index) => {
    const label = index === 0 ? 'game start' : `move #${index}`
    const current = index === currentStep
    return (
      <li key={index}>
        <button disabled={current} onClick={() => selectMove(index)}>
          Go to {label} {current && '(current)'}
        </button>
      </li>
    )
  })

  const recalculateSquares = newSquares => {
    squares = newSquares
    nextValue = calculateNextValue(newSquares)
    winner = calculateWinner(newSquares)
    status = calculateStatus(winner, newSquares, nextValue)
  }

  function selectSquare(square) {
    if (winner || squares[square]) return
    const newHistory = history.slice(0, currentStep + 1)
    const squaresCopy = [...newHistory[currentStep]]
    squaresCopy[square] = nextValue
    const newCurrent = newHistory.push(squaresCopy)
    setCurrentStep(newCurrent - 1)
    setHistory(newHistory)

    recalculateSquares(squaresCopy)
  }

  function restart() {
    const newHistory = [Array(9).fill(null)]
    setHistory(newHistory)
    setCurrentStep(0)
    const newSquares = newHistory[0]
    recalculateSquares(newSquares)
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onClick={selectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
