const songList = [
  {
      name: "Fade",
      artist: "Alan Walker",
      imageSrc: "img/bild1.jpg",
      soundSrc: "audio/Alan Walker - Fade.mp3"
  },
  {
      name: "Arc",
      artist: "NCS",
      imageSrc: "img/bild2.jpg",
      soundSrc: "audio/NCS - Ark.mp3"
  },
  {
      name: "Weapon",
      artist: "M4SONIC",
      imageSrc: "img/bild3.jpg",
      soundSrc: "audio/M4SONIC - Weapon.mp3"
  },
];

let currentSongIndex = 0;
const audioPlayer = document.getElementById('audio-player');
const albumCover = document.getElementById('album-cover');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const progressBar = document.getElementById('progress-bar');
const timerNow = document.getElementById('timer-now');
const timerTotal = document.getElementById('timer-total');
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const volumeControl = document.getElementById('volume-control');
const volumePercentage = document.getElementById('volume-percentage');
const volumeIcon = document.getElementById('volume-icon');
let lastVolume = 0.5;
let isShuffle = false;  
let shuffledList = [];

// Load song function
function loadSong(songIndex) {
  const song = songList[songIndex];
  audioPlayer.src = song.soundSrc;
  albumCover.src = song.imageSrc;
  songArtist.textContent = song.artist;

  // Reset progress bar and timer
  progressBar.value = 0;
  progressBar.style.backgroundSize = '0% 100%';
  timerNow.textContent = '0:00';
  timerTotal.textContent = '0:00';
  audioPlayer.currentTime = 0;

  // Update Now Playing text
  const nowPlayingText = document.getElementById('now-playing-text');
  nowPlayingText.textContent = `Now Playing: ${song.name}`;

  audioPlayer.load();
  togglePlayPauseButtons();
}

// Play/pause toggle button
function togglePlayPauseButtons() {
  if (audioPlayer.paused) {
      playButton.style.display = 'inline';
      pauseButton.style.display = 'none';
  } else {
      playButton.style.display = 'none';
      pauseButton.style.display = 'inline';
  }
}

// Toggle play/pause function
function togglePlayPause() {
  if (audioPlayer.paused) {
      audioPlayer.play().then(() => {
          togglePlayPauseButtons();  
      }).catch(error => {
          console.error('Playback failed:', error);
      });
  } else {
      audioPlayer.pause();
      togglePlayPauseButtons();  
  }
}

// Play button event listener 
playButton.addEventListener('click', togglePlayPause);

// Pause button event listener
pauseButton.addEventListener('click', togglePlayPause);


// Stop the music
function stopAudio() {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  togglePlayPauseButtons();
}

document.getElementById('stop-button').addEventListener('click', stopAudio);

// Toggle between shuffle and order modes when icons are clicked
function toggleShuffleOrder() {
  isShuffle = !isShuffle; 

  if (isShuffle) {
    // Enable shuffle mode
    shuffledList = [...songList];  
    for (let i = shuffledList.length - 1; i > 0; i--) {  
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
    }
    currentSongIndex = 0;  
    loadSong(currentSongIndex);  
  } else {
    // Disable shuffle mode (back to order mode)
    shuffledList = [];  
    currentSongIndex = 0;  
    loadSong(currentSongIndex);  
  }

  updateShuffleOrderIcons();  
}

// Update shuffle icon and order icon
function updateShuffleOrderIcons() {
  const shuffleButton = document.getElementById('shuffle-button');
  const orderButton = document.getElementById('order-button');

  if (isShuffle) {
    shuffleButton.style.display = 'inline';  
    orderButton.style.display = 'none';      
    shuffleButton.classList.add('active');   
  } else {
    shuffleButton.style.display = 'none';    
    orderButton.style.display = 'inline';    
    shuffleButton.classList.remove('active');
  }
}

// Event listeners for shuffle and order icons
document.getElementById('shuffle-button').addEventListener('click', toggleShuffleOrder);
document.getElementById('order-button').addEventListener('click', toggleShuffleOrder);

// If the next song is in shuffle mode
function nextSong() {
  if (isShuffle) {
    currentSongIndex = (currentSongIndex + 1) % shuffledList.length;
    loadSong(currentSongIndex);
  } else {
    currentSongIndex = (currentSongIndex + 1) % songList.length;
    loadSong(currentSongIndex);
  }
  audioPlayer.play().then(() => {
    togglePlayPauseButtons();
  }).catch(error => {
    console.error('Playback failed:', error);
  });
}

