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

  // --- QURAN SURAH SELECTOR ---
  const surahSelect = document.getElementById('surah-select');
  const surahReader = document.getElementById('surah-reader');
  const readerTitle = document.getElementById('reader-surah-title');
  const readerMeta = document.getElementById('reader-surah-meta');
  const bismillahContainer = document.getElementById('bismillah-text');
  const versesContainer = document.getElementById('verses-container');

  let allSurahs = [];

  // Fetch all Surahs from the API to populate the select list
  async function fetchSurahList() {
    try {
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await response.json();
      allSurahs = data.data;
      populateSurahDropdown(allSurahs);
    } catch (error) {
      console.error('Error fetching Surahs:', error);
      if (surahSelect) {
        surahSelect.innerHTML = '<option value="" disabled selected>Error loading Surahs. Please refresh.</option>';
      }
    }
  }

  // Populate select dropdown options
  function populateSurahDropdown(surahs) {
    if (!surahSelect) return;
    
    surahSelect.innerHTML = '';
    
    // Add default initial instruction option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = '-- Click to Select a Surah --';
    surahSelect.appendChild(defaultOption);

    surahs.forEach(surah => {
      const option = document.createElement('option');
      option.value = surah.number;
      option.textContent = `${surah.number}. ${surah.englishName} (${surah.name})`;
      surahSelect.appendChild(option);
    });

    // Add change listener to fetch and display the selected Surah
    surahSelect.addEventListener('change', (e) => {
      const selectedNumber = parseInt(e.target.value);
      const surah = surahs.find(s => s.number === selectedNumber);
      if (surah) {
        loadSurahContent(surah);
      }
    });
  }

  // Fetch and display Surah verses
  async function loadSurahContent(surah) {
    if (!surahReader) return;

    surahReader.style.display = 'block';
    readerTitle.textContent = `${surah.number}. ${surah.englishName} (${surah.name})`;
    readerMeta.textContent = `${surah.revelationType} • ${surah.numberOfAyahs} Verses`;
    
    // Hide bismillah for Surah 9 (At-Tawbah) and Surah 1 (Al-Fatihah)
    if (surah.number === 1 || surah.number === 9) {
      bismillahContainer.style.display = 'none';
    } else {
      bismillahContainer.style.display = 'block';
    }

    versesContainer.innerHTML = '<div class="loading-spinner">Loading verses...</div>';

    // Smooth scroll down to the reader
    surahReader.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      // Fetch Uthmani script and Sahih International translation in one go
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,en.sahih`);
      const data = await response.json();
      
      const arabicVerses = data.data[0].ayahs;
      const englishVerses = data.data[1].ayahs;

      versesContainer.innerHTML = '';
      
      arabicVerses.forEach((ayah, index) => {
        const verseEl = document.createElement('div');
        verseEl.className = 'verse-item';
        
        let arabicText = ayah.text;
        
        // Remove Bismillah from first verse if it starts with it and it's not Surah 1
        if (index === 0 && surah.number !== 1 && arabicText.startsWith('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')) {
          arabicText = arabicText.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '').trim();
        }

        verseEl.innerHTML = `
          <div class="verse-meta">Verse ${ayah.numberInSurah}</div>
          <div class="verse-arabic">${arabicText} <span>(${ayah.numberInSurah})</span></div>
          <div class="verse-translation">${englishVerses[index].text}</div>
        `;
        versesContainer.appendChild(verseEl);
      });
    } catch (error) {
      console.error('Error fetching verses:', error);
      versesContainer.innerHTML = '<div class="error-text">Failed to load verses. Please try again.</div>';
    }
  }

  // Initial fetch
  if (surahSelect) {
    fetchSurahList();
  }
});
