import React, {useEfect} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './TicTacToe.css';
import FancyButton from '../small/FancyButton';

/* 
  Esta tarea consiste en hacer que el juego funcione, para lograr eso deben completar el componente 
  TicTacToe y el custom hook `useTicTacToeGameState`, que como ven solamente define algunas variables.

  Para completar esta tarea, es requisito que la FIRMA del hook no cambie.
  La firma de una función consiste en los argumentos que recibe y el resultado que devuelve.
  Es decir, este hook debe recibir el argumento initialPlayer y debe devolver un objeto con las siguientes propiedades:
  {
    tiles: // un array de longitud 9 que representa el estado del tablero (es longitud 9 porque el tablero es 3x3)
    currentPlayer: // un string que representa el jugador actual ('X' o 'O')
    winner: // el ganador del partido, en caso que haya uno. si no existe, debe ser `null`
    gameEnded: // un booleano que representa si el juego terminó o no
    setTileTo: // una función que se ejecutará en cada click
    restart: // una función que vuelve a setear el estado original del juego
  }

  Verán que los diferentes componentes utilizados están completados y llevan sus propios propTypes
  Esto les dará algunas pistas
*/

const Square = ({ value, onClick = () => {} }) => {
  return (
    <div onClick={onClick} className="square">
      {value}
    </div>
  );
};
Square.propTypes = {
  value: PropTypes.oneOf(['X', 'O', '']),
  onClick: PropTypes.func,
};

const WinnerCard = ({ show, winner, onRestart = () => {} }) => {
  return (
    <div className={cx('winner-card', { 'winner-card--hidden': !show })}>
      <span className="winner-card-text">
        {winner ? `Player ${winner} has won the game!` : "It's a tie!"}
      </span>
      <FancyButton onClick={onRestart}>Play again?</FancyButton>
    </div>
  );
};

WinnerCard.propTypes = {
  // Esta propiedad decide si el componente se muestra o está oculto
  // También se podría mostrar el componente usando un if (&&), pero usamos esta prop para mostrar los estilos correctamente.
  show: PropTypes.bool.isRequired,
  winner: PropTypes.oneOf(['X', 'O']),
  onRestart: PropTypes.func,
};

const getWinner = tiles => {

  if((tiles[0] === tiles[1] === tiles[2]) && (tiles[0] !== '')) return tiles[0];
  if((tiles[3] === tiles[4] === tiles[5]) && (tiles[3] !== '')) return tiles[3];
  if((tiles[6] === tiles[7] === tiles[8]) && (tiles[6] !== '')) return tiles[6];

  if((tiles[0] === tiles[3] === tiles[6]) && (tiles[0] !== '')) return tiles[0];
  if((tiles[1] === tiles[4] === tiles[7]) && (tiles[1] !== '')) return tiles[1];
  if((tiles[2] === tiles[5] === tiles[8]) && (tiles[2] !== '')) return tiles[2];

  if((tiles[0] === tiles[4] === tiles[8]) && (tiles[0] !== '')) return tiles[0];
  if((tiles[2] === tiles[4] === tiles[6]) && (tiles[2] !== '')) return tiles[2];  
  // calcular el ganador del partido a partir del estado del tablero
  // (existen varias formas de calcular esto, una posible es listar todos los
  // casos en los que un jugador gana y ver si alguno sucede)
  return null;
};

const useTicTacToeGameState = initialPlayer => {
  const tiles = ['','','','','','','','',''];
  const currentPlayer = initialPlayer;
  const winner = getWinner(tiles);
  const gameEnded = false;
  const winnerRef = useRef(null)
  const gameEndedRef = useRef(false);
    winnerRef.current = getWinner(tiles);
  const winner = winnerRef.current;
    gameEndedRef.current = !(winner === null);
  const gameEnded = gameEndedRef.current ;

  const setTileTo = (tileIndex, player) => {
      setTiles(tiles => tiles.map((element,index) => {
      return index === tileIndex ? player : element
    }));
      setCurrentPlayer(player => player === 'X' ? 'O' : 'X');    
  };
  const restart = () => {
    // Reiniciar el juego a su estado inicial
  };

  // por si no reconocen esta sintáxis, es solamente una forma más corta de escribir:
  // { tiles: tiles, currentPlayer: currentPlayer, ...}
  return { tiles, currentPlayer, winner, gameEnded, setTileTo, restart };
};

const TicTacToe = () => {
  const { tiles, currentPlayer, winner, gameEnded, setTileTo, restart } = useTicTacToeGameState('X');
  useEfect(()=>{
getWinner(tiles)

  })
  return (
    <div className="tictactoe">
      {tiles.map((casillero, index)=>{
        <Square value={casillero} onClick={setTileTo(index,currentPlayer)} key={index} />
      })}
      
      {winner? console.log(winner):console.log(winner) }
      {gameEnded?'gameEnded true':'gameEnded false'}
      <WinnerCard show={gameEnded} winner={winner} onRestart={restart}/>
    </div>
  );
};
export default TicTacToe;
