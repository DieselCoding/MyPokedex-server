import crypto from 'crypto';

function generatePassword(password: any, salt: string) {
  return sha256(salt + sha256(sha256(password + salt)));
}

function sha256(data: string) {
  const secret = 'sdfwekHgsdvpo190ugIOJSjG90';
  return crypto.createHmac('sha512', secret).update(data).digest('hex');
}

export default generatePassword;
