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

function loadSong(songIndex) {
	const song = songList[songIndex];
	audioPlayer.src = song.soundSrc;
	albumCover.src = song.imageSrc;
	songTitle.textContent = song.name;
	songArtist.textContent = song.artist;
	
	audioPlayer.load();  // Load the audio file
	audioPlayer.play();  // Start playing the audio
  }
  
  function playAudio() {
	if (audioPlayer.paused) {
	  audioPlayer.play();
	}
  }
  
  function pauseAudio() {
	if (!audioPlayer.paused) {
	  audioPlayer.pause();
	}
  }
  
  function stopAudio() {
	audioPlayer.pause();
	audioPlayer.currentTime = 0;
	loadSong(currentSongIndex);  // Restart the current song
  }
  
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