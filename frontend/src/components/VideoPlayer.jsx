import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Hls from "hls.js";
import { FaCog, FaExpand, FaCompress } from "react-icons/fa";
import "../styles/Browse.css";

const VideoPlayer = forwardRef(({ src }, ref) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1); // -1 = auto
  const [showMenu, setShowMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Clean up any previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLevels(hls.levels || []);
        setCurrentLevel(hls.currentLevel ?? -1);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        setCurrentLevel(data.level);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari / native HLS
      video.src = src;
    } else {
      // Basic fallback
      video.src = src;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  // Expose basic controls to parent (e.g. to start playback
  // when the user clicks the big overlay play button).
  useImperativeHandle(ref, () => ({
    play: () => {
      const video = videoRef.current;
      if (!video) return;
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }
    },
  }));

  // Keep track of fullscreen state so we can toggle the icon and
  // ensure our custom controls (settings) remain visible in fullscreen.
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fsElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      // If our container is the element in fullscreen, mark it as such.
      setIsFullscreen(fsElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener(
      "webkitfullscreenchange",
      handleFullscreenChange
    );
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  const enterFullscreen = () => {
    const elem = containerRef.current;
    if (!elem) return;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  const handleSelectLevel = (level) => {
    if (!hlsRef.current) return;
    hlsRef.current.currentLevel = level;
    setCurrentLevel(level);
    setShowMenu(false);
  };

  return (
    <div className="player-container" ref={containerRef}>
      <video
        ref={videoRef}
        className="player-video"
        controls
        // Hide the native fullscreen button so users use our custom one,
        // which keeps the settings button visible in fullscreen.
        controlsList="nofullscreen"
      />

      {levels.length > 0 && (
        <div className="player-controls">
          <button
            className="gear-button"
            onClick={() => setShowMenu((v) => !v)}
            aria-label="Quality settings"
          >
            <FaCog />
          </button>

          <button
            className="fullscreen-button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>

          {showMenu && (
            <div className="quality-menu">
              <button
                className={currentLevel === -1 ? "active" : ""}
                onClick={() => handleSelectLevel(-1)}
              >
                Auto
              </button>
              {levels.map((lvl, idx) => (
                <button
                  key={idx}
                  className={currentLevel === idx ? "active" : ""}
                  onClick={() => handleSelectLevel(idx)}
                >
                  {lvl.height
                    ? `${lvl.height}p`
                    : `${Math.round(lvl.bitrate / 1000)} kbps`}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default VideoPlayer;

