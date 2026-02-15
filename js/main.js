document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const themeSwitch = document.getElementById('theme-switch');
    const themeIconLight = document.getElementById('theme-icon-light');
    const themeIconDark = document.getElementById('theme-icon-dark');
    const permissionModal = document.getElementById('permission-modal');
    const permissionBtn = document.getElementById('permission-btn');
    const audioToggle = document.getElementById('audio-toggle');
    
    const surfaceModeBtn = document.getElementById('surface-mode-btn');
    const wallModeBtn = document.getElementById('wall-mode-btn');
    const surfaceModeContent = document.getElementById('surface-mode-content');
    const wallModeContent = document.getElementById('wall-mode-content');

    // Surface Mode Elements
    const bubbleMain = document.getElementById('bubble-main');
    const hBubble = document.getElementById('h-bubble');
    const vBubble = document.getElementById('v-bubble');
    const degreeX = document.getElementById('degree-x');
    const degreeY = document.getElementById('degree-y');
    const circularDial = document.getElementById('circular-dial');
    const hLevel = document.getElementById('horizontal-level');
    const vLevel = document.getElementById('vertical-level');

    // Wall Mode Elements
    const wallBubble = document.getElementById('wall-bubble');
    const wallDegree = document.getElementById('wall-degree');
    const wallLevel = document.getElementById('wall-level');

    // Buttons
    const zeroBtn = document.getElementById('zero-btn');
    const startBtn = document.getElementById('start-measurement-btn');
    const stopBtn = document.getElementById('stop-measurement-btn');

    // variables
    let pitchOffset = 0;
    let rollOffset = 0;
    let lastPitch = 0;
    let lastRoll = 0;
    let isMeasuring = false;
    let isSurfaceMode = true;

    // Audio variables
    let isAudioOn = true;
    let audioContext;
    let oscillator; // For continuous beep
    let lastBeepTime = 0;

    // --- Theme Management ---
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            themeIconLight.classList.add('hidden');
            themeIconDark.classList.remove('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            themeIconLight.classList.remove('hidden');
            themeIconDark.classList.add('hidden');
        }
    };

    const currentTheme = localStorage.getItem('theme') || 'light';
    applyTheme(currentTheme);

    themeSwitch.addEventListener('click', () => {
        const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
    
    // --- Mode Management ---
    surfaceModeBtn.addEventListener('click', () => {
        if (isSurfaceMode) return;
        isSurfaceMode = true;
        wallModeContent.classList.add('hidden');
        surfaceModeContent.classList.remove('hidden');
        wallModeBtn.classList.remove('bg-white', 'dark:bg-gray-500');
        surfaceModeBtn.classList.add('bg-white', 'dark:bg-gray-500');
    });

    wallModeBtn.addEventListener('click', () => {
        if (!isSurfaceMode) return;
        isSurfaceMode = false;
        surfaceModeContent.classList.add('hidden');
        wallModeContent.classList.remove('hidden');
        surfaceModeBtn.classList.remove('bg-white', 'dark:bg-gray-500');
        wallModeBtn.classList.add('bg-white', 'dark:bg-gray-500');
    });

    // --- Audio Handling ---
    const playShortBeep = () => {
        if (!audioContext || !isAudioOn) return;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioContext.currentTime); // A4 pitch
        osc.connect(gain);
        gain.connect(audioContext.destination);
    
        gain.gain.setValueAtTime(1, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.1);
    
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.1);
    };

    const startContinuousBeep = () => {
        if (!audioContext || !isAudioOn || oscillator) return;
        oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 pitch for level
        oscillator.connect(audioContext.destination);
        oscillator.start();
    };

    const stopContinuousBeep = () => {
        if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
            oscillator = null;
        }
    };

    const updateAudio = (pitch, roll) => {
        if (!isAudioOn || !isMeasuring || !audioContext) {
            stopContinuousBeep();
            return;
        }

        let totalAngle;
        if (isSurfaceMode) {
            const currentPitch = pitch - pitchOffset;
            const currentRoll = roll - rollOffset;
            totalAngle = Math.hypot(currentPitch, currentRoll);
        } else {
            const isPortrait = window.innerHeight > window.innerWidth;
            const angle = isPortrait ? (roll - rollOffset) : (pitch - pitchOffset);
            totalAngle = Math.abs(angle);
        }

        if (totalAngle < 0.5) { // Threshold for being level
            startContinuousBeep();
        } else {
            stopContinuousBeep();

            // Dynamic interval beeping
            const maxAngle = 45; // Cap for interval calculation
            const minInterval = 0.1; // 100ms
            const maxInterval = 1.0; // 1s
            const angleRatio = Math.min(totalAngle, maxAngle) / maxAngle;
            const interval = minInterval + angleRatio * (maxInterval - minInterval);

            const currentTime = audioContext.currentTime;
            if (currentTime > lastBeepTime + interval) {
                playShortBeep();
                lastBeepTime = currentTime;
            }
        }
    };

    // --- Sensor Logic ---
    const handleOrientation = (event) => {
        if (!isMeasuring) return;

        const { beta, gamma } = event; // beta: pitch (y-axis), gamma: roll (x-axis)
        lastPitch = beta;
        lastRoll = gamma;

        // Auto-switch mode based on angle
        if (isSurfaceMode && (Math.abs(beta) > 45 || Math.abs(gamma) > 75)) {
            wallModeBtn.click();
        } else if (!isSurfaceMode && (Math.abs(beta) < 45 && Math.abs(gamma) < 45)) {
            surfaceModeBtn.click();
        }
        
        if (isSurfaceMode) {
            updateSurfaceMode(beta, gamma);
        } else {
            updateWallMode(beta, gamma);
        }
        updateAudio(beta, gamma);
    };

    const updateSurfaceMode = (pitch, roll) => {
        const currentPitch = pitch - pitchOffset;
        const currentRoll = roll - rollOffset;

        // Clamp angles to prevent extreme values
        const clampedPitch = Math.max(-90, Math.min(90, currentPitch));
        const clampedRoll = Math.max(-90, Math.min(90, currentRoll));

        // Update degree text
        degreeX.textContent = `${clampedRoll.toFixed(1)}°`;
        degreeY.textContent = `${clampedPitch.toFixed(1)}°`;

        // Calculate bubble positions
        const dialRadius = circularDial.offsetWidth / 2;
        const bubbleRadius = bubbleMain.offsetWidth / 2;
        const maxBubbleTravel = dialRadius - bubbleRadius;

        const bubbleX = (clampedRoll / 45) * maxBubbleTravel;
        const bubbleY = (clampedPitch / 45) * maxBubbleTravel;
        
        bubbleMain.style.transform = `translate(${bubbleX}px, ${bubbleY}px)`;

        // Update rectangular levels
        const hLevelWidth = hLevel.offsetWidth;
        const hBubbleWidth = hBubble.offsetWidth;
        const maxHBubbleTravel = (hLevelWidth - hBubbleWidth) / 2;
        const hBubbleX = (clampedRoll / 45) * maxHBubbleTravel;
        hBubble.style.transform = `translateX(${hBubbleX}px)`;

        const vLevelHeight = vLevel.offsetHeight;
        const vBubbleHeight = vBubble.offsetHeight;
        const maxVBubbleTravel = (vLevelHeight - vBubbleHeight) / 2;
        const vBubbleY = (clampedPitch / 45) * maxVBubbleTravel;
        vBubble.style.transform = `translateY(${vBubbleY}px)`;
    };

    const updateWallMode = (pitch, roll) => {
        const isPortrait = window.innerHeight > window.innerWidth;
        let angle = 0;

        if (isPortrait) {
            // In portrait, roll is the primary leveling axis
            angle = roll - rollOffset;
        } else {
            // In landscape, pitch becomes the primary leveling axis
            angle = pitch - pitchOffset;
        }
        
        const clampedAngle = Math.max(-90, Math.min(90, angle));
        wallDegree.textContent = `${clampedAngle.toFixed(1)}°`;
        
        const wallLevelWidth = wallLevel.offsetWidth;
        const wallBubbleWidth = wallBubble.offsetWidth;
        const maxWallBubbleTravel = (wallLevelWidth - wallBubbleWidth) / 2;
        const wallBubbleX = (clampedAngle / 90) * maxWallBubbleTravel;

        wallBubble.style.transform = `translateX(${wallBubbleX}px)`;
    };


    // --- Permission Handling & Measurement Control ---
    const startMeasuring = () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        isMeasuring = true;
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        window.addEventListener('deviceorientation', handleOrientation);
    };

    const stopMeasuring = () => {
        isMeasuring = false;
        startBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
        window.removeEventListener('deviceorientation', handleOrientation);
        // Reset offsets and audio when stopping
        pitchOffset = 0;
        rollOffset = 0;
        stopContinuousBeep();
    };

    const requestSensorAccess = () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS 13+
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        permissionModal.classList.add('hidden');
                        startMeasuring();
                    } else {
                        alert('Permission denied. The spirit level cannot function without sensor access.');
                    }
                })
                .catch(console.error);
        } else {
            // Non-iOS 13+ browsers
            permissionModal.classList.add('hidden');
            startMeasuring();
        }
    };

    // --- Event Listeners ---
    audioToggle.addEventListener('click', () => {
        isAudioOn = !isAudioOn;
        audioToggle.classList.toggle('active', isAudioOn);
    
        if (isAudioOn) {
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            if(audioContext) {
                lastBeepTime = audioContext.currentTime;
            }
            document.getElementById('audio-on').classList.remove('hidden');
            document.getElementById('audio-off').classList.add('hidden');
        } else {
            stopContinuousBeep();
            document.getElementById('audio-on').classList.add('hidden');
            document.getElementById('audio-off').classList.remove('hidden');
        }
    });

    permissionBtn.addEventListener('click', requestSensorAccess);

    startBtn.addEventListener('click', () => {
        // For non-iOS, or if permission already granted, start.
        if (typeof DeviceOrientationEvent === 'undefined' || typeof DeviceOrientationEvent.requestPermission !== 'function') {
             startMeasuring();
        } else {
             // For iOS, show permission modal.
            permissionModal.classList.remove('hidden');
        }
    });

    stopBtn.addEventListener('click', stopMeasuring);

    zeroBtn.addEventListener('click', () => {
        if (isMeasuring) {
            pitchOffset = lastPitch;
            rollOffset = lastRoll;
        }
    });
});