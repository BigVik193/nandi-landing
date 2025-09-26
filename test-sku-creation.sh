#!/bin/bash

# Apple App Store Connect API - SKU Creation Test Script
# 
# This script provides curl commands to test:
# 1. Direct Apple App Store Connect API calls
# 2. Nandi API SKU creation endpoint
#
# Usage: chmod +x test-sku-creation.sh && ./test-sku-creation.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration - UPDATE THESE VALUES
APPLE_JWT_TOKEN="your-jwt-token-here"  # Generate using your P8 key
APPLE_APP_ID="your-apple-app-id"
BUNDLE_ID="com.vikrambattalapalli.pasteman-app"
NANDI_API_BASE="http://localhost:3000"  # or your deployed URL
# Real data from Supabase
TEST_GAME_ID="75b0e38d-1a4f-4722-be0e-9ecbc9155930"  # pasteman game
TEST_VIRTUAL_ITEM_ID="d0923341-c0ae-48b6-bdf0-3a1ca2159bd2"  # pro subscription

echo -e "${CYAN}🧪 Apple App Store Connect API - SKU Creation Test Suite${NC}"
echo -e "${CYAN}============================================================${NC}"

# Test 1: Direct Apple API
echo -e "\n${CYAN}🍎 Test 1: Direct Apple App Store Connect API Call${NC}"

if [[ "$APPLE_JWT_TOKEN" == "your-jwt-token-here" ]]; then
    echo -e "${YELLOW}⚠️  WARNING: Please update APPLE_JWT_TOKEN with your actual JWT token${NC}"
    echo -e "${YELLOW}⚠️  Skipping direct Apple API test${NC}"
    echo -e "\n${BLUE}To get a JWT token, use:${NC}"
    echo "node -e \"
