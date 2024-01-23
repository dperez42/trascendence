<template>
    <div v-if="game">
      <!-- <div @click.prevent="Pres([{x:1,y:2,z:0}, {x:1,y:2,z:10}])" >test</div> -->
      <svg xmlns="http://www.w3.org/2000/svg"  
        viewBox="0 0 1000 500"
        font-size="24">
        <defs>
          <filter id="f1" x="0" y="0">
            <feGaussianBlur in="SourceGraphic" stdDeviation="55" />
          </filter>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
          </linearGradient>
        </defs>
        <g v-if="game.game_type != 4">
          <!-- campo -->
          <rect v-if="game.game_type===1" width="1000" height="500" style="fill:rgb(113, 199, 52);stroke-width:3;stroke:rgb(0,0,0)" filter="url(#f1)"/>
          <rect v-if="game.game_type===2"  width="1000" height="500" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" filter="url(#f1)"/>
          <rect v-if="game.game_type===3"  width="1000" height="500" style="fill:rgb(229, 43, 37);stroke-width:3;stroke:rgb(0,0,0)" filter="url(#f1)"/>
          <line x1="500" y1="0" x2="500" y2="500" style="stroke:rgb(255, 255, 255);stroke-width:2" />
          <circle cx="500" cy="250" r="60" style="stroke:rgb(255, 255, 255);stroke-width:2; fill-opacity:.0"/>
          <!-- barriers -->
          <!-- level 1 -->
          <image v-if="game.game_type===1 && game.game_status!=2" x="450" y="400" width="100" height="100" href="../../assets/wartortle.svg" />
          <!-- level 2 -->
          <line v-if="game.game_type>=2" x1="401" y1="51" x2="401" y2="151" style="stroke:rgb(0, 0, 0);stroke-width:4" />
          <line v-if="game.game_type>=2" x1="401" y1="351" x2="401" y2="451" style="stroke:rgb(0, 0, 0);stroke-width:4" />
          <line v-if="game.game_type>=2" x1="599" y1="51" x2="599" y2="151" style="stroke:rgb(0, 0, 0);stroke-width:4" />
          <line v-if="game.game_type>=2" x1="599" y1="351" x2="599" y2="451" style="stroke:rgb(0, 0, 0);stroke-width:4" />
          <image v-if="game.game_type===2 && game.game_status!=2" x="450" y="400" width="100" height="100" href="../../assets/picachu.svg" />
            <!-- level 3 -->
          <line v-if="game.game_type>2" x1="500" y1="201" x2="500" y2="299" style="stroke:rgb(0, 0, 0);stroke-width:4" />
          <image v-if="game.game_type===3 && game.game_status!=2" x="450" y="400" width="100" height="100" href="../../assets/ivysaur.svg" style="fill-opacity:.5"/>
          <!-- nombres y ptos -->
          <text  text-anchor="start" x="10" y="30" fill="white">{{game.p1nick}}</text>
          <text x="485" y="30" text-anchor="end" fill="white">{{game.p1ptos}}</text>
          <text   text-anchor="end" x="985" y="30" fill="white">{{game.p2nick}}</text>
          <text x="515" y="30" text-anchor="start" fill="white">{{game.p2ptos}}</text>
          <text  v-if="game.game_status!=2" text-anchor="middle" x="500" y="495" fill="white"> LEVEL {{game.game_type}}</text>
          <!-- ball -->
          <circle :cx=game.ballpos[0]-game.ballrad :cy=game.ballpos[1]-game.ballrad :r=game.ballrad fill="#fff"/>        
          <!-- paleta player 1 -->
          <rect :x=10-game.pad[0] :y=game.p1y-game.pad[1]/2 :width=game.pad[0] :height=game.pad[1] style="fill:rgb(255, 0, 30);stroke-width:3;stroke:rgb(0,0,0)"/>
          <!-- paleta player 2 -->
          <rect :x=990 :y=game.p2y-game.pad[1]/2 :width=game.pad[0] :height=game.pad[1] style="fill:rgb(255, 0, 30);stroke-width:3;stroke:rgb(0,0,0)"/>
        </g>
        <!-- 3D Game -->
        <g v-if="game.game_type === 4">
          <!-- fondo -->
          <rect width="1000" height="500" style="fill:rgb(0, 0,0);stroke-width:3;stroke:rgb(255, 255, 255)" />
          <!--campo-->
          <polygon  :points="Pres([{x:0,y:0,z:0}, {x:1000,y:0,z:0}, {x:1000,y:500,z:0}, {x:0,y:500,z:0}], cam)" style="fill:rgb(21, 139, 45);stroke-width:1;stroke:rgb(255, 255, 255)" />
          <!-- laterales -->
          <polygon  :points="Pres([{x:0,y:0,z:0}, {x:1000,y:0,z:0}, {x:1000,y:0,z:20}, {x:0,y:0,z:20}], cam)" style="fill:rgb(63, 69, 65);stroke-width:1;stroke:rgb(255, 255, 255)" />
          <polygon  :points="Pres([{x:0,y:500,z:0}, {x:1000,y:500,z:0}, {x:1000,y:500,z:20}, {x:0,y:500,z:20}], cam)" style="fill:rgb(63, 69, 65);stroke-width:1;stroke:rgb(255, 255, 255)" />
          <!-- linea centro campo -->
          <polygon  :points="Pres([{x:500,y:0,z:0}, {x:500,y:500,z:0}, {x:500,y:0,z:0}], cam)" style="fill:rgb(0, 0,0);stroke-width:1;stroke:rgb(255,255,255)" />
          <!--Player 2-->
          <polygon  :points="Pres([{x:990,y:game.p2y-game.pad[1]/2,z:0}, {x:990,y:game.p2y+game.pad[1]/2,z:0}, {x:990,y:game.p2y+game.pad[1]/2,z:20}, {x:990,y:game.p2y-game.pad[1]/2,z:20}], cam)" style="fill:rgb(34, 255, 0);stroke-width:1;stroke:rgb(255,255,255)" />
          <!--Player 1-->
          <polygon  :points="Pres([{x:10,y:game.p1y-game.pad[1]/2,z:0}, {x:10,y:game.p1y+game.pad[1]/2,z:0}, {x:10,y:game.p1y+game.pad[1]/2,z:20}, {x:10,y:game.p1y-game.pad[1]/2,z:20}], cam)" style="fill:rgb(238, 11, 11);stroke-width:1;stroke:rgb(255,255,255)" />
          <!-- ball shadow-->
          <polygon  :points="Pres([{x:(game.ballpos[0]-game.ballrad/2+20),y:(game.ballpos[1]-game.ballrad/2+20),z:0}, {x:(game.ballpos[0]-game.ballrad/2+20),y:(game.ballpos[1]+game.ballrad/2+20),z:0}, {x:(game.ballpos[0]+game.ballrad/2+20),y:(game.ballpos[1]+game.ballrad/2+20),z:0}, {x:(game.ballpos[0]+game.ballrad/2+20),y:game.ballpos[1]-game.ballrad/2+20,z:0}], cam)" style="fill:rgb(108, 95, 107)" />
           <!-- ball -->
          <polygon  :points="Pres([{x:(game.ballpos[0]-game.ballrad/2),y:(game.ballpos[1]-game.ballrad/2),z:10}, {x:(game.ballpos[0]-game.ballrad/2),y:(game.ballpos[1]+game.ballrad/2),z:10}, {x:(game.ballpos[0]+game.ballrad/2),y:(game.ballpos[1]+game.ballrad/2),z:10}, {x:(game.ballpos[0]+game.ballrad/2),y:game.ballpos[1]-game.ballrad/2,z:10}], cam)" style="fill:rgb(255, 9, 222);stroke-width:1;stroke:rgb(255,255,255)" />
          <!-- nombres y ptos -->
          
          <text  text-anchor="start" x="10" y="30" fill='red'>{{game.p1nick}}</text>
          <text x="485" y="30" text-anchor="end" fill="white">{{game.p1ptos}}</text>
          <text   text-anchor="end" x="985" y="30" fill='green'>{{game.p2nick}}</text>
          <text x="515" y="30" text-anchor="start" fill="white">{{game.p2ptos}}</text>
          <!--
          <text  text-anchor="start" x="10" y="30" fill="white">{{cam.Ox}}</text>
          <text  text-anchor="start" x="10" y="60" fill="white">{{cam.Oy}}</text>
          <text  text-anchor="start" x="10" y="90" fill="white">{{cam.Oz}}</text>
          -->
          <text x="950" y="430" font-size="smaller" text-anchor="end" fill="white">Camera Moves</text>
          <text x="950" y="450" font-size="smaller" text-anchor="end" fill="white"> Till: U-O</text>
          <text x="950" y="470" font-size="smaller" text-anchor="end" fill="white"> Roll: J-L</text>
          <text x="950" y="490" font-size="smaller" text-anchor="end" fill="white"> Pan: I-K</text>
          <text x="860" y="450" font-size="smaller" text-anchor="end" fill="white"> X: CURSOR</text>
          <text x="860" y="470" font-size="smaller" text-anchor="end" fill="white"> Y: CURSOR</text>
          <text x="860" y="490" font-size="smaller" text-anchor="end" fill="white"> Z: W-S</text>
          <text x="10" y="430" font-size="smaller" text-anchor="start" fill="white">Player Moves</text>
          <text x="10" y="450" font-size="smaller" text-anchor="start" fill="white"> Pad left: Q-Z</text>
          <text x="10" y="470" font-size="smaller" text-anchor="start" fill="white"> Pad right: A-X</text>
          <text x="10" y="490" font-size="smaller" text-anchor="start" fill="white"> Reset: SPACE</text>
        </g>

        <!--Game status = 0 Enter the game or Waiting for your opponent-->
        <text v-if="game.game_status===0 && ((user_nick === game.p1nick && game.p1_state===false) || (user_nick === game.p2nick && game.p2_state===false))" font-size="56" x="500" y="250" text-anchor="middle" fill="white">Enter de game</text>
        <!--Button enter de game-->
        <text v-if="game.game_status===0 && ((user_nick === game.p1nick && game.p1_state===false) || (user_nick === game.p2nick && game.p2_state===false))" font-size="25" x="500" y="290" text-anchor="middle" fill="white">Press</text>
        <rect v-if="game.game_status===0 && ((user_nick === game.p1nick && game.p1_state===false) || (user_nick === game.p2nick && game.p2_state===false))" :x=450 :y=255 :width="100" :height="50" @click.prevent="enter_Game" style="fill:rgb(255, 0, 30);fill-opacity:0.5;stroke-width:3;stroke:rgb(0,0,0)"/>
        <text v-if="game.game_status===0 && ((user_nick === game.p1nick && game.p1_state===true && game.p2_state===false) || (user_nick === game.p2nick && game.p2_state===true && game.p1_state===false))" font-size="56" x="500" y="250" text-anchor="middle" fill="white">Waiting for oponnent  {{ game.game_count }}</text>
        <!--Game status = 1 Start in ...-->
        <text v-if="game.game_status===1" font-size="56" x="500" y="250" text-anchor="middle" fill="white">Game start in {{game.game_count}}</text>
        <!--Game status = 2 Finish in ...-->
        <text v-if="game.game_status===2 && game.game_count <= 5" font-size="56" x="500" y="250" text-anchor="middle" fill="white">{{game.game_count}}</text>
        <!--Game status = 3 finish show result ...-->
        <text v-if="game.game_status===3" font-size="56" x="500" y="300" text-anchor="middle" fill="white">{{game.game_count}}</text>          
        <text v-if="user_nick === game.p1nick && game.game_status===3 && game.p1ptos > game.p2ptos" font-size="56" x="500" y="250" text-anchor="middle" fill="white">YOU WIN</text>
        <text v-if="user_nick === game.p2nick && game.game_status===3 && game.p2ptos > game.p1ptos" font-size="56" x="500" y="250" text-anchor="middle" fill="white">YOU WIN</text>
        <text v-if="user_nick === game.p1nick && game.game_status===3 && game.p1ptos < game.p2ptos" font-size="56" x="500" y="250" text-anchor="middle" fill="white">YOU LOOSE</text>
        <text v-if="user_nick === game.p2nick && game.game_status===3 && game.p2ptos < game.p1ptos" font-size="56" x="500" y="250" text-anchor="middle" fill="white">YOU LOOSE</text>
        <text v-if="game.game_status===3 && game.p2ptos === game.p1ptos" font-size="56" x="500" y="250" text-anchor="middle" fill="white">TIE</text>
      </svg>
    </div>
    <div v-if="game && (game.game_status === 0 && game.p1_state === false)">
      <h1>enter the game {{game.game_count}}</h1>
    </div>
  </template>
  
  <script lang="ts">
  //https://www.w3schools.com/graphics/svg_examples.asp
  import useSocket from './logic/socketGame.logic';
  import { Socket } from 'socket.io-client';
  import { inject } from 'vue'
  import store from '../../stores'


  export default {
    name: 'FieldSection',
    props: {
      game: Object,
      cam: Object,
    },
    data() {
    return {
       
      }
    },
    setup() {
      const user_nick = store.state.user.user.login
      const $gameSocket = inject<Socket | null>('$gameSocket', null);
      const { emitUpdateGame } = useSocket($gameSocket);
      const ratio = .60


      const play = (sound:any) => {
          if(sound) {
          var audio = new Audio(sound);
            audio.play();
        }
      }
      const enter_Game = () => {
        //console.log("enter the game:", store.state.user.user.login)
        play(require("../../assets/tick.mp3"))
        emitUpdateGame({
          command: "UPDATE_PLAYER_STAT",     // Comando para actualizar el estado de un jugador en el juego.
          params: {
            game_id : store.state.games.game.game_id,         
            player_id: store.state.user.user.id,     
            player_status: true,      // Estado del jugador1 , no ha entrado en el juego =false, ha entrado en el juego =true
          },
          timestamp: Date.now() // La hora a la que se envió el comando. Este es un string que representa la hora en formato ISO 8601, como "2023-05-15T10:00:00Z". Si no se proporciona una marca de tiempo, este campo puede ser nulo.
          });
      }  
      //https://stackoverflow.com/questions/47394970/3d-to-2d-projection-algorithm-perspective-projection-javascript

    return {ratio, enter_Game,  user_nick}
    },
    methods: {
      Pres(points:any, cam:any){
        //let ax = 1
        //let ay = 1
        //let az = 1
        let result= '';
        //Posicion de la cámara
        let cx = cam.x //-100 //500  
        let cy = cam.y //250 //250        
        let cz = cam.z //250 //distancia z al plano general 150
        //Angulos camara
        let Ox = cam.Ox //Math.PI + 0.4
        let Oy = cam.Oy //Math.PI + 0
        let Oz = cam.Oz //Math.PI/2 + .2// - -> giro izquierda + -> giro derecha 
        // Posicion relativa a la camara de la pantalla
        let ex = 500//width screen
        let ey = 250 //height_screen
        let ez = 500 //distancia de la pantalla a la cámara
        //let with_screen = 1000
        //let height_screen = 500

        for (var point of points) {
          let ax = point.x
          let ay = point.y
          let az = point.z
          //cambio sistema de coordenadas a pto cámara
          let X = ax - cx
          let Y = ay - cy
          let Z = az - cz
          //console.log(X, " ",Y," ", Z)
          let Sx = Math.sin(Ox)
          let Sy = Math.sin(Oy)
          let Sz = Math.sin(Oz)
          //console.log(point.x, " ",point.y," ", point.z)
          let Cx = Math.cos(Ox)
          let Cy = Math.cos(Oy)
          let Cz = Math.cos(Oz)
          //console.log(Cx, " ",Cy," ", Cz)
          let dx = Cy * (Sz * Y + Cz * X) - Sy*Z
          let dy = Sx * (Cy * Z + Sy *(Sz*Y+Cz*X)) + Cx*(Cz*Y - Sz*X)
          let dz = Cx * (Cy * Z + Sy *(Sz*Y+Cz*X)) - Sx*(Cz*Y - Sz*X)
          //console.log("d point:",dx, " ",dy," ", dz)
          let bx = (((ez / dz )* dx) + ex)// + with_screen/2 
          let by = (((ez / dz )* dy) + ey)//+  height_screen/2
          //console.log("d point:",Math.round(bx), " ",Math.round(by))
          result = result + Math.round(bx) +","+ Math.round(by) +" "
          //console.log(result)
          //let Point2D = { x:bx, y:by}
         
        }
        result = result+ ''
          //let Point2D = { x:bx, y:by}
          //console.log (result)
        return(result)
        /*
        //Camara position
        let cx = -500
        let cy = -250 
        let cz = 500
        //Angulos camara
        let Ox = 0
        let Oy = 0
        let Oz = 0
        // Posicion relativa a la camara de la pantalla
        //let ex = 1
        //let ey = 1
        let ez = 100

        let X = ax - cx
        let Y = ay - cy
        let Z = az - cz
        console.log(X, " ",Y," ", Z)
        let Sx = Math.sin(Ox)
        let Sy = Math.sin(Oy)
        let Sz = Math.sin(Oz)
        console.log(Sx, " ",Sy," ", Sz)
        let Cx = Math.cos(Ox)
        let Cy = Math.cos(Oy)
        let Cz = Math.cos(Oz)
        console.log(Cx, " ",Cy," ", Cz)
        let dx = Cy * (Sz * Y + Cz * X) - Sy*Z
        let dy = Sx * (Cy * Z + Sy *(Sz*Y+Cz*X)) + Cx*(Cz*Y - Sz*X)
        let dz = Cx * (Cy * Z + Sy *(Sz*Y+Cz*X)) - Sx*(Cz*Y - Sz*X)
        console.log("d point:",dx, " ",dy," ", dz)
        
        
        let bx = ((ez / dz )* dx) 
        let by = ((ez / dz )/ dx) 
        let Point2D = { x:bx, y:by}
        console.log (Point2D)
        return (Point2D)
        */
      } 
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  </style>