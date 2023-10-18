export function typeofArray( array ) {
  return typeofPrototype( array ) === "[object Array]";
}

export function typeofObject( object ) {
  return typeofPrototype( object ) === "[object Object]";
}

export function typeofFunction( fn ) {
  return typeofPrototype( fn ) === "[object Function]";
}

export function typeofString( string ) {
  return typeofPrototype( string ) === "[object String]";
}

export function typeofPrototype( parameter ){
  return Object.prototype.toString.call( parameter );
}