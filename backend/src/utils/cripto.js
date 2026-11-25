// Criptografia do CPF [RN03]
//
// O CPF usa criptografia (aes-256-cbc) porque precisamos mostrar o CPF
// original para o usuario logado. Criptografia pode ser revertida com a chave.
//
// Diferente disso, a senha do usuario usa hash (bcrypt), que NAO pode ser
// revertido: so conseguimos comparar a senha digitada com o hash salvo.
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const crypto = require('crypto');

const ALGORITMO = 'aes-256-cbc';
const CHAVE = process.env.CRIPTO_CHAVE;
const IV = process.env.CRIPTO_IV;

if (!CHAVE || Buffer.byteLength(CHAVE, "utf8") !== 32) {
  throw new Error("CRIPTO_CHAVE precisa ter exatamente 32 bytes no backend/.env.");
}
if (!IV || Buffer.byteLength(IV, "utf8") !== 16) {
  throw new Error("CRIPTO_IV precisa ter exatamente 16 bytes no backend/.env.");
}

// Transforma o CPF normal em texto criptografado
function criptografarCpf(cpfTexto) {
  const cifra = crypto.createCipheriv(ALGORITMO, CHAVE, IV);
  const criptografado = cifra.update(cpfTexto, 'utf8', 'hex') + cifra.final('hex');
  return criptografado;
}

// Transforma o CPF criptografado de volta no texto original
function descriptografarCpf(cpfCriptografado) {
  const decifra = crypto.createDecipheriv(ALGORITMO, CHAVE, IV);
  const original = decifra.update(cpfCriptografado, 'hex', 'utf8') + decifra.final('utf8');
  return original;
}

module.exports = { criptografarCpf, descriptografarCpf };