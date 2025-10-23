// QTFund Frontend Application
console.log('QTFund Frontend starting...');

// Simple router for handling different pages
class SimpleRouter {
    constructor() {
        this.routes = {};
        this.init();
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    init() {
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Handle initial load - check if DOM is already ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.handleRoute();
            });
        } else {
            // DOM is already ready, execute immediately
            this.handleRoute();
        }
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        const handler = this.routes[path] || this.routes['/'];

        if (handler) {
            handler();
        } else {
            this.show404();
        }
    }

    show404() {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" onclick="router.navigate('/'); return false;">Go Home</a>
            </div>
        `;
    }
}

// Create router instance
const router = new SimpleRouter();

// Login page
function showLoginPage() {
    document.body.innerHTML = `
        <div style="max-width: 400px; margin: 100px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h2 style="text-align: center; color: #333;">QTFund Login</h2>
            <form id="loginForm" style="margin-top: 20px;">
                <div style="margin-bottom: 15px;">
                    <label for="username" style="display: block; margin-bottom: 5px;">Username:</label>
                    <input type="text" id="username" name="username" required
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="password" style="display: block; margin-bottom: 5px;">Password:</label>
                    <input type="password" id="password" name="password" required
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; box-sizing: border-box;">
                </div>
                <button type="submit" style="width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">
                    Login
                </button>
            </form>
            <div id="loginMessage" style="margin-top: 15px; text-align: center;"></div>
            <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
                Default: admin / admin123
            </div>
        </div>
    `;

    // Handle login form submission
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('loginMessage');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    use_cookie: true
                }),
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.innerHTML = '<span style="color: green;">Login successful! Redirecting...</span>';

                // Get redirect parameter or default to dashboard
                const urlParams = new URLSearchParams(window.location.search);
                const redirectTo = urlParams.get('redirect') || '/dashboard';

                setTimeout(() => {
                    router.navigate(redirectTo);
                }, 1000);
            } else {
                messageDiv.innerHTML = '<span style="color: red;">Login failed: ' + (data.error || 'Unknown error') + '</span>';
            }
        } catch (error) {
            messageDiv.innerHTML = '<span style="color: red;">Login failed: Network error</span>';
            console.error('Login error:', error);
        }
    });
}

// Dashboard page
function showDashboard() {
    document.body.innerHTML = `
        <div style="max-width: 800px; margin: 50px auto; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
                <h1 style="color: #333; margin: 0;">QTFund Dashboard</h1>
                <button onclick="logout()" style="padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">
                    Logout
                </button>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; color: #333;">Welcome to QTFund!</h3>
                <p>You have successfully logged in. This is a protected page that requires authentication.</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h4 style="margin-top: 0; color: #333;">Test API Call</h4>
                    <button onclick="testApiCall()" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        Test Protected API
                    </button>
                    <div id="apiResult" style="margin-top: 10px; font-size: 14px;"></div>
                </div>
                <div style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h4 style="margin-top: 0; color: #333;">User Info</h4>
                    <p>Username: <span id="userInfo">Loading...</span></p>
                    <button onclick="checkAuthStatus()" style="padding: 8px 16px; background: #17a2b8; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        Refresh Status
                    </button>
                </div>
            </div>
        </div>
    `;

    // Load user info on page load
    checkAuthStatus();
}

// Home page
function showHomePage() {
    document.body.innerHTML = `
        <div style="max-width: 600px; margin: 100px auto; text-align: center; padding: 20px;">
            <h1 style="color: #333;">Welcome to QTFund</h1>
            <p style="font-size: 18px; color: #666; margin: 30px 0;">A secure financial management system</p>
            <div style="margin: 30px 0;">
                <button onclick="router.navigate('/login'); return false;"
                        style="padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 0 10px;">
                    Login
                </button>
                <button onclick="router.navigate('/dashboard'); return false;"
                        style="padding: 12px 24px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 0 10px;">
                    Dashboard
                </button>
            </div>
        </div>
    `;
}

// Global functions
window.logout = async function() {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
        });
        router.navigate('/login');
    } catch (error) {
        console.error('Logout error:', error);
        router.navigate('/login');
    }
}

window.testApiCall = async function() {
    const resultDiv = document.getElementById('apiResult');
    resultDiv.innerHTML = 'Testing...';

    try {
        const response = await fetch('/api/users');
        const data = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = '<span style="color: green;">API call successful!</span>';
        } else {
            resultDiv.innerHTML = '<span style="color: orange;">API returned: ' + response.status + ' - ' + (data.message || data.error || 'Unknown error') + '</span>';
        }
    } catch (error) {
        resultDiv.innerHTML = '<span style="color: red;">API call failed: ' + error.message + '</span>';
    }
}

window.checkAuthStatus = async function() {
    const userInfoSpan = document.getElementById('userInfo');
    if (userInfoSpan) {
        userInfoSpan.textContent = 'Checking...';

        try {
            const response = await fetch('/api/users');
            if (response.ok) {
                userInfoSpan.innerHTML = '<span style="color: green;">Authenticated</span>';
            } else {
                userInfoSpan.innerHTML = '<span style="color: red;">Not authenticated</span>';
            }
        } catch (error) {
            userInfoSpan.innerHTML = '<span style="color: red;">Error checking status</span>';
        }
    }
}

// Set up routes
router.addRoute('/', showHomePage);
router.addRoute('/login', showLoginPage);
router.addRoute('/dashboard', showDashboard);

// Make router globally available
window.router = router;

// Execute route handling immediately when script loads
router.handleRoute();

console.log('QTFund Frontend ready!');