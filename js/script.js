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
const playlistContainer = document.getElementById('playlist-container');
const togglePlaylistButton = document.getElementById('toggle-playlist-button');

let lastVolume = 0.5;
let isShuffle = false;  
let shuffledList = [];

// Load song function
function loadSong(songIndex) {
  const song = isShuffle ? shuffledList[songIndex] : songList[songIndex];
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
  audioPlayer.addEventListener('loadedmetadata', function () {
    updateProgressBar();   
    updateDuration();      
  });

  togglePlayPauseButtons();
  generatePlaylist();
}

// Stop the music
function stopAudio() {
  currentSongIndex = 0;
  loadSong(currentSongIndex);

  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  togglePlayPauseButtons();
}

document.getElementById('stop-button').addEventListener('click', stopAudio);

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
// Toggle between shuffle and order modes when icons are clicked
function toggleShuffleOrder() {
  isShuffle = !isShuffle;

  if (isShuffle) {
    shuffledList = [...songList];
    for (let i = shuffledList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
    }
  }

  currentSongIndex = 0;  
  loadSong(currentSongIndex);  
  updateShuffleOrderIcons();  
}

// Update shuffle icon and order icon
function updateShuffleOrderIcons() {
  const shuffleButton = document.getElementById('shuffle-button');
  const orderButton = document.getElementById('order-button');

  if (isShuffle) {
    shuffleButton.style.display = 'inline';  
    orderButton.style.display = 'none';      
  } else {
    shuffleButton.style.display = 'none';    
    orderButton.style.display = 'inline';    
  }
}
// Event listeners for shuffle and order icons
document.getElementById('shuffle-button').addEventListener('click', toggleShuffleOrder);
document.getElementById('order-button').addEventListener('click', toggleShuffleOrder);

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
  audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
}

// Update duration
function updateDuration() {
  timerTotal.textContent = formatTime(audioPlayer.duration);
}

// Play previous song
function prevSong() {
  if (isShuffle) {
    currentSongIndex = (currentSongIndex - 1 + shuffledList.length) % shuffledList.length;
  } else {
    currentSongIndex = (currentSongIndex - 1 + songList.length) % songList.length;
  }
  loadSong(currentSongIndex);
}
document.getElementById('prev-button').addEventListener('click', prevSong);

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

// Toggle play/ pause function
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

// Play and pause button event listener 
playButton.addEventListener('click', togglePlayPause);
pauseButton.addEventListener('click', togglePlayPause);

// Play next song
function nextSong() {
  if (isShuffle) {
    currentSongIndex = (currentSongIndex + 1) % shuffledList.length;
  } else {
    currentSongIndex = (currentSongIndex + 1) % songList.length;
  }
  loadSong(currentSongIndex);
  audioPlayer.play();
}
document.getElementById('next-button').addEventListener('click', nextSong);


// Function to generate playlist 
function generatePlaylist() {
  playlistContainer.innerHTML = '';  

  const activeList = isShuffle ? shuffledList : songList;

  activeList.forEach((song, index) => {
    const songElement = document.createElement('div');
    songElement.classList.add('playlist-item');

    // If it is on shuffle mode
    if ((isShuffle && shuffledList[currentSongIndex] === song) || 
        (!isShuffle && songList[currentSongIndex] === song)) {
      songElement.classList.add('active-song');  
    }

    // Create song elements - left
    const songName = document.createElement('span');
    songName.textContent = song.name;
    songName.classList.add('playlist-song-name');

    const songArtist = document.createElement('span');
    songArtist.textContent = song.artist;
    songArtist.classList.add('playlist-artist');

    songElement.appendChild(songName);
    songElement.appendChild(songArtist);
    
    // Create song elements - right
    const songDuration = document.createElement('span');
    songDuration.classList.add('playlist-duration');

    // Create temporary audio element to get duration
    const tempAudio = new Audio(song.soundSrc);
    tempAudio.addEventListener('loadedmetadata', function () {
      songDuration.textContent = formatTime(tempAudio.duration);
    });

    // Add click event to play the clicked song
    songElement.addEventListener('click', () => {
      currentSongIndex = index;
      loadSong(currentSongIndex);

      audioPlayer.play().then(() => {
        togglePlayPauseButtons();    
      }).catch(error => {
        console.error('Playback failed:', error);
      });
      generatePlaylist();
    });

    songElement.appendChild(songDuration);
    playlistContainer.appendChild(songElement);  
  });
}

// Display or hide playlist
togglePlaylistButton.addEventListener('click', () => {
  if (playlistContainer.style.display === 'none') {
      playlistContainer.style.display = 'block';
      togglePlaylistButton.textContent = 'Hide Playlist';
  } else {
      playlistContainer.style.display = 'none';
      togglePlaylistButton.textContent = 'Show Playlist';
  }
});

// Initialize 
document.addEventListener('DOMContentLoaded', function () {
  loadSong(currentSongIndex);
  audioPlayer.volume = 0.5;
  volumeControl.value = 0.5;
  volumePercentage.textContent = '50%';
  updateVolumeIcon(audioPlayer.volume);

  generatePlaylist();

  audioPlayer.addEventListener('loadedmetadata', updateDuration);
  audioPlayer.addEventListener('timeupdate', updateProgressBar);
  progressBar.addEventListener('input', setProgress);
  audioPlayer.addEventListener('ended', nextSong);

  if (isShuffle) {
    toggleShuffleOrder();  
  }
});






