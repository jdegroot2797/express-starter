const { scrypt, randomBytes } = require('crypto');
const { promisify } = require('util');

// scrypt is callback based, promisify used to let
// scrypt be promise based implementation
// output from scrypt is a buffer... must convert to a string
const scryptAsync = promisify(scrypt);

class PasswordManager {
  static async toHash(password) {
    const salt = randomBytes(8).toString('hex');
    const buf = await scryptAsync(password, salt, 64);

    return `${buf.toString('hex')}.${salt}`;
  }

  // storedPassword is hashed and salted password
  static async compare(storedPassword, givenPassword) {
    //break up hashed pass and salt by the '.'
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = await scryptAsync(givenPassword, salt, 64);

    return buf.toString('hex') === hashedPassword;
  }
}

module.exports = PasswordManager;
