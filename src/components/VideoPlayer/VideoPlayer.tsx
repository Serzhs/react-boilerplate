import './VideoPlayer.scss';
import {
  useRef, useState, useMemo, useEffect,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay, faPause, faUndo, faRedo, faVolumeDown, faVolumeUp, faVolumeOff, faVolumeMute, faCompress, faExpand, faReply,
} from '@fortawesome/free-solid-svg-icons';
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';
import convertSecondsToHHMMSS from '../../utils/convertSecondsToHHMMSS/convertSecondsToHHMMSS';

const forwardBackwardTime = 10;
const controlsHideTime = 1000;

type VideoChangeKeys = 'currentTime' | 'volume'

/* View in fullscreen */
const openFullscreen = (elem: HTMLElement) => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }
};

/* Close fullscreen */
const closeFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
    document.exitFullscreen();
  }
};

const VideoPlayer = () => {
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoDuration = useRef(0);
  const controlTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [queryTime, setQueryTime] = useQueryParam('t', NumberParam);

  const volumeIcon = useMemo(() => {
    if (volume >= 66) {
      return faVolumeUp;
    } if (volume < 66 && volume >= 33) {
      return faVolumeDown;
    } if (volume < 33 && volume >= 1) {
      return faVolumeOff;
    }

    return faVolumeMute;
  }, [volume]);

  const changeVideoValue = (seconds: number, key: VideoChangeKeys = 'currentTime') => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video[key] = seconds;
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      setFullscreen(!!document.fullscreenElement);
    });
  }, []);

  const playVideo = () => {
    if (!playing) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
    setPlaying(!playing);
  };

  const toggleFullscreen = () => {
    const videoContainer = videoContainerRef.current;

    if (!videoContainer) {
      return;
    }

    if (fullscreen) {
      closeFullscreen();
    } else {
      openFullscreen(videoContainer);
    }
  };

  const toggleControls = () => {
    setShowControls(true);

    if (controlTimeout.current) {
      clearTimeout(controlTimeout.current);
    }

    if (!playing) {
      return;
    }

    controlTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, controlsHideTime);
  };

  const replayVideo = () => {
    changeVideoValue(0);

    if (!videoRef.current) {
      return;
    }

    videoRef.current.play();
    setPlaying(true);
  };

  const videoLoadHandler = () => {
    const duration = Math.round(videoRef.current?.duration || 0);
    videoDuration.current = duration;
    let time = 0;

    if (queryTime && queryTime <= duration) {
      time = queryTime;
    }

    changeVideoValue(time);

    setLoading(false);
  };

  const timeUpdateHandler = () => {
    const time = Math.round(videoRef.current?.currentTime || 0);

    setQueryTime(time);
    setCurrentTime(time);

    if (time >= videoDuration.current) {
      setPlaying(false);
      setEnded(true);
      setShowControls(true);
    } else {
      setEnded(false);
    }
  };

  return (
    <div
      ref={videoContainerRef}
      className={`video__container ${fullscreen && 'fullscreen'}`}
    >
      <div className="video__wrapper">
        {!fullscreen && (
          <>
            <h1 className="video__heading">Video trailer</h1>
            <p className="video__paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </>
        )}
        <div className="video__parent">
          <video
            ref={videoRef}
            controls={false}
            className="video"
            poster="https://assets.codepen.io/32795/poster.png"
            onMouseMove={toggleControls}
            onLoadedMetadataCapture={videoLoadHandler}
            onTimeUpdate={timeUpdateHandler}
            onVolumeChange={() => {
              const volumeValue = (videoRef.current?.volume || 0) * 100;

              setVolume(volumeValue);
            }}
          >
            <source
              id="mp4"
              src="http://media.w3.org/2010/05/sintel/trailer.mp4"
              type="video/mp4"
            />
          </video>
          {fullscreen && showControls && (
          <button
            className="video__controls-button video__controls-button--large"
            onClick={playVideo}
            title={playing ? 'Pause' : 'Play'}
          >
            <FontAwesomeIcon icon={playing ? faPause : faPlay} />
          </button>
          )}
          {ended && (
            <button
              className="video__controls-button video__controls-button--large video__controls-button--replay"
              onClick={replayVideo}
              title="replay"
            >
              <FontAwesomeIcon icon={faReply} />
            </button>
          )}
          { !loading && showControls && (
            <div className="video__controls">
              <div className="video__timeline">
                <input
                  className="video__time-range"
                  type="range"
                  min="0"
                  max={videoDuration.current}
                  value={currentTime}
                  onChange={(e) => {
                    const time = parseInt(e.target.value, 10);

                    changeVideoValue(time);
                  }}
                />
              </div>
              <div className="video__actions">
                <div className="video__controls-left">
                  <button
                    className="video__controls-button"
                    title={`Backward ${forwardBackwardTime}s`}
                    onClick={() => changeVideoValue(currentTime - forwardBackwardTime)}
                  >
                    <FontAwesomeIcon icon={faUndo} />
                  </button>
                  <button
                    className="video__controls-button"
                    onClick={playVideo}
                    title={playing ? 'Pause' : 'Play'}
                  >
                    <FontAwesomeIcon icon={playing ? faPause : faPlay} />
                  </button>
                  <button
                    className="video__controls-button"
                    title={`Forward ${forwardBackwardTime}s`}
                    onClick={() => changeVideoValue(currentTime + forwardBackwardTime)}
                  >
                    <FontAwesomeIcon icon={faRedo} />
                  </button>
                  <span className="video__time">
                    {`${convertSecondsToHHMMSS(currentTime)} / ${convertSecondsToHHMMSS(videoDuration.current)}`}
                  </span>
                  <div className="video__volume">
                    <FontAwesomeIcon icon={volumeIcon} />
                    <input
                      className="video__volume-range"
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => {
                        const volumeValue = parseInt(e.target.value, 10) / 100;

                        changeVideoValue(volumeValue, 'volume');
                      }}
                    />
                  </div>
                </div>
                <div className="video__controls-right">
                  <button
                    className="video__controls-button"
                    title={fullscreen ? 'Minimize' : 'Maximize'}
                    onClick={toggleFullscreen}
                  >
                    <FontAwesomeIcon icon={fullscreen ? faCompress : faExpand} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
