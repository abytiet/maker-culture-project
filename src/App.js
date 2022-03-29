import './App.css';
import styled from "styled-components";
import { useEffect, useState } from 'react';
import tiger from './images/tigerhead.PNG';

// Constants 
const PLAYER_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 4;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;

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
    if(gameHasStarted && playerPosition < GAME_HEIGHT-PLAYER_SIZE) {
      timeId = setInterval(() => {
        setPlayerPosition(playerPosition + GRAVITY);
      }, 24);
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
      }, 24)
      return () => {
        clearInterval(obstacleId);
      }; 
    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP)));
      setScore(score => score + 1);
    }
  }, [gameHasStarted, obstacleLeft]);

  /**
   * Collision Logic
   */
  useEffect(() => {
    const hasCollidedTop = playerPosition >= 0 && playerPosition < obstacleHeight;
    const hasCollidedBottom = playerPosition <= GAME_HEIGHT && playerPosition >= GAME_HEIGHT - bottomObstacleHeight;

    if(obstacleLeft >= 0 && obstacleLeft <= OBSTACLE_WIDTH && (hasCollidedBottom || hasCollidedTop)) {
      setGameHasStarted(false);
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
    else if (newPosition < 0) {
      setPlayerPosition(0);
    } else {
      setPlayerPosition(newPosition);
    }
  }

  return (
    <Game onClick={handleClick}>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        <Obstacle 
          top={0} 
          width={OBSTACLE_WIDTH} 
          height={obstacleHeight} 
          left={obstacleLeft}
        />
        <Obstacle 
          top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)} 
          width={OBSTACLE_WIDTH} 
          height={bottomObstacleHeight} 
          left={obstacleLeft}
        />
        <Player size={PLAYER_SIZE} src={tiger} top={playerPosition}/>
      </GameBox>
      <span>{score}</span>
    </Game>
  );
}

export default App;

const Player = styled.div`
  position: absolute;
  background-image: url("${(props) => props.src}");
  background-color: red;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
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
  background-color: blue;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  top: ${(props) => props.top}px;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: green;
  left: ${(props) => props.left}px;
`;