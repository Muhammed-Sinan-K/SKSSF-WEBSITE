import './style.css';

function init() {
  console.log('Login Script Initialized');
  const loginForm = document.getElementById('login-form');
  const loginCard = document.getElementById('login-card');
  const loginFormContainer = document.getElementById('login-form-container');
  const successScreen = document.getElementById('success-screen');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');
  const submitBtn = document.querySelector('.btn-login-submit');

  // Safety checks to prevent null pointer crashes
  if (!loginForm || !submitBtn || !usernameInput || !passwordInput) {
    console.error('Login elements not found in the DOM.');
    return;
  }

  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.spinner');

  // If already logged in, redirect directly to index.html
  if (localStorage.getItem('skssf_logged_in') === 'true') {
    console.log('User already logged in. Redirecting...');
    window.location.replace('/index.html');
    return;
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submit triggered');
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    console.log('Entered credentials:', { username, password });

    // Trigger loading spinner states
    if (btnText) btnText.style.display = 'none';
    if (spinner) spinner.style.display = 'inline-block';
    submitBtn.disabled = true;
    if (errorMessage) errorMessage.style.display = 'none';

    setTimeout(() => {
      if (username === '4182' && password === '4182') {
        console.log('Authentication successful!');
        // Success
        localStorage.setItem('skssf_logged_in', 'true');
        
        // Premium animation transition
        if (loginFormContainer) {
          loginFormContainer.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          loginFormContainer.style.opacity = '0';
          loginFormContainer.style.transform = 'translateY(-20px)';
        }
        
        setTimeout(() => {
          if (loginFormContainer) loginFormContainer.style.display = 'none';
          if (successScreen) successScreen.style.display = 'block';
          
          // Trigger progress fill
          const progressFill = document.querySelector('.success-progress-fill');
          if (progressFill) {
            setTimeout(() => {
              progressFill.style.width = '100%';
            }, 100);
          }

          setTimeout(() => {
            if (loginCard) {
              loginCard.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
              loginCard.style.transform = 'scale(0.8) translateY(-40px)';
              loginCard.style.opacity = '0';
            }
            
            setTimeout(() => {
              console.log('Redirecting to home page...');
              window.location.replace('/index.html');
            }, 500);
          }, 2000); // Allow 2 seconds for progress bar and checkmark draw
        }, 400);

      } else {
        console.warn('Authentication failed: wrong credentials.');
        // Failure
        if (btnText) btnText.style.display = 'inline-block';
        if (spinner) spinner.style.display = 'none';
        submitBtn.disabled = false;
        
        if (errorMessage) errorMessage.style.display = 'block';
        passwordInput.value = '';
        
        // Shake card animation
        if (loginCard) {
          loginCard.classList.add('shake-card');
          setTimeout(() => {
            loginCard.classList.remove('shake-card');
          }, 500);
        }
      }
    }, 800); // Show loading spinner for build realism
  });
}

// Safe check for DOM ready state
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
