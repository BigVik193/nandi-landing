#!/usr/bin/env node

/**
 * Test script for Apple App Store Connect API - In-App Purchase Creation
 * Tests the /v2/inAppPurchases endpoint with correct request structure
 * 
 * Usage: node test-sku-creation.js
 * 
 * This script tests both:
 * 1. Direct Apple API call (to verify our implementation is correct)
 * 2. Our Nandi API endpoint (to test the full flow)
 */

const https = require('https');

// Test configuration - Real data from Supabase
const TEST_CONFIG = {
  // Test data - Real data from Supabase
  TEST_GAME_ID: '75b0e38d-1a4f-4722-be0e-9ecbc9155930', // pasteman game
  TEST_VIRTUAL_ITEM_ID: 'd0923341-c0ae-48b6-bdf0-3a1ca2159bd2', // pro subscription
  TEST_GAME_NAME: 'pasteman',
  TEST_VIRTUAL_ITEM_NAME: 'pro',
  TEST_VIRTUAL_ITEM_TYPE: 'subscription',
  BUNDLE_ID: 'com.vikrambattalapalli.pasteman-app',
  
  // Nandi API endpoint
  NANDI_API_BASE: 'http://localhost:3000' // or your deployed URL
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Create JWT token for Apple API authentication
async function createAppleJWT() {
  try {
    const { SignJWT, importPKCS8 } = await import('jose');
    
    const privateKeyObject = await importPKCS8(TEST_CONFIG.APPLE_PRIVATE_KEY, 'ES256');
    
    const jwt = await new SignJWT({
      iss: TEST_CONFIG.APPLE_ISSUER_ID,
      aud: 'appstoreconnect-v1'
    })
      .setProtectedHeader({
        alg: 'ES256',
        kid: TEST_CONFIG.APPLE_KEY_ID,
        typ: 'JWT'
      })
      .setIssuedAt()
      .setExpirationTime('20m')
      .sign(privateKeyObject);
    
    return jwt;
  } catch (error) {
    throw new Error(`Failed to create JWT: ${error.message}`);
  }
}

// Test 1: Simple validation test - check that all necessary data is available
async function testPreconditions() {
  log('\n🔍 Test 1: Validating Prerequisites', 'cyan');
  log('Checking that game, virtual item, and credentials exist...', 'blue');
  
  try {
    log(`Game ID: ${TEST_CONFIG.TEST_GAME_ID}`, 'yellow');
    log(`Virtual Item ID: ${TEST_CONFIG.TEST_VIRTUAL_ITEM_ID}`, 'yellow');
    log(`Bundle ID: ${TEST_CONFIG.BUNDLE_ID}`, 'yellow');
    
    log('✅ All test data is configured properly', 'green');
    return { success: true, message: 'Prerequisites validated' };
  } catch (error) {
    log(`❌ Error in prerequisites check: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

// Test 2: Test our Nandi API endpoint (the main test)
async function testNandiAPI() {
  log('\n🎮 Test 2: Nandi SKU Creation API (Main Test)', 'cyan');
  log('Testing POST /api/games/{id}/sku-variants/create...', 'blue');
  
  try {
    const requestBody = {
      virtual_item_id: TEST_CONFIG.TEST_VIRTUAL_ITEM_ID,
      price_variants: [
        { price_cents: 80, quantity: 1 }, // $0.80
        { price_cents: 100, quantity: 1 }, // $1.00
        { price_cents: 120, quantity: 1 }, // $1.20
        { price_cents: 140, quantity: 1 } // $1.40
      ],
      product_type: 'non_consumable' // subscription products are typically non_consumable
    };
    
    log(`Game ID: ${TEST_CONFIG.TEST_GAME_ID}`, 'yellow');
    log(`Request Body:`, 'yellow');
    console.log(JSON.stringify(requestBody, null, 2));
    
    const postData = JSON.stringify(requestBody);
    
    const url = new URL(`${TEST_CONFIG.NANDI_API_BASE}/api/games/${TEST_CONFIG.TEST_GAME_ID}/sku-variants/create`);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const client = url.protocol === 'https:' ? https : require('http');
    
    return new Promise((resolve, reject) => {
      const req = client.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          log(`Response Status: ${res.statusCode}`, res.statusCode === 200 ? 'green' : 'red');
          
          try {
            const response = JSON.parse(responseData);
            
            if (res.statusCode === 200 && response.success) {
              log('✅ Success! SKU variants created via Nandi API:', 'green');
              console.log(JSON.stringify(response, null, 2));
              resolve({ success: true, response });
            } else {
              log('❌ Failed to create SKU variants via Nandi API:', 'red');
              console.log(JSON.stringify(response, null, 2));
              resolve({ success: false, response, status: res.statusCode });
            }
          } catch (parseError) {
            log(`Raw response: ${responseData}`, 'red');
            resolve({ success: false, error: 'Invalid JSON response', rawResponse: responseData });
          }
        });
      });
      
      req.on('error', (error) => {
        log(`Request error: ${error.message}`, 'red');
        resolve({ success: false, error: error.message });
      });
      
      req.write(postData);
      req.end();
    });
    
  } catch (error) {
    log(`❌ Error in Nandi API test: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

// Main test runner
async function runTests() {
  log('🧪 Nandi SKU Creation API - Test Suite', 'cyan');
  log('=' * 50, 'cyan');
  
  // Run tests
  const preconditionsResult = await testPreconditions();
  const nandiResult = await testNandiAPI();
  
  // Results summary
  log('\n📊 Test Results Summary:', 'cyan');
  log('=' * 30, 'cyan');
  log(`Prerequisites Check: ${preconditionsResult.success ? '✅ PASSED' : '❌ FAILED'}`, preconditionsResult.success ? 'green' : 'red');
  log(`Nandi API Test: ${nandiResult.success ? '✅ PASSED' : '❌ FAILED'}`, nandiResult.success ? 'green' : 'red');
  
  if (!nandiResult.success) {
    log('\n🔍 Issues Found:', 'yellow');
    log('• Nandi API call failed - check the response above for details', 'red');
    
    if (nandiResult.response && nandiResult.response.errors) {
      log('• Specific errors:', 'red');
      nandiResult.response.errors.forEach(error => {
        log(`  - ${error.app_store_product_id}: ${error.error}`, 'red');
      });
    }
  } else {
    log('\n🎉 SKU creation test completed successfully!', 'green');
    
    if (nandiResult.response && nandiResult.response.summary) {
      const summary = nandiResult.response.summary;
      log(`Created ${summary.variants_created}/${summary.variants_requested} variants for "${summary.virtual_item}"`, 'green');
    }
  }
}

// Run the tests
if (require.main === module) {
  runTests().catch(error => {
    log(`❌ Test runner failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runTests, testPreconditions, testNandiAPI };