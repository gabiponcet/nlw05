import React, {  useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';


export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ progress, setProgress ] = useState(0);
  const {
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    isLooping,
    togglePlay,
    toggleLoop,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isShuffling,
    toggleShuffle,
    clearPlayerState
   } = usePlayer();
 
  useEffect(() => {
    if(!audioRef.current){
      return; //retorna nada
    }
    if(isPlaying) {//se houver ref:
      audioRef.current.play()//executa a função play
    } else{
      audioRef.current.pause()//ou a função pause
    }
  }, [isPlaying]);//dispara sempre que isPlaying tem seu valor alterado 

  function setUpProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }

  function handleSeek(amount: number){
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if(hasNext) {
      playNext();
    }else {
      clearPlayerState();
    }
  }

  const episode = episodeList[currentEpisodeIndex];

  return(
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="tocando agora" />
        <strong>Tocando agora </strong>
      </header>
    {episode ? (
      <div className={styles.currentEpisode}>
        <Image 
        width={592}
        height={592}
        src={episode.thumbnail}
        objectFit="cover"
         />
         <strong>{episode.title}</strong>
         <span>{episode.members}</span>
      </div>
    ) : (
      <div className={styles.emptyPlayer}>
      <strong>Selecione um podcast para ouvir</strong>
    </div>
    ) }
    

    <footer className={!episode ? styles.empty: ''}>
      <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span>
        <div className={styles.slider}>
            { episode ? (
              <Slider 
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{backgroundColor:'#04d361'}}
                railStyle={{backgroundColor:'#9f75ff'}}
                handleStyle={{backgroundColor:'#04d361'}}
              />
            ) : (
              <div className={styles.emptySlider}/>
            )}
        </div>
        <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
      </div>

              { episode && (
                <audio 
                  src={episode.url}
                  ref={audioRef}
                  autoPlay
                  onEnded={handleEpisodeEnded}
                  loop={isLooping}
                  onPlay={() => setPlayingState(true)}
                  onPause={() => setPlayingState(false)}
                  onLoadedMetadata={setUpProgressListener}
                />
              )}

      <div className={styles.buttons}>
        <button type="button" 
        disabled={!episode || episodeList.length == 1}
        onClick={toggleShuffle}
        className={isShuffling ? styles.isActive : ''}
        >
          <img src="/shuffle.svg" alt="Embaralhar"/>
        </button>
        <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
          <img src="/play-previous.svg" alt="Tocar anterior"/>
        </button>
        <button type="button" 
        disabled={!episode} 
        className={styles.playButton}
        onClick={togglePlay}>
          { isPlaying 
          ? <img src="/pause.svg" alt="Tocar"/>
          : <img src="/play.svg" alt="Tocar"/>}
          
        </button>
        <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
          <img src="/play-next.svg" alt="Tocar próxima"/>
        </button>
        <button 
        type="button" 
        disabled={!episode}
        onClick={toggleLoop}
        className={isLooping ? styles.isActive : ''}
        >
          <img src="/repeat.svg" alt="Repetir"/>
        </button>
      </div>

    </footer>
    </div>
  );
}