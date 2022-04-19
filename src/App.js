import './App.css';
import styled from "styled-components";
import { useEffect, useState } from 'react';
import tiger from './images/tigerhead_small.png';
import brick from './images/brick.png';
import flap from './sounds/flap.mp3';
import hit from './sounds/hit.mp3';
import point from './sounds/point.mp3';


// Constants 
const PLAYER_HEIGHT = 25;
const PLAYER_WIDTH = 29;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 4;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 180;
const PADDING_TOP = 30;
const FLAP_SOUND = new Audio(flap);
const HIT_SOUND = new Audio(hit);
const POINT_SOUND = new Audio(point);

function App() {
  const [playerPosition, setPlayerPosition] = useState(250);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(200);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(0);

  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;


  // Player falling logic
  useEffect(()=> {
    let timeId;
    if(gameHasStarted && playerPosition < GAME_HEIGHT-PLAYER_HEIGHT + PADDING_TOP) {
      timeId = setInterval(() => {
        setPlayerPosition(playerPosition + GRAVITY);
      }, 20);
    }

    return () => {
      clearInterval(timeId);
    }
  }, [playerPosition, gameHasStarted]);

  // Obstacle generation logic
  useEffect(() => {
    let obstacleId;
    if(gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 5);
      }, 20)
      return () => {
        clearInterval(obstacleId);
      }; 
    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP)));
      if(gameHasStarted) {
        setScore(score => score + 1);
        POINT_SOUND.play();
      }
    }
  }, [gameHasStarted, obstacleLeft]);

  /**
   * Collision Logic
   */
  useEffect(() => {
    const hasCollidedTop = playerPosition >= PADDING_TOP && playerPosition < obstacleHeight+PADDING_TOP;
    const hasCollidedBottom = playerPosition <= GAME_HEIGHT+PADDING_TOP && playerPosition >= GAME_HEIGHT+PADDING_TOP - bottomObstacleHeight;

    if(obstacleLeft >= 0 && obstacleLeft <= OBSTACLE_WIDTH && (hasCollidedBottom || hasCollidedTop)) {
      setGameHasStarted(false); 
      HIT_SOUND.play();
    }  
  }, [playerPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft]);


  /**
   * Click logic
   */
  const handleClick = () => {
    let newPosition = playerPosition - JUMP_HEIGHT;
    if(!gameHasStarted) {
      setGameHasStarted(true);
      setScore(0);
      setPlayerPosition(GAME_HEIGHT/2);
    }
    // Above game bounds
    else if (newPosition < PADDING_TOP) {
      setPlayerPosition(PADDING_TOP);
    } else {
      setPlayerPosition(newPosition);
    }
    FLAP_SOUND.play();
  }

  return (
    <div class="App">
    <Game onClick={handleClick}>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        
        <Obstacle 
          top={0} 
          width={OBSTACLE_WIDTH} 
          height={obstacleHeight} 
          left={obstacleLeft}
          src={brick}
        />
        <Obstacle 
          top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)} 
          width={OBSTACLE_WIDTH} 
          height={bottomObstacleHeight} 
          left={obstacleLeft}
          src={brick}
        />
        <Player height={PLAYER_HEIGHT} width={PLAYER_WIDTH} src={tiger} top={playerPosition}/>
      </GameBox>
    </Game>
    <div>Score: {score}</div>
    </div>
  );
}

export default App;

const Player = styled.div`
  position: absolute;
  background-image: url("${(props) => props.src}");
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  top: ${(props) => props.top}px;
`;

const Game = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: #91b1ff;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  background-image: url("${(props) => props.src}");
  top: ${(props) => props.top}px;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  left: ${(props) => props.left}px;
`;