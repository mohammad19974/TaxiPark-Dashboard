const fs = require('fs');
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/docs/swagger-ui-init.js',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    // Extract the swaggerDoc object
    const match = data.match(/swaggerDoc:\s*(\{[\s\S]*?\})\s*,\s*"customOptions"/);
    if (match) {
      const swaggerSpec = match[1];
      fs.writeFileSync('swagger-spec.json', swaggerSpec);
      console.log('Swagger spec extracted successfully!');
    } else {
      console.error('Could not extract swagger spec');
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();