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
  songTitle.textContent = song.name;
  songArtist.textContent = song.artist;

  // Reset progress bar and timer
  progressBar.value = 0;
  timerNow.textContent = '0:00';
  timerTotal.textContent = '0:00';
  audioPlayer.currentTime = 0;

  // Update Now Playing text
  const nowPlayingText = document.getElementById('now-playing-text');
  nowPlayingText.textContent = `Now Playing: ${song.name}`;

  // Load and play the song after metadata is loaded
  audioPlayer.load();
  audioPlayer.addEventListener('loadedmetadata', function () {
      audioPlayer.play();
      togglePlayPauseButtons();
      updateDuration();
  });
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
      audioPlayer.play();
  } else {
      audioPlayer.pause();
  }
  togglePlayPauseButtons();
}

// Stop the music
function stopAudio() {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  togglePlayPauseButtons();

  document.getElementById('stop-button').addEventListener('click', stopAudio);
}


// Play next song
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songList.length;
  loadSong(currentSongIndex);
}

// Shuffle the song list
function shuffleSongs() {
  isShuffle = !isShuffle; 
  if (isShuffle) {
      shuffledList = [...songList];  // Copy the songlist
      for (let i = shuffledList.length - 1; i > 0; i--) {  
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
      }
      currentSongIndex = 0; 
      loadSong(currentSongIndex); 
  } else {
      shuffledList = [];  
      currentSongIndex = 0; 
      loadSong(currentSongIndex); 
  }
  updateShuffleButton();  
}

// Update shuffle icon
function updateShuffleButton() {
  const shuffleButton = document.getElementById('shuffle-button');
  if (isShuffle) {
      shuffleButton.classList.add('active');  
  } else {
      shuffleButton.classList.remove('active');
  }
}

// if the next song is in shuffle mode
function nextSong() {
  if (isShuffle) {
      currentSongIndex = (currentSongIndex + 1) % shuffledList.length;
      loadSong(currentSongIndex);
  } else {
      currentSongIndex = (currentSongIndex + 1) % songList.length;
      loadSong(currentSongIndex);
  }
}

// Play previous song
function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songList.length) % songList.length;
  loadSong(currentSongIndex);
}

// Update progress bar and time
function updateProgressBar() {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.value = progress;

  const minutes = Math.floor(audioPlayer.currentTime / 60);
  const seconds = Math.floor(audioPlayer.currentTime % 60);
  timerNow.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Set progress bar position
function setProgress() {
  const newTime = (progressBar.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = newTime;
}

// Update duration
function updateDuration() {
  const minutes = Math.floor(audioPlayer.duration / 60);
  const seconds = Math.floor(audioPlayer.duration % 60);
  timerTotal.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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

// Event listeners for play/pause and control buttons
playButton.addEventListener('click', togglePlayPause);
pauseButton.addEventListener('click', togglePlayPause);
document.getElementById('stop-button').addEventListener('click', stopAudio);
document.getElementById('shuffle-button').addEventListener('click', shuffleSongs);
document.getElementById('next-button').addEventListener('click', nextSong);
document.getElementById('prev-button').addEventListener('click', prevSong);

// Update progress bar as song plays
audioPlayer.addEventListener('timeupdate', updateProgressBar);
audioPlayer.addEventListener('loadedmetadata', updateDuration);
progressBar.addEventListener('input', setProgress);

// Initialize player with the first song
document.addEventListener('DOMContentLoaded', function () {
  loadSong(currentSongIndex);
  audioPlayer.volume = 0.5;
  volumeControl.value = 0.5;
  volumePercentage.textContent = '50%';
  updateVolumeIcon(audioPlayer.volume);
});
