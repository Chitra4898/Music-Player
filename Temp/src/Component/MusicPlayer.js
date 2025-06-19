import React, { useState, useRef, useEffect } from 'react';
import './MusicPlayer1.css';
import Track1 from '../Assets/Track1.mp3';
import Track2 from '../Assets/Track2.mp3';
import Track3 from '../Assets/Track3.mp3';

const tracks = [
  {
    title: 'Jailer BGM',
    artist: 'Anirudh Ravichander',
    src: Track1,
    cover:
      'https://img.freepik.com/premium-photo/concept-eternal-theme-about-eternity-music-musical-instruments-good-mood-ascended-aspiration-action-treble-clef-sheet-music_771426-4115.jpg?w=740',
  },
  {
    title: 'Kaththi BGM',
    artist: 'Anirudh Ravichander',
    src: Track2,
    cover:
      'https://tse4.mm.bing.net/th?id=OIP.nwH0GKmmn6yuVl7Ffv3rTwHaEK&pid=Api&P=0&h=180',
  },
  {
    title: 'Sillunu Oru Kadhal',
    artist: 'AR Rahman',
    src: Track3,
    cover: 'https://images.alphacoders.com/109/1090856.jpg',
  },
];

function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef(new Audio(tracks[0].src));

  // Setup new track
  useEffect(() => {
    const currentAudio = audioRef.current;
    currentAudio.pause();
    audioRef.current = new Audio(tracks[currentTrackIndex].src);
    const newAudio = audioRef.current;
    
    newAudio.loop = isLooping;

    if (isPlaying) newAudio.play();

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      if (!newAudio.loop)
      {
         const next = (currentTrackIndex + 1) % tracks.length;
         setCurrentTrackIndex(next);
         setIsPlaying(true);
      }
     
    };

    const handleTimeUpdate = () => {
      setProgress(newAudio.currentTime);
      setDuration(newAudio.duration || 0);
    };

    newAudio.addEventListener('play', handlePlay);
    newAudio.addEventListener('pause', handlePause);
    newAudio.addEventListener('ended', handleEnded);
    newAudio.addEventListener('timeupdate', handleTimeUpdate);
    newAudio.addEventListener('loadedmetadata', () => {
      setDuration(newAudio.duration || 0);
    });

    return () => {
      newAudio.pause();
      newAudio.removeEventListener('play', handlePlay);
      newAudio.removeEventListener('pause', handlePause);
      newAudio.removeEventListener('ended', handleEnded);
      newAudio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentTrackIndex, isLooping]);
   

   useEffect(() => {
    audioRef.current.loop = isLooping;
  }, [isLooping]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const skipTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const seekTime = (e.target.value / 100) * duration;
    audio.currentTime = seekTime;
    setProgress(seekTime);
  };

  const formatTime = (time) =>
    isNaN(time)
      ? '0:00'
      : `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`;

  return (
    <div className="music-player">
      <div className="player-header">
        <h2>Now Playing</h2>
      </div>
      <div className="album-art">
        <img src={tracks[currentTrackIndex].cover} alt="Album Art" />
      </div>
      <div className="track-info">
        <p className="track-title">{tracks[currentTrackIndex].title}</p>
        <p className="track-artist">{tracks[currentTrackIndex].artist}</p>
      </div>

      <div className="progress-bar-container">
        <span>{formatTime(progress)}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={duration ? (progress / duration) * 100 : 0}
          onChange={handleSeek}
          className="progress-bar"
        />
        <span>{formatTime(duration)}</span>
      </div>

      <div className="controls">
        <button className="play-btn" onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button className="skip-btn" onClick={skipTrack}>
          Next
        </button>

         <button
          className={`loop-btn ${isLooping ? 'active' : ''}`}
          onClick={() => setIsLooping(!isLooping)}
        >
          {isLooping ? 'Looping' : 'Loop'}
        </button>
      </div>
    </div>
  );
}

export default MusicPlayer;
