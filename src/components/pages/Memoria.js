import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

function Carta({color, estado, onClick = ()=>{}}) {
  return (
    <div 	  
      className={cx(
        "card border border-dark m-1 ratio ratio-1x1 ",
        (estado === 'oculto') && "bg-light",
        (estado === 'seleccionado') && color,
        (estado === 'emparejado') && 'invisible'                         
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
  
 
  function manejarClick (indiceCarta) {

    const cartaAnterior = cartas.filter((carta) => carta.estado === 'seleccionado')?.[0];
    
    setCartas((cartas) => cartas.map((carta,indice) => (
        indice === indiceCarta ? {...carta, estado: 'seleccionado'} : carta)
    ));
    
    if(cartaAnterior) {
      setTimeout(() => {
        setCartas((cartas) => cartas.map((carta) => (
          carta.estado === 'oculto' || carta.estado === 'emparejado' ?
            carta :
          cartaAnterior.color === cartas[indiceCarta].color ?
            {...carta, estado: 'emparejado'} : 
            {...carta, estado: 'oculto'}
          )
        ));
      }, 500);
    }
  }

  console.log('actualizacion de cartas',cartas);
  return {cartas, manejarClick};
}

export default function Memoria() {
  const {cartas, manejarClick} = useMemoriaState(4);
  return (
    <div className="memoria d-flex flex-wrap w-40 justify-content-center">
      {cartas.map(({color, estado},indice)=> (
        <Carta key={indice} color={color} estado={estado} onClick={estado === 'oculto' ? () => {manejarClick(indice)} : undefined } />)
      )}
    </div>) 
}