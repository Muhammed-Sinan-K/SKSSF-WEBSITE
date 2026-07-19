import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginCard = document.getElementById('login-card');
  const loginFormContainer = document.getElementById('login-form-container');
  const successScreen = document.getElementById('success-screen');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');
  const submitBtn = document.querySelector('.btn-login-submit');
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.spinner');

  // If already logged in, redirect directly to index.html
  if (localStorage.getItem('skssf_logged_in') === 'true') {
    window.location.replace('/index.html');
    return;
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Trigger loading spinner states
    btnText.style.display = 'none';
    spinner.style.display = 'inline-block';
    submitBtn.disabled = true;
    errorMessage.style.display = 'none';

    setTimeout(() => {
      if (username === '4182' && password === '4182') {
        // Success
        localStorage.setItem('skssf_logged_in', 'true');
        
        // Premium animation transition
        loginFormContainer.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        loginFormContainer.style.opacity = '0';
        loginFormContainer.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
          loginFormContainer.style.display = 'none';
          successScreen.style.display = 'block';
          
          // Trigger progress fill
          const progressFill = document.querySelector('.success-progress-fill');
          setTimeout(() => {
            progressFill.style.width = '100%';
          }, 100);

          setTimeout(() => {
            loginCard.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
            loginCard.style.transform = 'scale(0.8) translateY(-40px)';
            loginCard.style.opacity = '0';
            
            setTimeout(() => {
              window.location.replace('/index.html');
            }, 500);
          }, 2000); // Allow 2 seconds for progress bar and checkmark draw
        }, 400);

      } else {
        // Failure
        btnText.style.display = 'inline-block';
        spinner.style.display = 'none';
        submitBtn.disabled = false;
        
        errorMessage.style.display = 'block';
        passwordInput.value = '';
        
        // Shake card animation
        loginCard.classList.add('shake-card');
        setTimeout(() => {
          loginCard.classList.remove('shake-card');
        }, 500);
      }
    }, 800); // Show loading spinner for build realism
  });
});
