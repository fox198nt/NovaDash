/* NovaDash BETA 1.2*/
// set variables
const l1 = document.querySelector('#l1');
const l2 = document.querySelector('#l2');
const l3 = document.querySelector('#l3');
const player = document.querySelector('#player');
const block = document.querySelector('#block');
const block2 = document.querySelector('#block2'); // Ensure this is selected from HTML
const gameContainer = document.getElementById('game'); // Get the game container
var laneNum = 0;
var jumped = false;
var crouched = false;

let animationFrameId;
let blockTopPosition = 0;
let block2TopPosition = 0;
const blockSpeed = 12.5; 

const gameHeight = gameContainer.offsetHeight; 
let block2Active = false;

// move player script
function movePlayer(lane){
    lane.appendChild(player);
    console.log("Moved player to laneNum " + laneNum);
}

// arrow key movement
document.addEventListener("keydown", event => {
    console.log("key pressed: "+ event.key); // log pressed key

    if(event.key==="ArrowLeft" || event.key==="a") {laneNum -= 1;} // subtracts 1 if a key or left arrow pressed
    if(event.key==="ArrowRight" || event.key==="d"){laneNum += 1;} // adds 1 if d key or right arrow spressed

    if(event.key===" " || event.key==="w" || event.key==="ArrowUp") {
        player.classList.add("jump"); // add jump class
        jumped = true;
        console.log('player has jumped');

        setTimeout(() => { // remove jump class after 1s
            player.classList.remove("jump");
            jumped = false;
            console.log("jump class removed");
        }, 1000);
    }
    
    if(event.key==="Shift" || event.key==="s" || event.key==="ArrowDown") {
        player.classList.add("crouch"); // add crouch class
        crouched = true;
        console.log('player has crouched');

        setTimeout(() => { // remove crouch class after 1s
            player.classList.remove("crouch");
            crouched = false;
            console.log("crouch class removed");
        }, 1000);
    }
    
    // number based lane movement
    if(laneNum === 0) {
        movePlayer(l2);
    } else if(laneNum === 1) {
        movePlayer(l3);
    } else if(laneNum === -1) {
        movePlayer(l1);
    } else if(laneNum > 1) {
        laneNum = 1;
    } else if(laneNum < -1) {
        laneNum = -1;
    }
});

// hit detection
function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();

    // Check collision with block 1 (always present)
    if (playerRect.left < blockRect.right &&
        playerRect.right > blockRect.left &&
        playerRect.top < blockRect.bottom &&
        playerRect.bottom > blockRect.top) {
        // Simple hit/pass check: if player is jumping and their bottom is above block's top, it's a pass
        // Or if player is crouching and their top is below block's bottom, it's a pass.
        if ((jumped && playerRect.bottom < blockRect.top + (blockRect.height * 0.3)) ||
            (crouched && playerRect.top > blockRect.bottom - (blockRect.height * 0.3))) {
            return false; // Player cleared the obstacle
        } else {
            gameOver();
            return true;
    }}

    // Check collision with block 2, only if it's active
    if (block2Active) {
        const block2Rect = block2.getBoundingClientRect();
        if (playerRect.left < block2Rect.right &&
            playerRect.right > block2Rect.left &&
            playerRect.top < block2Rect.bottom &&
            playerRect.bottom > block2Rect.top) {
            
            if ((jumped && playerRect.bottom < block2Rect.top + (block2Rect.height * 0.3)) ||
                (crouched && playerRect.top > block2Rect.bottom - (block2Rect.height * 0.3))) {
                return false; // Player cleared the obstacle
            }
            gameOver();
            return true;
        }
    }
    return false;
}

// game over script
function gameOver() {
    console.log("Game Over! Collision detected.");
    cancelAnimationFrame(animationFrameId); // Stop the animation loop
}

// block movement, block 2 channce
function animateBlock() {
    blockTopPosition += blockSpeed;
    block.style.top = blockTopPosition + 'px';

    // Animate block2 only if it's active
    if (block2Active) {
        block2TopPosition += blockSpeed;
        block2.style.top = block2TopPosition + 'px';
    }

    if (checkCollision()) {
        return;
    }

    // If the main block goes past the bottom of the game container
    if (blockTopPosition >= gameHeight) {
        blockTopPosition = -block.offsetHeight; // Reset block 1 to top
        block2TopPosition = -block2.offsetHeight; // Reset block 2 to top (even if not active)

        // Reset block's position to its original parent (gameContainer) if needed,
        // before appending to a new lane. This is important to ensure it's removed
        // from the previous lane's child list.
        // Assuming gameContainer is the original parent:
        if (block.parentNode !== gameContainer) { // Adjust gameContainer if its parent is different
            gameContainer.appendChild(block);
        }
        if (block2.parentNode !== gameContainer) { // Adjust gameContainer if its parent is different
            gameContainer.appendChild(block2);
        }
        
        // ALWAYS position block 1
        setBlockHorizontalPosition(block);

        // THEN, determine if block 2 should be active
        if (Math.random() < 0.25) { // 25% chance for block2
            block2Active = true;
            // Pass the element of the lane block is currently in to avoid it for block2
            setBlockHorizontalPosition(block2, block.parentNode); 
            block2.style.display = 'block'; // Make block2 visible
            block.style.display = 'block'; // Ensure block 1 is visible
        } else {
            block2Active = false;
            block2.style.display = 'none'; // Hide block2
            block.style.display = 'block'; // Ensure block 1 is visible
        }
    }

    animationFrameId = requestAnimationFrame(animateBlock);
}

// Function to set horizontal position of a given block element
// It now accepts an optional 'avoidLaneElement' to prevent placing the block in that lane
function setBlockHorizontalPosition(targetBlock, avoidLaneElement = null) {
    const lanes = [l1, l2, l3];
    let selectedLaneElement;
    let availableLanes = lanes;

    // If an avoidLaneElement is provided, filter it out from available lanes
    if (avoidLaneElement) {
        availableLanes = lanes.filter(lane => lane !== avoidLaneElement);
    }
    
    // Choose a random lane from the available ones
    const randomIndex = Math.floor(Math.random() * availableLanes.length);
    selectedLaneElement = availableLanes[randomIndex];

    // Append the block to the selected lane
    selectedLaneElement.appendChild(targetBlock);
    
    console.log(`Block ${targetBlock.id} moved horizontally to lane: ${selectedLaneElement.id}`);
}


// --- INITIALIZATION ---
// Initially set the player's position
movePlayer(l2);

// Initially set the block's horizontal position and then start its animation
block2.style.display = 'none'; // Ensure block2 is hidden at start
setBlockHorizontalPosition(block); // Always spawn block 1 initially
animateBlock();

// about half the work is done by gemini lol