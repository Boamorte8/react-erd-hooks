// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [pokemonInfo, setPokemonInfo] = React.useState({
    pokemon: null,
    status: pokemonName ? 'pending' : 'idle',
    error: null,
  })
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )
  React.useEffect(() => {
    if (!pokemonName) return
    setPokemonInfo({pokemon: null, status: 'pending', error: null})

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setPokemonInfo({pokemon: pokemonData, status: 'resolved', error: null})
      })
      .catch(error => {
        setPokemonInfo({pokemon: null, status: 'rejected', error})
      })
  }, [pokemonName])

  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />
  const {pokemon, status, error} = pokemonInfo
  if (status === 'idle') return 'Submit a pokemon'
  if (status === 'rejected') throw new Error(error.message)
  // return (
  //   <div role="alert">
  //     There was an error:{' '}
  //     <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
  //   </div>
  // )

  if (status === 'pending') return <PokemonInfoFallback name={pokemonName} />
  return <PokemonDataView pokemon={pokemon} />
}

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {hasError: false}
//   }

//   static getDerivedStateFromError(error) {
//     // Update state so the next render will show the fallback UI.
//     return {hasError: true, error}
//   }
//   // componentDidCatch(error, errorInfo) {
//   //   // You can also log the error to an error reporting service
//   //   logErrorToMyService(error, errorInfo);
//   // }
//   render() {
//     console.log('this.state', this.state)

//     const { hasError, error } = this.state
//     if (hasError) {
//       // You can render any custom fallback UI
//       return (
//   <div role="alert">
//     There was an error:{' '}
//     <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
//   </div>
// )
//     }
//     return this.props.children
//   }
// }

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function ErrorFallback({error, resetErrorBoundary}) {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    )
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          // key={pokemonName}
          FallbackComponent={ErrorFallback}
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
