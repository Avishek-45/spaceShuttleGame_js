var ship = document.getElementById("ship");
var screen = document.getElementById("screen");
var count = 0;

//Main event
window.addEventListener("keydown", (e) => {
  moveRocket(e);
  shootBullet(e);
});

//Moving rocket
function moveRocket(e) {
  let left = parseInt(window.getComputedStyle(ship).getPropertyValue("left"));
  let bottom = parseInt(
    window.getComputedStyle(ship).getPropertyValue("bottom")
  );

  if (e.key == "ArrowLeft" && left > 0) {
    ship.style.left = left - 10 + "px";
  }
  // screenWidth - shipWidth
  else if (e.key == "ArrowRight" && left <= 460) {
    ship.style.left = left + 10 + "px";
  } else if (e.key == "ArrowUp" && bottom <= 450) {
    ship.style.bottom = bottom + 10 + "px";
  } else if (e.key == "ArrowDown" && bottom > 0) {
    ship.style.bottom = bottom - 10 + "px";
  }
}

//Making random Asteriods
var multipleAsteriod = setInterval(() => {
  multipleAsteriods();
}, 3000);

function multipleAsteriods() {
  let rock = document.createElement("div");
  rock.classList.add("asteriods");

  // var rockLeft=parseInt(window.getComputedStyle(rock).getPropertyValue("left"));
  rock.style.left = Math.floor(Math.random() * 450) + "px";
  screen.appendChild(rock);
}

//Making asteriods move

var moverocks = setInterval(() => {
  const rocks = document.getElementsByClassName("asteriods");

  if (rocks != undefined) {
    for (let i = 0; i < rocks.length; i++) {
      // increasing the top of rock to move down
      let rock = rocks[i];
      let rocktop = parseInt(
        window.getComputedStyle(rock).getPropertyValue("top")
      );
        if(rocktop>=450){
          gameOver();
        }
      rock.style.top = rocktop + 5 + "px";
    }
  }
}, 200);

function shootBullet(e) {
  if (e.keyCode == 32) {
    //finding the excact location of the ship
    let shipBottom = parseInt(
      window.getComputedStyle(ship).getPropertyValue("bottom")
    );
    shipBottom += 40;

    let shipLeft = parseInt(
      window.getComputedStyle(ship).getPropertyValue("left")
    );
    shipLeft += 5;

    const bullet = document.createElement("div");
    bullet.classList.add("bullet");

    bullet.style.bottom = `${shipBottom}px`; //to make button appear at top of ship
    bullet.style.left = `${shipLeft}px`; //to make button appear at top of ship

    screen.appendChild(bullet);

    //moving the bullet
    var movebullet = setInterval(() => {
      let bulletBottom = parseInt(
        window.getComputedStyle(bullet).getPropertyValue("bottom")
      );

      if (bulletBottom > 500) {
        //when bullet moves pass the screen,its movement is stopped and deleted
        clearInterval(movebullet);
        bullet.parentElement.removeChild(bullet);
      }

      bullet.style.bottom = bulletBottom + 3 + "px"; //making bullet move after every 10 millisecod.
      destroyAsteriod(bullet, shipBottom, shipLeft);
    }, 10);
  }
}

function destroyAsteriod(bullet) {
  const asteriod = document.getElementsByClassName("asteriods");

  for (let i = 0; i < asteriod.length; i++) {
    let rock = asteriod[i];
    if (rock != undefined) {
      const asteriodPosition = rock.getBoundingClientRect(); //getting the postion of asteriod in every movement
      const bulletPosition = bullet.getBoundingClientRect(); //getting the postion of bullet in every movement
      //checks if bullet and asteriod are in same position or not
      if (
        bulletPosition.left >= asteriodPosition.left &&
        bulletPosition.right <= asteriodPosition.right &&
        bulletPosition.top <= asteriodPosition.top &&
        bulletPosition.bottom <= asteriodPosition.bottom
      ) {
        count = count + 1;
        rock.classList.add("explosion");
        rock.style.left = asteriodPosition.left;
        rock.style.bottom = asteriodPosition.bottom;
        var audio = new Audio("assets/sounds/sound2.mp3");
        audio.play();
        bullet.parentElement.removeChild(bullet); //removing bullet when it hits asteriod
        setTimeout(() => {
          rock.remove();
        }, 96); //removing asteriods when bullet hits it
        document.getElementById("score").children[1].innerHTML = count;
        var getTotalScore=count;
      }
    }
  }
}

var shipCollision = setInterval(() => {
  const asteriod = document.getElementsByClassName("asteriods");
  for (let i = 0; i < asteriod.length; i++) {
    let rock = asteriod[i];

    if (rock != undefined) {
      const asteriodPosition = rock.getBoundingClientRect(); //getting the postion of asteriod in every movement
      const shipPosition = ship.getBoundingClientRect();

      //check if rocket and asteriod collides or not
      if (
        shipPosition.left >= asteriodPosition.left &&
        shipPosition.right <= asteriodPosition.right &&
        shipPosition.top >= asteriodPosition.top &&
        shipPosition.bottom <= asteriodPosition.bottom
      ) {
        count = count + 1;
        document.getElementById("lifeLine").innerHTML =
          parseInt(document.getElementById("lifeLine").innerHTML) - 1;
        // console.log(count)

        var audio = new Audio("assets/sounds/sound1.mp3");
        audio.play();
        rock.classList.add("explosion");
        setTimeout(() => {
          rock.remove();
        }, 96); //removing asteriods when bullet hits it
        
        ship.style.left = "50%";
        ship.style.bottom = "0px";
        ship.classList.add("blink");
        setTimeout(() => {
          ship.classList.remove("blink");
        }, 2000);
        if (count == 3) {
          gameOver();
        }
      }
    }
  }
});

function gameOver() {
  clearInterval(moverocks);
  clearInterval(multipleAsteriod);
  clearInterval(shipCollision);
  const gameOver = document.querySelector(".gameover");
  gameOver.classList.remove("hide");
  screen.classList.add("hide");
  document.querySelector(".score").parentElement().remove();
  // document.getElementById("lifeLine").innerHTML = 0;
  // document.getElementById("score").children[1].innerHTML = 0;
  document.getElementById("gameoverScore").children[0].innerHTML = getTotalScore;
}

function restart() {
  location.reload();
}
