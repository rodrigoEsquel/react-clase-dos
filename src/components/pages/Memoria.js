import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

function CuerpoCarta({estado, color}) {
  return (
    <CuerpoCarta 
	  className={cx(
      'card-body',
      {'hidden': estado === 'oculto'},
      {color}
    )}
	/>)
}

function Carta({color, estado, onClick = ()=>{}}) {
  return (
    <div 	  
      className={cx("card border border-dark m-1 ratio ratio-1x1 ", estado ==='oculto' ?
                                                                    "bg-light" : 
                                                                    estado ==='OK' ?
                                                                    'invisible' : 
                                                                    color
                                                                    )}
      onClick={onClick}
	    style={{width: "20%"}}
      name={color}
    />
  )
}

function conseguirArrayAleatorio(numeroPares) {
  const pares = [];
  const arrayAleatorio = [];
  let i = 0;
  while (i < numeroPares) {
    let posicion = Math.trunc(numeroPares * 2 * Math.random());
    if (arrayAleatorio[posicion] === undefined) {
      arrayAleatorio[posicion] = i;
      if (pares[i] === "OK") {
        i++;
      } else {
        pares[i] = "OK";
      }
    }
  }
  return arrayAleatorio;
}

function conseguirColorCarta(indice) {
  const nombresParejas = [
    "bg-primary",
    "bg-secondary",
    "bg-success",
    "bg-danger",
    "bg-warning",
    "bg-info",
    "bg-light",
    "bg-dark",
  ];
  return nombresParejas[indice];
}

const useMemoriaState = (numeroPares) => {
  const estadoInicial = conseguirArrayAleatorio(numeroPares).map((numPareja) => {
    return {
      color: conseguirColorCarta(numPareja), 
      estado: 'oculto',
    }});
   const [cartas, setCartas] = useState(estadoInicial);
  const anteriorCarta = useRef('');
  function manejarClick (indiceCarta) {
    setCartas(cartas => cartas.map((carta,indice) => {
     return (indice === indiceCarta ? {...carta, estado: 'click'} : carta);
    }))
  }


  return {cartas, manejarClick, anteriorCarta};
}

export default function Memoria() {
  const {cartas, manejarClick} = useMemoriaState(4);
  return (
    <div className="memoria d-flex flex-wrap w-40 justify-content-center p-2">
      {cartas.map(({color, estado},indice)=> (
        <Carta key={indice} color={color} estado={estado} onClick={estado==='oculto' ? manejarClick(indice) : undefined } />)
      )}
    </div>) 
}