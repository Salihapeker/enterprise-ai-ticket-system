import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./App.css";

function App() {
  const [phase, setPhase] = useState("welcome");
  const [candlesLit, setCandlesLit] = useState(true);
  const [listening, setListening] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);
  const [wishCountdown, setWishCountdown] = useState(5);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [candleCount, setCandleCount] = useState(5);
  const [isSwaying, setIsSwaying] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (phase === "cake") {
      setCandleCount(Math.floor(Math.random() * 4) + 3);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "wish" && wishCountdown > 0) {
      const timer = setTimeout(() => {
        setWishCountdown(wishCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === "wish" && wishCountdown === 0) {
      setTimeout(() => {
        setPhase("cake");
        setListening(true);
      }, 1000);
    }
  }, [phase, wishCountdown]);

  useEffect(() => {
    if (!listening || phase !== "cake") return;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.fftSize = 512;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          const average =
            dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setVolumeLevel(average);
          if (average > 30) {
            setIsSwaying(true);
          } else {
            setIsSwaying(false);
          }

          if (average > 60 && candlesLit) {
            setCandlesLit(false);
            setShowSmoke(true);
            setPhase("celebration");
            setTimeout(() => setShowSmoke(false), 2000);
          }

          if (candlesLit) {
            requestAnimationFrame(checkVolume);
          }
        };

        checkVolume();
      })
      .catch((err) => {
        console.error("Mikrofon erişim hatası:", err);
        alert("Mikrofon erişimine izin ver ki mumları üfleyebilesin!");
      });
  }, [listening, candlesLit, phase]);

  const startWishPhase = () => {
    setPhase("wish");
    setWishCountdown(5);
  };

  const resetCake = () => {
    setPhase("welcome");
    setCandlesLit(true);
    setListening(false);
    setShowSmoke(false);
    setWishCountdown(5);
    setVolumeLevel(0);
    setIsSwaying(false);
  };

  const candlePositions = Array.from({ length: candleCount }, (_, i) => ({
    left: `${20 + i * (60 / (candleCount - 1))}%`,
    smokeDelay: Math.random() * 0.5,
    smokeScale: 1 + Math.random() * 1,
  }));

  return (
    <div className={`app ${candlesLit ? "dark-mode" : "light-mode"}`}>
      <div className="stars-background"></div>

      {phase === "welcome" && (
        <div className="welcome-phase">
          <div className="besiktas-logo">🦅</div>
          <h1>🖤🤍</h1>
          <p className="subtitle">Doğum günün kutlu olsun aşkııımmm!</p>
          <button className="start-btn" onClick={startWishPhase}>
            Devamm ett💫
          </button>
        </div>
      )}

      {phase === "wish" && (
        <div className="wish-phase">
          <h1>Şimdiii Bir Dilek Tutt 🌟</h1>
          <p className="wish-instruction">Aşkımmmm hazır mısın?</p>
          <div className="countdown-container">
            {wishCountdown > 0 ? (
              <div className="countdown-number">{wishCountdown}</div>
            ) : (
              <div className="countdown-done">
                ✨ İYİ Kİ VARSIN BİTANEMMM! ✨
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pasta Üfleme Ekranı */}
      {phase === "cake" && (
        <>
          <h1>Şimdii dee Mumları Üflee 🎂</h1>

          {listening && candlesLit && (
            <p className="blow-instruction">Üfleee</p>
          )}

          <div className="cake-container">
            <div className="cake-layer bottom-layer"></div>
            <div className="cake-layer middle-layer"></div>
            <div className="cake-layer top-layer"></div>

            {candlePositions.map((pos, index) => (
              <div
                key={index}
                className={`candle ${candlesLit ? "lit" : "blown"} ${
                  isSwaying ? "swaying" : ""
                }`}
                style={{ left: pos.left }}
              ></div>
            ))}

            {showSmoke &&
              candlePositions.map((pos, index) => (
                <div
                  key={`smoke-${index}`}
                  className="smoke"
                  style={{
                    left: pos.left,
                    animation: `smokeRise ${
                      1.5 + pos.smokeDelay
                    }s ease-out forwards`,
                    transform: `scale(${pos.smokeScale})`,
                  }}
                ></div>
              ))}

            {listening && candlesLit && (
              <div className="sound-indicator">
                <div
                  className="sound-bar"
                  style={{ width: `${Math.min(volumeLevel * 2, 200)}px` }}
                ></div>
              </div>
            )}
          </div>
        </>
      )}

      {phase === "celebration" && (
        <>
          <h1 className="celebration-title">
            🖤 DOĞUM GÜNÜN KUTLU OLSUN KOCAMMMMM! 🤍
          </h1>
          <div className="celebration-messages">
            <p className="message">İyi ki doğdunnnnn 🤍</p>
            <p className="message">İyi ki varsınnnnn🤍 </p>
            <p className="message">🤍</p>
          </div>
          <div className="bjk-chant">
            <p>Nice Yaşlara hayatımmm </p>
            <p>💐</p>
          </div>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={200}
            colors={["#000000", "#FFFFFF", "#FF0000"]}
          />
          <button className="reset-btn" onClick={resetCake}>
            Tekrar Üfleyebiirsinnn üflemeden önce sessiz oll 🎉
          </button>
        </>
      )}
    </div>
  );
}

export default App;
