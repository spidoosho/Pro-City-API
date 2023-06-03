var nextServer = require('next/server');
var vercelEdge = require('@vercel/edge-config');

const config = { matcher: '/welcome' };

async function middleware() {
  const greeting = await vercelEdge.get('greeting');
  // NextResponse.json requires at least Next v13.1 or
  // enabling experimental.allowMiddlewareResponseBody in next.config.js
  return nextServer.NextResponse.json(greeting);
}

module.exports = { config, middleware };