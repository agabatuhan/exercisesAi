$headers = @{ "Content-Type" = "application/json" }
$body = @{ username = "testdebugwin2"; email = "testdebugwin2@example.com"; password = "password123" }

# Register
try {
    echo "Registering..."
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/register" -Method Post -Headers $headers -Body ($body | ConvertTo-Json)
    echo "Register Response:"
    $response | ConvertTo-Json
} catch {
    echo "Register Error:"
    $_.Exception.Response
}

# Login
echo "Logging in..."
$bodyLogin = @{ email = "testdebugwin2@example.com"; password = "password123" }
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/login" -Method Post -Headers $headers -Body ($bodyLogin | ConvertTo-Json)
    echo "Login Response:"
    $response | ConvertTo-Json
    
    $token = $response.token
    echo "Token: $token"

    if ($token) {
        # Get Todos
        echo "Getting Todos..."
        $headersAuth = @{ "Authorization" = "Bearer $token" }
        $todos = Invoke-RestMethod -Uri "http://localhost:3000/api/todos" -Method Get -Headers $headersAuth
        echo "Todos Response:"
        $todos | ConvertTo-Json -Depth 5
    } else {
        echo "No token received."
    }
} catch {
    echo "Login/Next Error:"
    $_.Exception.Response
}
