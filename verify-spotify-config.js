require('dotenv').config();

console.log('🔍 Verificando Configuração do Spotify...\n');

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

console.log('📋 Configurações Atuais:');
console.log('─────────────────────────────────────────────────');
console.log(`Client ID: ${clientId}`);
console.log(`Client Secret: ${clientSecret ? clientSecret.substring(0, 10) + '...' : 'NÃO CONFIGURADO'}`);
console.log(`Redirect URI: ${redirectUri}`);
console.log('─────────────────────────────────────────────────\n');

// Verificações
let hasErrors = false;

if (!clientId || clientId === 'seu_client_id') {
  console.error('❌ ERRO: SPOTIFY_CLIENT_ID não está configurado corretamente');
  hasErrors = true;
} else {
  console.log('✅ Client ID configurado');
}

if (!clientSecret || clientSecret === 'seu_client_secret') {
  console.error('❌ ERRO: SPOTIFY_CLIENT_SECRET não está configurado corretamente');
  hasErrors = true;
} else {
  console.log('✅ Client Secret configurado');
}

if (!redirectUri) {
  console.error('❌ ERRO: SPOTIFY_REDIRECT_URI não está configurado');
  hasErrors = true;
} else if (redirectUri !== 'http://localhost:3001/api/auth/callback') {
  console.warn('⚠️  AVISO: Redirect URI não é o padrão localhost');
  console.warn(`   Esperado: http://localhost:3001/api/auth/callback`);
  console.warn(`   Atual: ${redirectUri}`);
} else {
  console.log('✅ Redirect URI configurado corretamente');
}

console.log('\n📝 INSTRUÇÕES IMPORTANTES:\n');
console.log('1. Acesse: https://developer.spotify.com/dashboard');
console.log('2. Abra seu app (Client ID: ' + clientId + ')');
console.log('3. Clique em "Settings"');
console.log('4. Em "Redirect URIs", certifique-se de ter EXATAMENTE:');
console.log('   ┌─────────────────────────────────────────────┐');
console.log('   │ http://localhost:3001/api/auth/callback     │');
console.log('   └─────────────────────────────────────────────┘');
console.log('5. Clique em "Save"');
console.log('6. AGUARDE 2-3 MINUTOS para as mudanças propagarem');
console.log('7. Limpe o cache do navegador (Ctrl+Shift+Delete)');
console.log('8. Tente fazer login novamente\n');

if (hasErrors) {
  console.error('❌ Corrija os erros acima antes de continuar!\n');
  process.exit(1);
} else {
  console.log('✅ Configuração parece correta!\n');
  console.log('Se ainda estiver recebendo erro 400:');
  console.log('  - Verifique se o Redirect URI está EXATAMENTE como mostrado acima');
  console.log('  - Aguarde 2-3 minutos após salvar no Spotify Dashboard');
  console.log('  - Limpe o cache do navegador completamente');
  console.log('  - Tente em uma janela anônima/privada\n');
}
