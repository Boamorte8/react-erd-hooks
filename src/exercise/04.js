// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board() {
  // 🐨 squares is the state for this component. Add useState for squares
  // const [squares, setSquares] = React.useState(Array(9).fill(null))
  const [squares, setSquares] = useLocalStorageState(
    'squares',
    Array(9).fill(null),
  )

  // 🐨 We'll need the following bits of derived state:
  // - nextValue ('X' or 'O')
  // - winner ('X', 'O', or null)
  // - status (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)
  // 💰 I've written the calculations for you! So you can use my utilities
  // below to create these variables
  // const [nextValue, setNextValue] = useLocalStorageState(
  //   'nextValue',
  //   calculateNextValue(squares),
  // )
  // const [winner, setWinner] = useLocalStorageState(
  //   'winner',
  //   calculateWinner(squares),
  // )
  // const [status, setStatus] = useLocalStorageState(
  //   'status',
  //   calculateStatus(winner, squares, nextValue),
  // )
  let nextValue = calculateNextValue(squares)
  let winner = calculateWinner(squares)
  let status = calculateStatus(winner, squares, nextValue)
  // const [nextValue, setNextValue] = React.useState(calculateNextValue(squares))
  // const [winner, setWinner] = React.useState(calculateWinner(squares))
  // const [status, setStatus] = React.useState(
  //   calculateStatus(winner, squares, nextValue),
  // )

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    if (winner || squares[square]) return
    //
    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    // Doing so can lead to subtle bugs that can easily slip into production.
    //
    // 🐨 make a copy of the squares array
    // 💰 `[...squares]` will do it!)
    const squaresCopy = [...squares]
    //
    // 🐨 set the value of the square that was selected
    // 💰 `squaresCopy[square] = nextValue`
    squaresCopy[square] = nextValue
    // const newNextValue = calculateNextValue(squaresCopy)
    // const newWinner = calculateWinner(squaresCopy)
    // const newStatus = calculateStatus(newWinner, squaresCopy, newNextValue)
    //
    // 🐨 set the squares to your copy
    setSquares(squaresCopy)
    nextValue = calculateNextValue(squaresCopy)
    winner = calculateWinner(squaresCopy)
    status = calculateStatus(winner, squaresCopy, nextValue)
    // setNextValue(newNextValue)
    // setWinner(newWinner)
    // setStatus(newStatus)
  }

  function restart() {
    // 🐨 reset the squares
    // 💰 `Array(9).fill(null)` will do it!
    const newSquares = Array(9).fill(null)
    // const newNextValue = calculateNextValue(newSquares)
    // const newWinner = calculateWinner(newSquares)
    // const newStatus = calculateStatus(newWinner, newSquares, newNextValue)
    setSquares(newSquares)
    nextValue = calculateNextValue(newSquares)
    winner = calculateWinner(newSquares)
    status = calculateStatus(winner, newSquares, nextValue)
    // setNextValue(newNextValue)
    // setWinner(newWinner)
    // setStatus(newStatus)
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="status">{status}</div>
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
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
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
