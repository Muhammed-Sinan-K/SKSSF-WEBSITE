import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // --- TASBIH COUNTER LOGIC ---
  const counterVal = document.getElementById('counter-value');
  const counterClickArea = document.getElementById('counter-click-area');
  const resetBtn = document.getElementById('reset-counter-btn');
  const dhikrSelect = document.getElementById('dhikr-preset');
  const customDhikrGroup = document.getElementById('custom-dhikr-group');
  const customDhikrInput = document.getElementById('custom-dhikr-input');
  const activeDhikrText = document.getElementById('active-dhikr-text');
  const counterTarget = document.getElementById('counter-target');
  const soundCheckbox = document.getElementById('sound-enabled');
  const progressFill = document.getElementById('counter-progress');
  const targetValDisplay = document.getElementById('target-value');

  let count = parseInt(localStorage.getItem('tasbih_count') || '0');
  let target = parseInt(localStorage.getItem('tasbih_target') || '33');
  let activeDhikr = localStorage.getItem('tasbih_dhikr') || 'SubhanAllah';

  // Audio Context for instant beep sounds without audio files
  let audioCtx = null;
  function playBeep(freq, duration) {
    if (!soundCheckbox.checked) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio context not allowed yet by browser policies", e);
    }
  }

  function updateCounterUI() {
    if (!counterVal) return;
    counterVal.textContent = count;
    targetValDisplay.textContent = target;
    counterTarget.value = target;
    
    // Update active dhikr label
    if (activeDhikr === 'Custom') {
      activeDhikrText.textContent = customDhikrInput.value || 'My Dhikr';
    } else {
      const option = dhikrSelect.querySelector(`option[value="${activeDhikr}"]`);
      activeDhikrText.textContent = option ? option.textContent : activeDhikr;
    }

    // Progress Bar
    const progress = Math.min((count / target) * 100, 100);
    progressFill.style.width = `${progress}%`;
    
    // Color glow effects when target reached
    if (count >= target) {
      counterClickArea.classList.add('target-reached');
    } else {
      counterClickArea.classList.remove('target-reached');
    }

    // Save to localStorage
    localStorage.setItem('tasbih_count', count);
    localStorage.setItem('tasbih_target', target);
    localStorage.setItem('tasbih_dhikr', activeDhikr);
  }

  // Preset switch
  if (dhikrSelect) {
    dhikrSelect.value = activeDhikr;
    if (activeDhikr === 'Custom') {
      customDhikrGroup.style.display = 'block';
      customDhikrInput.value = localStorage.getItem('tasbih_custom_text') || '';
    }

    dhikrSelect.addEventListener('change', (e) => {
      activeDhikr = e.target.value;
      if (activeDhikr === 'Custom') {
        customDhikrGroup.style.display = 'block';
      } else {
        customDhikrGroup.style.display = 'none';
      }
      updateCounterUI();
    });
  }

  if (customDhikrInput) {
    customDhikrInput.addEventListener('input', (e) => {
      localStorage.setItem('tasbih_custom_text', e.target.value);
      updateCounterUI();
    });
  }

  if (counterTarget) {
    counterTarget.addEventListener('input', (e) => {
      target = parseInt(e.target.value) || 33;
      updateCounterUI();
    });
  }

  // Increment click
  if (counterClickArea) {
    counterClickArea.addEventListener('click', () => {
      count++;
      
      // Ripple animations / scaling effect
      counterClickArea.classList.add('clicked');
      setTimeout(() => counterClickArea.classList.remove('clicked'), 100);

      // Play sound and haptic feedback
      if (count === target) {
        // High pitched double-beep for target completion
        playBeep(880, 0.15);
        setTimeout(() => playBeep(880, 0.15), 200);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      } else {
        // Standard low tick click sound
        playBeep(440, 0.05);
        if (navigator.vibrate) navigator.vibrate(30);
      }

      updateCounterUI();
    });
  }

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset the count?')) {
        count = 0;
        updateCounterUI();
      }
    });
  }

  // Load initial settings
  if (counterVal) {
    updateCounterUI();
  }
});
