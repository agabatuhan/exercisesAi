
# Register
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testdebug", "email": "testdebug@example.com", "password": "password123"}'

# Login and capture token
echo "Logging in..."
TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "testdebug@example.com", "password": "password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: $TOKEN"

# Get Todos
echo "Getting Todos..."
curl -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer $TOKEN"
