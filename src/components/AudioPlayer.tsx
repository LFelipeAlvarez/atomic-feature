import { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import './audioPlayer.css';
import { Pause, Play } from './Icons';
import { formatTime } from '../helpers';
import { AudioPlayerProps } from '../types';

const AudioPlayer = ({ src }: AudioPlayerProps) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (waveformRef.current && !wavesurfer) {
      const newWavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#8F67FF',
        progressColor: '#fff',
        height: 35,
        barWidth: 2,
        barRadius: 5,
        barGap: 2,
        cursorColor: '#6F3BFF',
      });

      newWavesurfer.load(src);


      newWavesurfer.on('ready', () => {
        setDuration(newWavesurfer.getDuration());
      });

      newWavesurfer.on('play', () => {

      })

      newWavesurfer.on('audioprocess', () => {
        const currentTime = newWavesurfer.getCurrentTime();
        setCurrentTime(currentTime);
      });


      newWavesurfer.on('finish', () => {
        setIsPlaying(false);
      });

      setWavesurfer(newWavesurfer);
    }

    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
    };
  }, [src, waveformRef, wavesurfer]);

  const togglePlay = () => {
    if (wavesurfer) {
      if (isPlaying) {
        wavesurfer.pause();
      } else {
        wavesurfer.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className='audio-player' >
      <div>
        <button className='button-icon' onClick={togglePlay}>
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <div ref={waveformRef} className='audio-player__wave' />

      </div>
      <span>{isPlaying ? formatTime(currentTime) : formatTime(duration)}</span>
    </div>
  );
};


export default AudioPlayer;
