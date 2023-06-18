import './index.css'

function GameoOver({ gameOver }) {
    if (gameOver[0]) {
        return (
            <div className='gameover'>
                <h1 className='text'>GameOver</h1>
                <div className='checkmate'>{gameOver[1]}</div>
                <div className='won'>{gameOver[2]}</div>
                <button className='again'>Play Again</button>
            </div>
        )
    } else {
        return <></>
    }
}

export default GameoOver