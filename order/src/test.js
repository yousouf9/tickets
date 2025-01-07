function isBase64Url(str) {
  const base64urlRegex = /^[A-Za-z0-9_-]+$/;
  return base64urlRegex.test(str);
}

function isJwt(token) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  const [header, payload, signature] = parts;

  if (!isBase64Url(header) || !isBase64Url(payload) || !isBase64Url(signature)) {
    return false;
  }

  try {
    const decodedHeader = JSON.parse(Buffer.from(header, 'base64url').toString('utf8'));
    return decodedHeader.typ === 'JWT';
  } catch (error) {
     console.log(error)
    return false;
  }
}

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
console.log(isJwt(token)); 
