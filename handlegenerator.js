
let jwt = require( 'jsonwebtoken' );
let config = require( './config' );
const crypto = require('crypto');
const User = require("./models/user");

// Clase encargada de la creación del token
class HandlerGenerator {

  login( req, res, role=[] ) {
    
    // Extrae el usuario y la contraseña especificados en el cuerpo de la solicitud
    let usernameR = req.body.username;
    let passwordR = req.body.password;

    if( usernameR && passwordR ) {
    
      User.findOne({ where: { username: usernameR } }).then(result => {
        console.log('User',result);
        var hash = crypto.createHash('md5').update(passwordR).digest('hex');
        console.log('hash',hash);
        if (result.password===hash) {            
          // Se genera un nuevo token para el nombre de usuario el cuál expira en 24 horas
          let token = jwt.sign( { username: usernameR, role: result.role },
            config.secret, { expiresIn: '24h' } );
          
          // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
          res.json( {
            success: true,
            message: 'Authentication successful!',
            token: token
          } );

        } else {
          // El error 403 corresponde a Forbidden (Prohibido) de acuerdo al estándar HTTP
          res.send( 403 ).json( {
            success: false,
            message: 'Incorrect username or password'
          } );
        }
      })
    } else {

      // El error 400 corresponde a Bad Request de acuerdo al estándar HTTP
      res.send( 400 ).json( {
        success: false,
        message: 'Authentication failed! Please check the request'
      } );

    }

  }

  index( req, res ) {
    
    // Retorna una respuesta exitosa con previa validación del token
    res.json( {
      success: true,
      message: 'Index page'
    } );

  }
} 

module.exports = HandlerGenerator;