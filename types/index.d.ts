// NodeJS.ProcessEnv

// Este es un truco que se puede hacer con TypeScript en el cual
// nos permite acceder a las variables de entorno desde el
// objeto process.env con la dot notation

// Basicamente con el namespace traemos todo lo que ya contiene
// el objeto NodeJS, y a traves de la interface es como añadimos
// los nuevos valores a los que deseamos poder acceder, que en este
// caso son las variables de entorno
declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    HASH_SALT: number;
  }
}
