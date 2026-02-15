import { createContext, useContext, useReducer, useRef, useEffect, createElement, type ReactNode } from 'react';
import { type PlayerState, type Song } from '../types/music';
import { musicService } from '../services/music';

type PlayerAction =
  | { type: 'SET_SONG'; payload: Song }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_QUEUE'; payload: Song[] }
  | { type: 'NEXT_SONG' }
  | { type: 'PREV_SONG' };

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  queue: [],
  currentIndex: -1,
};

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_SONG':
      return { ...state, currentSong: action.payload };
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_QUEUE':
      return { ...state, queue: action.payload, currentIndex: 0 };
    case 'NEXT_SONG':
      const nextIndex = state.currentIndex + 1;
      if (nextIndex < state.queue.length) {
        return {
          ...state,
          currentIndex: nextIndex,
          currentSong: state.queue[nextIndex],
        };
      }
      return state;
    case 'PREV_SONG':
      const prevIndex = state.currentIndex - 1;
      if (prevIndex >= 0) {
        return {
          ...state,
          currentIndex: prevIndex,
          currentSong: state.queue[prevIndex],
        };
      }
      return state;
    default:
      return state;
  }
}

interface PlayerContextType extends PlayerState {
  play: (song?: Song) => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  playQueue: (songs: Song[], startIndex?: number) => void;
  nextSong: () => void;
  prevSong: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_TIME', payload: audio.currentTime });
    };
    
    const handleLoadedMetadata = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration });
    };
    
    const handleEnded = () => {
      dispatch({ type: 'NEXT_SONG' });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    audioRef.current.volume = state.volume;
  }, [state.volume]);

  useEffect(() => {
    if (state.currentSong) {
      audioRef.current.src = musicService.getStreamUrl(state.currentSong.id);
      if (state.isPlaying) {
        audioRef.current.play();
      }
    }
  }, [state.currentSong]);

  useEffect(() => {
    if (state.isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [state.isPlaying]);

  const play = (song?: Song) => {
    if (song) {
      dispatch({ type: 'SET_SONG', payload: song });
    }
    dispatch({ type: 'PLAY' });
  };

  const pause = () => {
    dispatch({ type: 'PAUSE' });
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  };

  const seekTo = (time: number) => {
    audioRef.current.currentTime = time;
    dispatch({ type: 'SET_TIME', payload: time });
  };

  const playQueue = (songs: Song[], startIndex = 0) => {
    dispatch({ type: 'SET_QUEUE', payload: songs });
    if (songs[startIndex]) {
      dispatch({ type: 'SET_SONG', payload: songs[startIndex] });
      dispatch({ type: 'PLAY' });
    }
  };

  const nextSong = () => {
    dispatch({ type: 'NEXT_SONG' });
  };

  const prevSong = () => {
    dispatch({ type: 'PREV_SONG' });
  };

  const value: PlayerContextType = {
    ...state,
    play,
    pause,
    setVolume,
    seekTo,
    playQueue,
    nextSong,
    prevSong,
  };

  return createElement(PlayerContext.Provider, { value }, children);
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}