import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginCard = document.getElementById('login-card');
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
        loginCard.classList.add('login-success-zoom');
        
        setTimeout(() => {
          window.location.replace('/index.html');
        }, 300);
      } else {
        // Failure
        btnText.style.display = 'inline-block';
        spinner.style.display = 'none';
        submitBtn.disabled = false;
        
        errorMessage.style.display = 'block';
        passwordInput.value = '';
        
        // Shake animation
        loginCard.classList.add('shake-card');
        setTimeout(() => {
          loginCard.classList.remove('shake-card');
        }, 500);
      }
    }, 600); // Small delay to show the nice spinner loading feel
  });
});
