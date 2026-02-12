$headers = @{ "Content-Type" = "application/json" }
$body = @{ username = "testdebugwin"; email = "testdebugwin@example.com"; password = "password123" } | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/register" -Method Post -Headers $headers -Body $body -ErrorAction SilentlyContinue

echo "Logging in..."
$bodyLogin = @{ email = "testdebugwin@example.com"; password = "password123" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/login" -Method Post -Headers $headers -Body $bodyLogin

$token = $response.token
echo "Token: $token"

echo "Getting Todos..."
$headersAuth = @{ "Authorization" = "Bearer $token" }
try {
    $todos = Invoke-RestMethod -Uri "http://localhost:3000/api/todos" -Method Get -Headers $headersAuth
    echo "Todos Response:"
    $todos | ConvertTo-Json -Depth 5
} catch {
    echo "Error getting todos:"
    $_.Exception.Response
}
