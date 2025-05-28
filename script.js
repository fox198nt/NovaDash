/* NovaDash */
// set variables
const l1 = document.querySelector('#l1');
const l2 = document.querySelector('#l2');
const l3 = document.querySelector('#l3');
const player = document.querySelector('#player');
const block = document.querySelector('#block');
const gameContainer = document.getElementById('game'); // Get the game container
var laneNum = 0;
var jumped = false;
var crouched = false;

// move player script
function movePlayer(lane){
    lane.appendChild(player);
    console.log("Moved player to laneNum " + laneNum);
}

// arrow key movement
document.addEventListener("keydown", event => {
    console.log("key pressed: "+ event.key); // log pressed key

    if(event.key==="ArrowLeft" || event.key==="a") {laneNum -= 1;} // subtracts 1 if a pressed
    if(event.key==="ArrowRight" || event.key==="d"){laneNum += 1;} // adds 1 if d pressed

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

/* function setBlockPos() {
    const blockLaneNum = Math.floor(Math.random() * 3) - 1;

    let targetLaneElement;
    if (blockLaneNum === -1) {
        targetLaneElement = l1;
    } else if (blockLaneNum === 0) {
        targetLaneElement = l2;
    } else { // blockLaneNum === 1
        targetLaneElement = l3;
    }

    if (block.parentNode) {
        block.parentNode.removeChild(block);
    }

    // Append the block to the target lane
    targetLaneElement.appendChild(block);

    console.log(`Block moved to lane: ${targetLaneElement}`);
} */

// Block animation logic
let blockTopPosition = 0;
const blockSpeed = 7; 
const gameHeight = gameContainer.offsetHeight; 

// hit detection
function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();

    if (playerRect.left < blockRect.right &&
        playerRect.right > blockRect.left &&
        playerRect.top < blockRect.bottom &&
        playerRect.bottom > blockRect.top) {
        gameOver();
        return true;
    }
    return false;
}

function gameOver() {
    console.log("Game Over! Collision detected.");
    cancelAnimationFrame(animationFrameId); // Stop the animation loop
}

let animationFrameId; // Variable to hold the requestAnimationFrame ID

function animateBlock() {
  // Update block's top position if it's currently outside a lane (e.g., in the #game container)

  blockTopPosition += blockSpeed;
  block.style.top = blockTopPosition + 'px';

  if (checkCollision()) {
      return;
  }

  // If the block goes past the bottom of the game container
  if (blockTopPosition >= gameHeight) {
    blockTopPosition = -block.offsetHeight; // Reset to just above the top, considering its height
    setBlockHorizontalPositionCorrected(); // Use the corrected function
  }

  animationFrameId = requestAnimationFrame(animateBlock);
}

function setBlockHorizontalPositionCorrected() {
    const blockLaneNum = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1

    let targetLaneElement;
    if (blockLaneNum === -1) {
        targetLaneElement = l1;
    } else if (blockLaneNum === 0) {
        targetLaneElement = l2;
    } else { // blockLaneNum === 1
        targetLaneElement = l3;
    }

    // Get the bounding rectangles relative to the viewport
    const gameRect = gameContainer.getBoundingClientRect();
    const laneRect = targetLaneElement.getBoundingClientRect();

    // Calculate the block's desired 'left' position relative to its parent (#game)
    // The target is the center of the lane, minus the left offset of the game container,
    // and then adjusted by half of the block's own width to truly center it.
    const blockLeftPosition = (laneRect.left + (laneRect.width / 2)) - gameRect.left - (block.offsetWidth / 2);
    block.style.left = blockLeftPosition + 'px';

    console.log(`Block moved horizontally to lane: ${blockLaneNum === -1 ? 'l1' : blockLaneNum === 0 ? 'l2' : 'l3'}`);
}


// --- INITIALIZATION ---
// Initially set the player's position
movePlayer(l2);

// Initially set the block's horizontal position and then start its animation
setBlockHorizontalPositionCorrected(); // Call the corrected function
animateBlock();