import React, { useState, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

function Carta({color, estado, onClick = ()=>{}}) {
  return (
    <div 	  
      className={cx(
        'card border border-dark m-1 ratio ratio-1x1 ',
        (estado === 'oculto') && 'bg-light',
        (estado === 'seleccionado') && color,
        (estado === 'emparejado') && 'invisible'                         
      )}
      onClick={onClick}
	    style={{width: '20%'}}
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
      if (pares[i] === 'OK') {
        i++;
      } else {
        pares[i] = 'OK';
      }
    }
  }
  return arrayAleatorio;
}

function conseguirColorCarta(indice) {
  const nombresParejas = [
    'bg-primary',
    'bg-secondary',
    'bg-success',
    'bg-danger',
    'bg-warning',
    'bg-info',
    'bg-light',
    'bg-dark',
  ];
  return nombresParejas[indice];
}

const useMemoriaState = (cantidadParejas) => {
  const estadoInicial = conseguirArrayAleatorio(cantidadParejas).map((numPareja) => {
    return {
      color: conseguirColorCarta(numPareja), 
      estado: 'oculto',
    }});
  const [cartas, setCartas] = useState(estadoInicial);
  
  const turnosRef = useRef(0);
  const turnos = turnosRef.current;
  const animacion = useRef(false);
  const tiempoRef = useRef(0);
  const tiempo = tiempoRef.current;
  const temporizador = useRef();

  function manejarClick(indiceCarta) {
    if (!animacion.current) { // ver bug multiple seleccion de cartas
      const cartaAnterior = cartas.filter((carta) => carta.estado === 'seleccionado')?.[0];
    
      setCartas((cartas) => cartas.map((carta,indice) => (
        indice === indiceCarta ? {...carta, estado: 'seleccionado'} : carta)
      ));
    
      if(cartaAnterior) {
        turnosRef.current += 1;
        animacion.current = true;
        
        setTimeout(() => {
          setCartas((cartas) => {
            return cartas.map((carta) => (
              carta.estado === 'oculto' || carta.estado === 'emparejado' ?
                carta :
                cartaAnterior.color === cartas[indiceCarta].color ?
                  { ...carta, estado: 'emparejado' } :
                  { ...carta, estado: 'oculto' }
            )
            );
          });
        animacion.current = false;
        
        }, 300);}
    }
  }
 
  useLayoutEffect(() => {
    if ( true
      //turnosRef.current === 1 && tiempoRef.current=== 0 
      ) {
      temporizador.current = setInterval(() => {
        tiempoRef.current += 1;
      }, 1000);
    }
    return () => clearInterval(temporizador.current);
  }, 
  [tiempo] 
  )


 function reset() {
    const nuevoEstadoInicial = conseguirArrayAleatorio(cantidadParejas).map((numPareja) => (
      {
        color: conseguirColorCarta(numPareja),
        estado: 'oculto',
    }));
    setCartas(nuevoEstadoInicial);
    turnosRef.current = 0;
    clearInterval(temporizador.current);
  }


  return {cartas, manejarClick, turnos, reset, tiempo};
}

export default function Memoria() {
  const {cartas, manejarClick, turnos, reset, tiempo} = useMemoriaState(6);
  return (
    <div id='memoria' className='d-flex flex-wrap w-50 justify-content-evenly'>
      <div id='display' className='d-flex flex-wrap w-30 justify-content-center'>{'turnos: ' + turnos}</div>
      <div id='timer' className='d-flex flex-wrap w-30 justify-content-center'>{tiempo}</div>
      <button id='timer' className='d-flex flex-wrap w-30 justify-content-center' onClick={reset} type="button">'Reset'</button>
      <div id='container-cartas' className='d-flex flex-wrap w-100 justify-content-center'>
        {cartas.map(({color, estado},indice)=> (
          <Carta key={indice} color={color} estado={estado} onClick={estado === 'oculto' ? () => {manejarClick(indice)} : undefined } />)
        )}
      </div>
    </div>) 
}