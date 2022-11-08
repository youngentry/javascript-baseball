const { Console } = require("@woowacourse/mission-utils");
const { NOTICE, HINT, OPTION } = require("./message");
const Computer = require("./Computer");
const User = require("./User");

class App {
    constructor() {
        this.computer = new Computer();
        this.user = new User();
    }

    play() {
        Console.print(NOTICE.START);
        this.gameStart();
    }

    gameStart() {
        this.computer.setRandomNumber();
        this.judge();
    }

    judge() {
        Console.readLine(NOTICE.NUMBER_QUESTION, (userInput) => {
            this.user.setNumberArray(userInput);
            this.judgePitch();
        });
    }

    judgePitch() {
        const computerNumber = this.computer.number;
        const userGuess = this.user.guess;
        const strikeCount = this.countStrike(computerNumber, userGuess);
        const ballCount = this.countBall(computerNumber, userGuess);
        this.printResult(strikeCount, ballCount);
    }
    countStrike(computerNumber, userGuess) {
        const strike = computerNumber.filter((el, idx) => el.toString() === userGuess[idx]).length;
        return strike;
    }
    countBall(computerNumber, userGuess) {
        const ball = computerNumber.filter((el) => userGuess.includes(el.toString()));
        return ball.length;
    }

    printResult(strikeCount, ballCount) {
        if (this.out(strikeCount, ballCount)) {
            Console.print(HINT.OUT);
            return this.judge();
        }
        if (this.strikeOut(strikeCount)) {
            Console.print(strikeCount + HINT.STRIKE);
            Console.print(NOTICE.CLEAR);
            return this.questionFinish();
        }
        if (strikeCount === 0) {
            Console.print(ballCount + HINT.BALL);
            return this.judge();
        }
        if (strikeCount - ballCount === 0) {
            Console.print(strikeCount + HINT.STRIKE);
            return this.judge();
        }
        if (ballCount !== 0 && strikeCount !== 0) {
            Console.print(`${ballCount - strikeCount + HINT.BALL} ${strikeCount + HINT.STRIKE}`);
            return this.judge();
        }
    }
    out(strikeCount, ballCount) {
        return ballCount === 0 && strikeCount === 0;
    }
    strikeOut(strikeCount) {
        return strikeCount === OPTION.PITCH_COUNT;
    }

    questionFinish() {
        Console.readLine(NOTICE.FINISH_QUESTION, (finishInput) => {
            if (this.restartGame(finishInput)) {
                return this.gameStart();
            }
            if (this.endGame(finishInput)) {
                return Console.close();
            }
            throw new Error(NOTICE.ERROR);
        });
    }
    restartGame(finishInput) {
        return finishInput === "1";
    }
    endGame(finishInput) {
        return finishInput === "2";
    }
}

const app = new App();
app.play();

module.exports = App;