// Play previous song
function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songList.length) % songList.length;
  loadSong(currentSongIndex);
}
// Function to format time 
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update progress bar and time
function updateProgressBar() {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.value = progress;

  timerNow.textContent = formatTime(audioPlayer.currentTime);
}

// Set progress bar position
function setProgress() {
  const newTime = (progressBar.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = newTime;
}

// Update duration
function updateDuration() {
  const totalDuration = audioPlayer.duration;
  timerTotal.textContent = formatTime(totalDuration);
}

// Volume control event listener
volumeControl.addEventListener('input', function () {
  const volume = volumeControl.value;
  audioPlayer.volume = volume;
  volumePercentage.textContent = `${Math.floor(volume * 100)}%`;
  updateVolumeIcon(volume);
});

// Mute and restore volume
volumeIcon.addEventListener('click', function () {
  if (audioPlayer.volume > 0) {
      lastVolume = audioPlayer.volume;
      audioPlayer.volume = 0;
      volumeControl.value = 0;
      volumePercentage.textContent = '0%';
      updateVolumeIcon(0);
  } else {
      audioPlayer.volume = lastVolume;
      volumeControl.value = lastVolume;
      volumePercentage.textContent = `${Math.floor(lastVolume * 100)}%`;
      updateVolumeIcon(lastVolume);
  }
});

// Update volume icon based on volume level
function updateVolumeIcon(volume) {
  if (volume == 0) {
      volumeIcon.classList.remove('fa-volume-low', 'fa-volume-high');
      volumeIcon.classList.add('fa-volume-xmark');
  } else if (volume > 0 && volume <= 0.5) {
      volumeIcon.classList.remove('fa-volume-xmark', 'fa-volume-high');
      volumeIcon.classList.add('fa-volume-low');
  } else {
      volumeIcon.classList.remove('fa-volume-xmark', 'fa-volume-low');
      volumeIcon.classList.add('fa-volume-high');
  }
}

// Function to generate playlist 
function generatePlaylist() {
  const playlistBody = document.getElementById('playlist-body');
  playlistBody.innerHTML = '';

  // Loop through the song list 
  songList.forEach((song, index) => {
    const songRow = document.createElement('div');
    songRow.classList.add('playlist-row');

    // Create spans for song name, artist, and duration
    const nameSpan = document.createElement('span');
    nameSpan.textContent = song.name;
    const artistSpan = document.createElement('span');
    artistSpan.textContent = song.artist;
    const durationSpan = document.createElement('span');
    durationSpan.textContent = 'Loading...'; 

    songRow.appendChild(nameSpan);
    songRow.appendChild(artistSpan);
    songRow.appendChild(durationSpan);
    playlistBody.appendChild(songRow);

    // Load the song in the existing audioPlayer to fetch its duration
    const tempAudio = new Audio(song.soundSrc);
    tempAudio.addEventListener('loadedmetadata', function () {
      durationSpan.textContent = formatTime(tempAudio.duration);
    });
  });
}

// Call the function to generate the playlist when the page is loaded
document.addEventListener('DOMContentLoaded', generatePlaylist);
// Initialize 
document.addEventListener('DOMContentLoaded', function () {
  loadSong(currentSongIndex);
  audioPlayer.volume = 0.5;
  volumeControl.value = 0.5;
  volumePercentage.textContent = '50%';
  updateVolumeIcon(audioPlayer.volume);

  progressBar.value = 0;             
  progressBar.style.backgroundSize = '0% 100%'; 
  timerNow.textContent = '0:00'; 
  timerTotal.textContent = '0:00'; 

  // Add event listener for progress and duration updates
  audioPlayer.addEventListener('loadedmetadata', function() {
      progressBar.value = 0;             
      progressBar.style.backgroundSize = '0% 100%';  
      const minutes = Math.floor(audioPlayer.duration / 60);
      const seconds = Math.floor(audioPlayer.duration % 60);
      timerTotal.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; 
      updateDuration();
  });

  // Update progress bar as and duration
  audioPlayer.addEventListener('timeupdate', updateProgressBar);
  progressBar.addEventListener('input', setProgress);
  audioPlayer.addEventListener('loadedmetadata', updateDuration);

  // Automatically play the next song when current one ends
  audioPlayer.addEventListener('ended', function () {
    nextSong();
  });

});

// Event listeners 
document.getElementById('next-button').addEventListener('click', nextSong);
document.getElementById('prev-button').addEventListener('click', prevSong);


