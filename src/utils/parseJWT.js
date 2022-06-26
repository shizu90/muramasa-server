export default function parseJwt(token){
    const base64URL = token.split('.')[1]
    const url = JSON.parse(Buffer.from(base64URL, 'base64'))
    return url.id
}