const { SignJWT, importPKCS8 } = require('jose');
(async () => {
  const privateKey = \`-----BEGIN PRIVATE KEY-----
YOUR_P8_KEY_CONTENT_HERE
-----END PRIVATE KEY-----\`;
  
  const privateKeyObject = await importPKCS8(privateKey, 'ES256');
  
  const jwt = await new SignJWT({
    iss: 'YOUR_ISSUER_ID',
    aud: 'appstoreconnect-v1'
  })
    .setProtectedHeader({ alg: 'ES256', kid: 'YOUR_KEY_ID', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('20m')
    .sign(privateKeyObject);
  
  console.log(jwt);
})();
\""
else
    echo -e "${BLUE}Testing POST /v2/inAppPurchases with correct structure...${NC}"
    
    # Generate unique product ID
    TIMESTAMP=$(date +%s)
    PRODUCT_ID="${BUNDLE_ID}.test_${TIMESTAMP}"
    
    echo -e "${YELLOW}Product ID: ${PRODUCT_ID}${NC}"
    
    # Create request body
    REQUEST_BODY=$(cat <<EOF
{
  "data": {
    "type": "inAppPurchases",
    "attributes": {
      "name": "Test In-App Purchase ${TIMESTAMP}",
      "productId": "${PRODUCT_ID}",
      "inAppPurchaseType": "CONSUMABLE",
      "reviewNote": "Auto-generated test SKU via Nandi API test script"
    },
    "relationships": {
      "app": {
        "data": {
          "type": "apps",
          "id": "${APPLE_APP_ID}"
        }
      }
    }
  }
}
EOF
    )
    
    echo -e "${YELLOW}Request Body:${NC}"
    echo "${REQUEST_BODY}" | jq '.' 2>/dev/null || echo "${REQUEST_BODY}"
    
    echo -e "\n${BLUE}Making request to Apple API...${NC}"
    
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
      "https://api.appstoreconnect.apple.com/v2/inAppPurchases" \
      -H "Authorization: Bearer ${APPLE_JWT_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "${REQUEST_BODY}")
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')
    
    echo -e "${YELLOW}Response Status: ${HTTP_CODE}${NC}"
    
    if [[ "$HTTP_CODE" == "201" ]]; then
        echo -e "${GREEN}✅ Success! In-app purchase created:${NC}"
        echo "${RESPONSE_BODY}" | jq '.' 2>/dev/null || echo "${RESPONSE_BODY}"
    else
        echo -e "${RED}❌ Failed to create in-app purchase:${NC}"
        echo "${RESPONSE_BODY}" | jq '.' 2>/dev/null || echo "${RESPONSE_BODY}"
    fi
fi

# Test 2: Nandi API
echo -e "\n${CYAN}🎮 Test 2: Nandi SKU Creation API${NC}"
echo -e "${BLUE}Testing POST /api/games/{id}/sku-variants/create...${NC}"

echo -e "${YELLOW}Game ID: ${TEST_GAME_ID}${NC}"

# Create Nandi API request body
NANDI_REQUEST_BODY=$(cat <<EOF
{
  "virtual_item_id": "${TEST_VIRTUAL_ITEM_ID}",
  "price_variants": [
    { "price_cents": 80, "quantity": 1 },
    { "price_cents": 100, "quantity": 1 },
    { "price_cents": 120, "quantity": 1 },
    { "price_cents": 140, "quantity": 1 }
  ],
  "product_type": "non_consumable"
}
EOF
)

echo -e "${YELLOW}Request Body:${NC}"
echo "${NANDI_REQUEST_BODY}" | jq '.' 2>/dev/null || echo "${NANDI_REQUEST_BODY}"

echo -e "\n${BLUE}Making request to Nandi API...${NC}"

NANDI_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "${NANDI_API_BASE}/api/games/${TEST_GAME_ID}/sku-variants/create" \
  -H "Content-Type: application/json" \
  -d "${NANDI_REQUEST_BODY}")

NANDI_HTTP_CODE=$(echo "$NANDI_RESPONSE" | tail -n1)
NANDI_RESPONSE_BODY=$(echo "$NANDI_RESPONSE" | sed '$d')

echo -e "${YELLOW}Response Status: ${NANDI_HTTP_CODE}${NC}"

if [[ "$NANDI_HTTP_CODE" == "200" ]]; then
    SUCCESS=$(echo "${NANDI_RESPONSE_BODY}" | jq -r '.success // false' 2>/dev/null || echo "false")
    if [[ "$SUCCESS" == "true" ]]; then
        echo -e "${GREEN}✅ Success! SKU variants created via Nandi API:${NC}"
        echo "${NANDI_RESPONSE_BODY}" | jq '.' 2>/dev/null || echo "${NANDI_RESPONSE_BODY}"
    else
        echo -e "${RED}❌ Nandi API returned success=false:${NC}"
        echo "${NANDI_RESPONSE_BODY}" | jq '.' 2>/dev/null || echo "${NANDI_RESPONSE_BODY}"
    fi
else
    echo -e "${RED}❌ Failed to create SKU variants via Nandi API:${NC}"
    echo "${NANDI_RESPONSE_BODY}" | jq '.' 2>/dev/null || echo "${NANDI_RESPONSE_BODY}"
fi

echo -e "\n${CYAN}📊 Test Complete!${NC}"

# Optional: Test the GET endpoint to verify created SKUs
if [[ "$NANDI_HTTP_CODE" == "200" ]]; then
    echo -e "\n${CYAN}🔍 Bonus: Testing GET endpoint to verify created SKUs${NC}"
    
    GET_RESPONSE=$(curl -s -w "\n%{http_code}" \
      "${NANDI_API_BASE}/api/games/${TEST_GAME_ID}/sku-variants?virtual_item_id=${TEST_VIRTUAL_ITEM_ID}")
    
    GET_HTTP_CODE=$(echo "$GET_RESPONSE" | tail -n1)
    GET_RESPONSE_BODY=$(echo "$GET_RESPONSE" | sed '$d')
    
    if [[ "$GET_HTTP_CODE" == "200" ]]; then
        echo -e "${GREEN}✅ Successfully retrieved SKU variants:${NC}"
        echo "${GET_RESPONSE_BODY}" | jq '.virtual_items[0].variants | length' 2>/dev/null && \
        echo "${GET_RESPONSE_BODY}" | jq '.virtual_items[0].variants[] | {id, app_store_product_id, price_usd, quantity, status}' 2>/dev/null || \
        echo "${GET_RESPONSE_BODY}"
    else
        echo -e "${YELLOW}⚠️  Could not retrieve created SKU variants:${NC}"
        echo "${GET_RESPONSE_BODY}"
    fi
fi

echo -e "\n${BLUE}💡 Tips:${NC}"
echo "1. Update the configuration variables at the top of this script with your actual values"
echo "2. Make sure your Nandi API server is running on ${NANDI_API_BASE}"
echo "3. Ensure you have valid Apple Store credentials configured in your database"
echo "4. Check the Nandi API logs for detailed error information if requests fail"