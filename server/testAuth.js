const http = require('http');
require('dotenv').config({ path: './.env' });
const connectDB = require('./config/db');
const app = require('./app');

let server;
const PORT = 5002;

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path,
        method,
        headers,
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseBody);
            resolve({ status: res.statusCode, body: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, body: responseBody });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (data) req.write(data);
    req.end();
  });
};

const runAuthTests = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, async () => {
      console.log(`\n===================================================`);
      console.log(` 🔑 Starting Phase 3 Authentication Test Suite`);
      console.log(`===================================================\n`);

      // 1. Test Login with Seeded Student
      console.log(`[Test 1] Testing POST /api/auth/login with student1@learnpulse.com...`);
      const loginRes = await request('POST', '/api/auth/login', {
        email: 'student1@learnpulse.com',
        password: 'password123',
      });
      console.log(`  -> Status: ${loginRes.status}, Success: ${loginRes.body.success}`);
      if (loginRes.status !== 200 || !loginRes.body.token) {
        throw new Error(`Login failed: ${loginRes.body.message}`);
      }
      const token = loginRes.body.token;
      console.log(`  ✓ Login Success! JWT Token generated.`);

      // 2. Test GET /api/auth/me
      console.log(`\n[Test 2] Testing GET /api/auth/me with Bearer token...`);
      const meRes = await request('GET', '/api/auth/me', null, token);
      console.log(`  -> Status: ${meRes.status}, User: ${meRes.body.data?.name} (${meRes.body.data?.role})`);
      if (meRes.status !== 200 || meRes.body.data?.email !== 'student1@learnpulse.com') {
        throw new Error(`GetMe failed: ${meRes.body.message}`);
      }
      console.log(`  ✓ Profile fetched successfully.`);

      // 3. Test Registration of new student
      console.log(`\n[Test 3] Testing POST /api/auth/register for new user...`);
      const testEmail = `newstudent_${Date.now()}@learnpulse.com`;
      const regRes = await request('POST', '/api/auth/register', {
        name: 'Test Student Account',
        email: testEmail,
        password: 'password123',
        role: 'student',
      });
      console.log(`  -> Status: ${regRes.status}, Success: ${regRes.body.success}`);
      if (regRes.status !== 201) {
        throw new Error(`Registration failed: ${regRes.body.message}`);
      }
      console.log(`  ✓ Registration Success!`);

      // 4. Test Invalid Token rejection
      console.log(`\n[Test 4] Testing GET /api/auth/me with invalid token...`);
      const invalidRes = await request('GET', '/api/auth/me', null, 'invalid_token_123');
      console.log(`  -> Status: ${invalidRes.status}, Message: ${invalidRes.body.message}`);
      if (invalidRes.status !== 401) {
        throw new Error(`Security Breach: Invalid token was not rejected with 401`);
      }
      console.log(`  ✓ Rejected invalid token correctly.`);

      console.log(`\n===================================================`);
      console.log(` 🎉 ALL AUTHENTICATION TESTS PASSED PERFECTLY!`);
      console.log(`===================================================\n`);

      server.close(() => process.exit(0));
    });
  } catch (err) {
    console.error(`❌ [Auth Test Error]:`, err.message);
    if (server) server.close();
    process.exit(1);
  }
};

runAuthTests();
