kaboom({
  scale: 1,
  background: [10,125,200],
})
loadSpriteAtlas("https://kaboomjs.com/sprites/dungeon.png", "atlas.json");

const levelConfig = {
  width: 16,
  height: 16,
  pos: vec2(32,32),
  "w": () => [
    "wall",
    sprite("wall"),
    area(),
    solid()
  ],
  "b": () => [
    "barrier",
    sprite("wall"),
    area(),
    opacity(0)
  ],
  "o": () => [
    "enemy",
    sprite("ogre",{
      "anim":"run"
    }),
    area({
      "scale":0.50
    }),
    origin("center"),
    {
      "xVel": 30
    }
  ],
  "z": () => [
    "enemy",
    sprite("zombie",{
      "anim":"run"
    }),
    area({
      "scale":0.50
    }),
    origin("center"),
    {
      "xVel": 30
    }
  ],
  "6": () => [
    "enemy",
    sprite("devil",{
      "anim":"run"
    }),
    area({
      "scale":0.50
    }),
    origin("center"),
    {
      "xVel": 30
    }
  ],
  "/": () => [
    "wizard",
    sprite("wizard"),
    area({
      "scale": 0.60
      }),
    solid(),
    origin("center")
  ],
  "c": () => [
    "chest",
    sprite("chest"),
    area(),
    solid(),
    origin("top")
  ],
   "$": () => [
    "coin",
    sprite("coin"),
    area(),
    origin("top")
  ],
  "h": () => [
    "health potion",
    sprite("health potion"),
    area(),
    origin("top")
  ]
}
  
const levels = [
  [
    "                                 w              ",
    "                                 w              ",
    "                                 w              ",
    "                 b  $  o  $  b   w              ",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww  w              ",
    "                              w  w              ",
    "                              w  w              ",
    "                              w  w              ",
    "b    oc    b      $$$$  $$$$                  / ",
    "wwwwwwwwwwww  ww  wwww  wwwwwwwwwwwwwwwww   wwww",
  ],
  
  [
    "                         wwwwwwwwwwwwww",
    "                         w            w",
    "                         w /  $$      w",
    "wwww                     wwwwwww      w",
    "w                        w          www",
    "w                              $$  wwww",
    "w                             www     w",
    "w             b$  o $b   www          w",
    "w c    $$$$   wwwwwwww   w            w",
    "wwww   wwww              w            w",
  ],
  
  [
    "w                           w",
    "w                           w",
    "wwww                        w",
    "w                           w",
    "w                           w",
    "w      b  6  $$  6  b       w",
    "w      wwwwwwwwwwwwww       w",
    "w                       $$$$w",
    "w                       wwwww",
    "w                           w",
    "wb  o   b                   w",
    "wwwwwwwww      h            w",
    "w            wwww    $$     w",
    "w                   wwww    w",
    "w         $   $             w",
    "w c     wwwwwwwww           w",
    "wwww                        w",
    "w     b  6   b              w",
    "w     wwwwwwww    b  o   b  w",
    "w                 wwwwwwwwwww",
    "w                           w",
    "w                           w",
    "w  b  o   b                 w",
    "w  wwwwwwww   b  6   b      w",
    "w             wwwwwwww     /w",
    "w                        wwww",
  ],
  
  [
    "w                                                                             w",
    "w                        b 6    b             $                               w",
    "w            $$$         wwwwwwww             w                $   $   $      w",
    "w            www    ww              $$$     w w     c          w   w   w     /w",
    "wwwww   www                         www  w    w   wwww  w  w   w   w   w   wwww",
  ],
  
  [
    "w   wwwwwwwwwwwwwwwwwwwwwwwww",
    "w                           w",
    "w                           w",
    "w                           w",
    "w   b   o    o    o   o   b w",
    "wwwwwwwwwwwwwwwwwwwwwwwwwww w",
    "w                           w",
    "w              h            w",
    "w                           w",
    "w   b   o  o   o   o  o   b w",
    "w wwwwwwwwwwwwwwwwwwwwwwwwwww",
    "w                           w",
    "w              h            w",
    "w                           w",
    "w   b   6    6   6    6   b w",
    "wwwwwwwwwwwwwwwwwwwwwwwwwww w",
    "w                           w",
    "w              h            www",
    "w                             w",
    "w / b                     b  cw",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
  ]
]

