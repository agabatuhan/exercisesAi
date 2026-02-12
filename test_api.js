const baseURL = 'http://localhost:3000';

async function request(method, endpoint, body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = {
        method,
        headers,
    };

    if (body) options.body = JSON.stringify(body);

    try {
        const res = await fetch(`${baseURL}${endpoint}`, options);
        // Log headers for the first request to verify security
        if (endpoint === '/register' && method === 'POST') {
            console.log('Security Headers:', {
                'x-rate-limit-limit': res.headers.get('x-ratelimit-limit'),
                'strict-transport-security': res.headers.get('strict-transport-security'),
                'x-dns-prefetch-control': res.headers.get('x-dns-prefetch-control')
            });
        }
        const data = await res.json();
        return { status: res.status, data };
    } catch (error) {
        console.error(`Error requesting ${endpoint}:`, error.message);
        return { status: 500, error: error.message };
    }
}

async function runTests() {
    console.log('--- Starting Tests ---');

    // 1. Register Admin
    console.log('\n1. Registering Admin...');
    const adminUser = { username: 'admin', email: 'admin@test.com', password: 'password123', role: 'admin' };
    let res = await request('POST', '/register', adminUser);
    console.log('Register Admin:', res.status, res.data);

    // 2. Register Normal User
    console.log('\n2. Registering User...');
    const normalUser = { username: 'user', email: 'user@test.com', password: 'password123', role: 'user' };
    res = await request('POST', '/register', normalUser);
    console.log('Register User:', res.status, res.data);

    // 3. Login Admin
    console.log('\n3. Logging in Admin...');
    res = await request('POST', '/login', { email: adminUser.email, password: adminUser.password });
    const adminToken = res.data.token;
    console.log('Admin Login:', res.status, adminToken ? 'Token received' : 'No token');

    // 4. Login User
    console.log('\n4. Logging in User...');
    res = await request('POST', '/login', { email: normalUser.email, password: normalUser.password });
    const userToken = res.data.token;
    console.log('User Login:', res.status, userToken ? 'Token received' : 'No token');

    if (!adminToken || !userToken) {
        console.error('Failed to login, aborting tests.');
        process.exit(1);
    }

    // 5. User Create Todo
    console.log('\n5. User creating Todo...');
    const todo = { title: 'User Task', description: 'Do something' };
    res = await request('POST', '/todos', todo, userToken);
    console.log('Create Todo:', res.status, res.data);
    const todoId = res.data.id;

    // 6. User Get Todos
    console.log('\n6. User getting Todos...');
    res = await request('GET', '/todos', null, userToken);
    console.log('User Todos:', res.status, `Count: ${res.data.length}`);
    const userSeesOwn = res.data.some(t => t.id === todoId);
    console.log('User sees own todo:', userSeesOwn);

    // 7. Admin Get Todos
    console.log('\n7. Admin getting Todos...');
    res = await request('GET', '/todos', null, adminToken);
    console.log('Admin Todos:', res.status, `Count: ${res.data.length}`);
    const adminSeesUserTodo = res.data.some(t => t.id === todoId);
    console.log('Admin sees user todo:', adminSeesUserTodo);

    // 8. Admin Delete User Todo
    console.log('\n8. Admin deleting User Todo...');
    res = await request('DELETE', `/todos/${todoId}`, null, adminToken);
    console.log('Delete Todo:', res.status, res.data);

    // 9. Verify Deletion
    console.log('\n9. Verifying deletion...');
    res = await request('GET', '/todos', null, adminToken);
    const todoStillExists = res.data.some(t => t.id === todoId);
    console.log('Todo still exists:', todoStillExists);

    // 10. Test XSS Sanitization
    console.log('\n10. Testing XSS Sanitization...');
    const xssTodo = { title: '<script>alert("XSS")</script>Task', description: 'Attempting XSS' };
    res = await request('POST', '/todos', xssTodo, userToken);
    console.log('Create XSS Todo Status:', res.status);
    console.log('Sanitized Title:', res.data.title);
    if (res.data.title === '&lt;script&gt;alert("XSS")&lt;/script&gt;Task') {
        console.log('XSS Protection: SUCCESS');
    } else {
        console.log('XSS Protection: FAILED', res.data.title);
    }

    console.log('\n--- Tests Completed ---');
}

// Wait for server to start
setTimeout(runTests, 2000);
