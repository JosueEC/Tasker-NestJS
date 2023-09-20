import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { ErrorManager } from 'src/utils/error.manager';
import { PayloadToken } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // Este metodo valida las credenciales del usuario
  public async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity> {
    try {
      // El usuario podra validarse a traves de su username o a traves
      // de su email, cualquiera de los dos va a funcionar
      // Ambas funciones usan el metodo findBy del UserService, pero
      // cada una busca en base a la clave que se envia
      const userByUsername = await this.userService.findBy({
        key: 'username',
        value: username,
      });

      // En el caso de encontrar al user en base a su username, usamos el
      // metodo 'compaer' de bcrypt para justamente comparar la contrasña
      // enviada por el usuario con el hash que esta almacenado en la BD
      // En el caso donde todo se exitoso devolvemos la informacion del
      // usuario
      if (userByUsername) {
        const match = await bcrypt.compare(password, userByUsername.password);
        if (match) return userByUsername;
      }

      const userByEmail = await this.userService.findBy({
        key: 'email',
        value: username,
      });

      if (userByEmail) {
        const match = await bcrypt.compare(password, userByEmail.password);
        if (match) return userByEmail;
      }

      // Caso contrario, donde algo salio mal, ya sea que no se encontro ningun
      // usario o que las contraseñas no coincidieron, entonces lanzamos el error
      // notificando al cliente
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'Invalid credentials',
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // Este metodo devuelve un token generado por jsonwebtoken, recibe los
  // datos necesarios para crear el token, lo cuales son:
  //* payload:
  //    Es la carga util, la cual contiene informacion que se desee
  //    almacenar en el token, algo como el id o el username, el rol, puede ser
  //* secret:
  //    Es una cadena que puede ser cualquiera, la cual ayuda a hashear el
  //    token y comprobar los tokens que llegaran en las peticiones
  //* expires:
  //    Indica en cuanto tiempo expirara el token, ya sea en minutos, horas,
  //    dias, o hasta meses
  public signJWT({
    payload,
    secret,
    expires,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
    expires: number | string;
  }) {
    try {
      return jwt.sign(payload, secret, { expiresIn: expires });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // Este metodo es el que nos develve un jsonwebtoken con la info del usuario
  public async generateJWT(user: UserEntity): Promise<any> {
    try {
      // Lo primero es encontrar la informacion del usuario
      const getUser = await this.userService.findById(user.id);

      // Despues generamos el payload/carga util con la informacion que
      // deseemos del usuario, en este caso guardamos el role y el id
      // del usuario
      const payload: PayloadToken = {
        role: getUser.role,
        sub: getUser.id,
      };

      // Por ultimo retornamos el objeto completo, en el cual viene el
      // token generado para el usuario y la informacion del usuario
      return {
        // En la propiedade accessToken mandamos a llamar a nuestra funcion sign
        // la cual genera nuestro token con la informacion que necesita ser
        // enviada y asi mismo lo retorna
        accessToken: this.signJWT({
          payload,
          secret: process.env.JWT_SECRET,
          expires: '1h',
        }),
        user: getUser,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
