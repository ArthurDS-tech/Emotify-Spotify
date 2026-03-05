require('dotenv').config();

console.log('\n🔍 Verificando Configuração do Spotify\n');
console.log('=' .repeat(60));

console.log('\n📋 Variáveis de Ambiente:');
console.log('SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID);
console.log('SPOTIFY_CLIENT_SECRET:', process.env.SPOTIFY_CLIENT_SECRET ? '✅ Configurado' : '❌ Faltando');
console.log('SPOTIFY_REDIRECT_URI:', process.env.SPOTIFY_REDIRECT_URI);

console.log('\n🔗 URL de Autorização que será gerada:');
const scopes = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played',
  'user-library-read',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-playback-state',
  'user-read-currently-playing'
].join(' ');

const authUrl = `https://accounts.spotify.com/authorize?` +
  `client_id=${process.env.SPOTIFY_CLIENT_ID}&` +
  `response_type=code&` +
  `redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}&` +
  `scope=${encodeURIComponent(scopes)}`;

console.log(authUrl);

console.log('\n✅ O que você precisa fazer no Spotify Dashboard:');
console.log('=' .repeat(60));
console.log('1. Acesse: https://developer.spotify.com/dashboard');
console.log('2. Selecione seu app');
console.log('3. Clique em "Edit Settings"');
console.log('4. Em "Redirect URIs", adicione EXATAMENTE:');
console.log('\n   ', process.env.SPOTIFY_REDIRECT_URI);
console.log('\n5. Clique em "Add" e depois "Save"');
console.log('=' .repeat(60));

console.log('\n⚠️  ATENÇÃO:');
console.log('- A URL deve ser EXATAMENTE igual (case-sensitive)');
console.log('- Sem espaços antes ou depois');
console.log('- Sem barra (/) no final');
console.log('- Deve terminar em /api/auth/callback');
console.log('\n');
