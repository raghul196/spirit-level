document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const themeSwitch = document.getElementById('theme-switch');
    const themeIconLight = document.getElementById('theme-icon-light');
    const themeIconDark = document.getElementById('theme-icon-dark');
    const permissionModal = document.getElementById('permission-modal');
    const permissionBtn = document.getElementById('permission-btn');
    
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
    let zeroOnStart = false;

    let isSurfaceMode = true;

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

    // --- Sensor Logic ---
    const handleOrientation = (event) => {
        const { beta, gamma } = event; // beta: pitch (y-axis), gamma: roll (x-axis)
        
        if (isSurfaceMode) {
            updateSurfaceMode(beta, gamma);
        } else {
            updateWallMode(beta, gamma);
        }
    };

    const updateSurfaceMode = (pitch, roll) => {
        // Clamp angles to prevent extreme values
        const clampedPitch = Math.max(-90, Math.min(90, pitch));
        const clampedRoll = Math.max(-90, Math.min(90, roll));

        // Update degree text
        degreeX.textContent = `${clampedRoll.toFixed(1)}°`;
        degreeY.textContent = `${clampedPitch.toFixed(1)}°`;

        // Calculate bubble positions
        const dialRadius = circularDial.offsetWidth / 2;
        const bubbleRadius = bubbleMain.offsetWidth / 2;
        const maxBubbleTravel = dialRadius - bubbleRadius;

        const bubbleX = (clampedRoll / 90) * maxBubbleTravel;
        const bubbleY = (clampedPitch / 90) * maxBubbleTravel;
        
        bubbleMain.style.transform = `translate(${bubbleX}px, ${bubbleY}px)`;

        // Update rectangular levels
        const hLevelWidth = hLevel.offsetWidth;
        const hBubbleWidth = hBubble.offsetWidth;
        const maxHBubbleTravel = (hLevelWidth - hBubbleWidth) / 2;
        const hBubbleX = (clampedRoll / 90) * maxHBubbleTravel;
        hBubble.style.transform = `translateX(${hBubbleX}px)`;

        const vLevelHeight = vLevel.offsetHeight;
        const vBubbleHeight = vBubble.offsetHeight;
        const maxVBubbleTravel = (vLevelHeight - vBubbleHeight) / 2;
        const vBubbleY = (clampedPitch / 90) * maxVBubbleTravel;
        vBubble.style.transform = `translateY(${vBubbleY}px)`;
    };

    const updateWallMode = (pitch, roll) => {
        const isPortrait = window.innerHeight > window.innerWidth;
        let angle = 0;

        if (isPortrait) {
            // In portrait, roll is the primary leveling axis
            angle = roll;
        } else {
            // In landscape, pitch becomes the primary leveling axis
            angle = pitch;
        }
        
        const clampedAngle = Math.max(-90, Math.min(90, angle));
        wallDegree.textContent = `${clampedAngle.toFixed(1)}°`;
        
        const wallLevelWidth = wallLevel.offsetWidth;
        const wallBubbleWidth = wallBubble.offsetWidth;
        const maxWallBubbleTravel = (wallLevelWidth - wallBubbleWidth) / 2;
        const wallBubbleX = (clampedAngle / 90) * maxWallBubbleTravel;

        wallBubble.style.transform = `translateX(${wallBubbleX}px)`;
    };


    // --- Permission Handling ---
    const requestSensorAccess = () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS 13+
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                        permissionModal.classList.add('hidden');
                    } else {
                        alert('Permission denied. The spirit level cannot function without sensor access.');
                    }
                })
                .catch(console.error);
        } else {
            // Non-iOS 13+ browsers
            window.addEventListener('deviceorientation', handleOrientation);
            permissionModal.classList.add('hidden');
        }
    };

    // --- Initialization ---
    startBtn.addEventListener('click', async () => {
    // Check if we are on a non-iOS device that doesn't require a permission prompt
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission !== 'function') {
            window.addEventListener('deviceorientation', handleOrientation);
            startBtn.classList.add('hidden');
            stopBtn.classList.remove('hidden');
            isMeasuring = true;

        } else {
            // On iOS or other devices that may require it, show the prompt
            permissionModal.classList.remove('hidden');
        }

        permissionBtn.addEventListener('click', requestSensorAccess);
    });

    stopBtn.addEventListener('click', ()=>{
        window.removeEventListener('deviceorientation', handleOrientation);
        startBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
        isMeasuring = false;
        zeroOnStart = false;
    });

});