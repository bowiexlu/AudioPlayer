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

// LoadSong function
function loadSong(songIndex) {
	const song = songList[songIndex];
	audioPlayer.src = song.soundSrc;
	albumCover.src = song.imageSrc;
	songTitle.textContent = song.name;
	songArtist.textContent = song.artist;

	// Update the text to display the song's name
	const nowPlayingText = document.getElementById('now-playing-text');
	nowPlayingText.textContent = `Now Playing: ${song.name}`;
	
	audioPlayer.load();  
	audioPlayer.play();  
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
  
  // Play the music
  function playAudio() {
	if (audioPlayer.paused) {
	  audioPlayer.play();
	}
	togglePlayPauseButtons();
  }
   // Pause the music
  function pauseAudio() {
	if (!audioPlayer.paused) {
	  audioPlayer.pause();
	}
	togglePlayPauseButtons();
  }
  
  // Stop the music and return to the beginning of the current song
  function stopAudio() {
	audioPlayer.pause();
	audioPlayer.currentTime = 0;
	loadSong(currentSongIndex); 
	togglePlayPauseButtons(); 
  }
  
  // Play next song
  function nextSong() {
	currentSongIndex = (currentSongIndex + 1) % songList.length;
	loadSong(currentSongIndex);
  }
  
  function prevSong() {
	currentSongIndex = (currentSongIndex - 1 + songList.length) % songList.length;
	loadSong(currentSongIndex);
  }
  
  function updateProgressBar() {
	const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
	progressBar.value = progress;
	const minutes = Math.floor(audioPlayer.currentTime / 60);
	const seconds = Math.floor(audioPlayer.currentTime % 60);
	timerNow.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  
  function setProgress() {
	const newTime = (progressBar.value / 100) * audioPlayer.duration;
	audioPlayer.currentTime = newTime;
  }
  
  function updateDuration() {
	const minutes = Math.floor(audioPlayer.duration / 60);
	const seconds = Math.floor(audioPlayer.duration % 60);
	timerTotal.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  //..................................................................................

// Input event listener for volume progress bar
volumeControl.addEventListener('input', function() {
  const volume = volumeControl.value;
  audioPlayer.volume = volume;  
  volumePercentage.textContent = `${Math.floor(volume * 100)}%`;  

  // Display volume icon
  updateVolumeIcon(volume);
});

// For muting and restoring volume
volumeIcon.addEventListener('click', function() {
  if (audioPlayer.volume > 0) {
    lastVolume = audioPlayer.volume;  // Save current volume
    audioPlayer.volume = 0;           // Set to mute
    volumeControl.value = 0;          // Reset the progress bar
    volumePercentage.textContent = '0%'; 
    updateVolumeIcon(0);              // Display the mute icon
  } else {
    audioPlayer.volume = lastVolume;  // Restore the previous volume
    volumeControl.value = lastVolume; // Update the progress bar
    volumePercentage.textContent = `${Math.floor(lastVolume * 100)}%`;
    updateVolumeIcon(lastVolume);     // Update to the normal icon
  }
});

// Function to update the volume icon and switch the icon according to the volume
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

// Initialize volume icon
updateVolumeIcon(audioPlayer.volume);

  
  // Event listener
  document.getElementById('play-button').addEventListener('click', playAudio);
  document.getElementById('pause-button').addEventListener('click', pauseAudio);
  document.getElementById('stop-button').addEventListener('click', stopAudio);
  document.getElementById('next-button').addEventListener('click', nextSong);
  document.getElementById('prev-button').addEventListener('click', prevSong);
  
  audioPlayer.addEventListener('timeupdate', updateProgressBar);
  audioPlayer.addEventListener('loadedmetadata', updateDuration);
  
  progressBar.addEventListener('input', setProgress);
  
  // Initialize the player with the first song
  loadSong(currentSongIndex);