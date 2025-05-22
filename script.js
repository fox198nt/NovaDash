/* NovaDash */
// set variables
const l1 = document.getElementById('l1')
const l2 = document.getElementById('l2')
const l3 = document.getElementById('l3')
const player = document.querySelector('#player')
var laneNum = 0

// move player script
function movePlayer(lane){
    lane.appendChild(player)
    console.log("Moved player to laneNum " + laneNum)
}

// arrow key movement
document.addEventListener("keydown", event => {
    console.log("key pressed: "+ event.key) // log pressed key

    if(event.key==="ArrowLeft" || event.key==="a") {laneNum -= 1} // subtracts 1 if a pressed
    if(event.key==="ArrowRight" || event.key==="d"){laneNum += 1} // adds 1 if d pressed

    if(event.key===" " || event.key==="w" || event.key==="ArrowUp") {
        player.classList.add("jump") // add jump class
        console.log('player has jumped')

        setTimeout(() => { // remove jump class after 1s
            player.classList.remove("jump")
            console.log("jump class removed")
        }, 1000);
    }
    
    // number based lane movement
    if(laneNum === 0) {
        movePlayer(l2)
    } else if(laneNum === 1) {
        movePlayer(l3)
    } else if(laneNum === -1) {
        movePlayer(l1)
    } else if(laneNum > 1) {
        laneNum = 1
    } else if(laneNum < -1) {
        laneNum = -1
    }
})