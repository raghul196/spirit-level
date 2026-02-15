Name :spirit level
Application : Webapp
Type : Static site
Domain : spiritlevel.online
Hosted in : Github pages
contact : contact@pvfreund.com
privacy : no collection of data except goatcounter, where how many are visiting my site.

## App 
1. Tech Stack
- html (no tailwind classes or js code here)
- js (vanilla js)
- css (tailwindcss)

2. Folder Structure
- ./index.html (html file in root)
- ./css/style.css ( all the tailwind classes and style element go here)
- ./js/main.js (vanilla js)
- ./qr (empty folder for now, I will manually include qr pngs here)

3. App visiblity Style, Structure and function
- the entire app is fixed to the size of the available display space tailwind class h-[100dvh]. (accounting for browser address bar and stuff)

- Header - 10% of space
    - left side : logo (i will manually add a png image later)
    - right side: 
        - language button : the button shows svg of a flag for language. on clicking the button the a dialog box appears with flags and language. (i will add other languages later)
        - style switch : shows a svg on clicking which it enables users to switch between light and dark mode.
        - Audio on/off : An svg of speaker to toggle the audio

- content - 80% of the space where all the contents go. this is scrollable in y axis.
    - main content : this is the main content that shows up when the screen loads. it occupies the 80% of screen space. when the site is loaded. i want only the main content to be visible. It is where all the action happen
        - Slider for Modes : There are two modes both represented by svg icons. the rest of the content in main content depend on the mode that is selected
            - Mode 1 surface mode: where the user places the phone flat on a surface to find if the surface is level.
            - Mode 2 Wall model : where the user places the phone along a wall to find for example if the photo is straight. here phone is placed on its side like how someone watches a video

        - surface mode content: 
            - Circular dial: the main element here is a circular dial with a crosshair. inside this dial at the center is a circle which is almost the same size as the bubble 
            - Bubble : the Bubble moves within the circular dial.
            - horizontal level : this is a recangular box that runs left to fight is below the circular dial and is almost the same width as circular dial. this level tells if the phone is horizontally level along x axis (roll). the angle is shown in degree with one decimal precision
            - vertical level : this is a rectangular box that runs top to botom that is almost the same height as  the circular dial. this level tells if the phone is vertically level along y axis (pitch).  the angle is shown in degree with one decimal precision
            - bubble in rectangular level : both the rectangular level has bubbles. the position of bubble in these rectangular level should be representative of the bubble in circular dial, if a rectangular level is placed in its position.
            - Degree values: below the vertical level and to the right of horizontal level, there will be a square. the square is cut into two along its diagnol running top left to botton right. the bottom left part of the square contains degree value of horizontal level and the top right part of the square contains the vertical level degree.
            - this mode measure angle in both x and y axis. 

        - wall mode content : 
            - rectangular spirit level: it has a rectangular box that runs left to right and has the width of the available space. this shows a rectangular spirit level on its side.
            - It also shows angle in degrees with one decimal precision. 
            - this measures angle just one axis. the axis on which the bottom of the phone runs. this should change, when the phone is held portrait or landscape mode.

    - what is spirit level? : give a brief description of what is a spirit level and how it functions
    - uses : explain how this spirit level can solve problem that user has. explain each use case scenarios
    - faq :
    - disclaimer:
    - privacy :
    - footer : 2026@all right reserved

- ad container - 10 % of the space alloted to show ads. for now just show a empty box


4. SEO
- Add meta description, title , schema.org, faq
- optimize for keywords spiritl level online, online spirit level, online bubble level, bubble level online, level surface online, surface level online, how to find if my surface is straight. how to find if my photo is straight, how to find if my tv is straight.