let levelNum = 0

scene("game",() => {
  
  let hp = 3
  
  let score = 0
  
  const scoreLabel = add([
    text("Score: 0",{
      "size":16
    }),
    pos(75,16),
    fixed()
  ])
  
  let hasKey = false
  
  const level = addLevel(levels[levelNum],levelConfig)
  
  const hpLabel = add([
    text("hp: "+hp,{
      "size":16
    }),
    pos(16,16),
    fixed()
  ])

  const player = add([
      sprite("hero"),
      pos(level.getPos(2,0)),
      area({scale:0.5}),
      solid(),
      origin("bot"),
      body(),
      {
        "speed": 150,
        "jumpforce": 375
      }
  ]);
  
  player.onCollide("coin",(c) => {
  destroy(c)
  score += 10
  scoreLabel.text = "Score: "+score
})
  
  player.play("idle")
  
  onUpdate("enemy",(e) => {
    e.move(e.xVel,0)
  })
  
  onUpdate(() => {
  camPos(player.pos.x,225)
})
  
  onCollide("enemy","barrier",(e,b) => {
    e.xVel = -e.xVel
    if (e.xVel < 2) {
      e.flipX(true)
    }
    else {
      e.flipX(false)
    }
    
  })
  
  onKeyPress("space",() => {
    if (player.isGrounded()) {
      player.jump(player.jumpforce)
      player.play("hit")
    }
  })
  
  player.onCollide("wall",() => {
    player.play("idle")
  })
  
  player.onCollide("enemy",() => {
    addKaboom(player.pos)
    
    hp--
    hpLabel.text = "hp: "+hp
    if (hp == 0) {
      destroy(player)
      wait(1,() => {
      go("lose")
    })
   }
  
  player.onCollide("health potion",(h) => {
  destroy(h)
  hp += 1
  hpLabel.text = "hp: "+hp
  })
  
 })
  
  player.onCollide("chest",(c) => {
    c.play("open")
    hasKey = true
  })
  
  player.onCollide("wizard",() => {
    if (hasKey) {
   if (levelNum == levels.length - 1) {
      go("win")
    }
    else {
      levelNum++
      localStorage.setItem("level",levelNum)
      go("game")
     }   
    }
  })
  
  onKeyDown("right",() => {
    player.move(player.speed,0)
    player.flipX(false)
  })
  
  onKeyDown("left",() => {
    player.move(-player.speed,0)
    player.flipX(true)
  })
  
  onKeyPress(["right","left"],() => {
    player.play("run")
  })
  
  onKeyRelease(["right","left"],() => {
    player.play("idle")
  })
  
}) //CLOSE game

scene("menu",() => {
  add([
    text("Dragon World"),
    pos(width()/2,height()/2),
    origin("center")
  ])
  add([
    text("PLAY"),
    "playButton",
    pos(width()/2,height()/2+75),
    origin("center"),
    area()
  ])
  add([
    text("Continue?"),
    "continue",
    pos(width()/2,height()/2+150),
    origin("center"),
    area()
  ])
  
  onClick("playButton",() => {
    go("game")
  })
})

scene("win",() => {
  add([
    text("You Win!"),
    pos(width()/2,height()/2),
    origin("center")
  ])
  add([
    text("Play Again"),
    "playButton",
    pos(width()/2,height()/2+75),
    origin("center"),
    area()
  ])
  
  onClick("playButton",() => {
    go("game")
  })
})

scene("lose",() => {
  add([
    text("You Lose!"),
    pos(width()/2,height()/2),
    origin("center")
  ])
  add([
    text("RETRY"),
    "playButton",
    pos(width()/2,height()/2+75),
    origin("center"),
    area()
  ])
  
  onClick("playButton",() => {
    go("game")
  })
  onClick("continue",() => {
    levelNum = localStorage.getItem("level") || 0
    go("game")
  })
})

go("menu")