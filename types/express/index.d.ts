//* NOTA: En los declare no podemos agregar tipos personalizados
//* para tipar las propiedades agregadas a la interface, estos
//* deben ser tipados con tipos nativos, de lo contrario no seran
//* reconocidos al llamarlos en la instancia
declare namespace Express {
  interface Request {
    idUser: string;
    roleUser: string;
  }
}
