class Controls extends React.Component {
  render() {
    return (
      <div id="controlsClock">
        <button id="start_stop" onClick={this.props.startStop}>
          <i className="fa fa-play" />
          <i className="fa fa-play fa fa-pause" />
        </button>
        <button id="reset" className="fa fa-refresh" onClick={this.props.refresh} />
      </div>
    );
  }
}
const Display = (props) => {
  const min = Math.floor(props.timeLeft /60) < 10 ? '0' + Math.floor(props.timeLeft /60) : 
  Math.floor(props.timeLeft /60);
  const sec = (props.timeLeft - min * 60) < 10 ? '0' + (props.timeLeft - min * 60) : 
  props.timeLeft - min * 60;
  return(
    <div>
      <div id="timer-label">{props.mode}</div>
      <div id="time-left">{`${min} : ${sec}`}</div>
    </div>
  );
}
const Lengths = (props) => {
  return (
    <div>
      <div id={props.idLabel}>{props.title}</div>
      <div>
        <button id={props.idDubleDecrement} className="btn fa fa-angle-double-down" 
        onClick={props.setLength} value={-10} />
        <button id={props.idDecrement} className="btn fa fa-angle-down" 
        onClick={props.setLength} value={-1} />
        <span id={props.idLength}>{props.length}</span>
        <button id={props.idIncrement} className="btn fa fa-angle-up" 
        onClick={props.setLength} value={1} />
        <button id={props.idDubleIncrement} className="btn fa fa-angle-double-up" 
        onClick={props.setLength} value={10} />
      </div>
    </div>
  )
}
class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      mode: 'Session',
      timeLeft: 1500,
      intervalID: '',
      pause: 1500
    }
    this.setBreak = this.setBreak.bind(this);
    this.setSession = this.setSession.bind(this);
    this.refresh = this.refresh.bind(this);
    this.startStop = this.startStop.bind(this);
    this.decrementTimer = this.decrementTimer.bind(this);
    this.toggleMode = this.toggleMode.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
  }
  setBreak(e) {
    if (!this.state.intervalID) {
      const nextValue = this.state.breakLength + Number(e.target.value);
      const currentValue = nextValue > 0 && nextValue <= 60 ? nextValue : 
      nextValue <= 0 ? 1 : 60;
      this.setState({breakLength: currentValue});
    }
  }
  setSession(e) {
    if (!this.state.intervalID) {
      const nextValue = this.state.sessionLength + Number(e.target.value);
      const currentValue = nextValue > 0 && nextValue <= 60 ? nextValue : 
      nextValue <= 0 ? 1 : 60;
      this.setState({
        sessionLength: currentValue,
        timeLeft: currentValue * 60,
        pause: currentValue * 60
      });
    }
  }
  refresh() {
    clearInterval(this.state.intervalID);
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      mode: 'Session',
      timeLeft: 1500,
      intervalID: '',
      pause: 1500
    });
    const myAudio = document.getElementById("beep");
    myAudio.pause();
    myAudio.currentTime = 0;
  }
  startStop() {
    this.state.intervalID ? 
    (
      clearInterval(this.state.intervalID),
      this.setState({intervalID: '', pause: this.state.timeLeft})
    ) : (
      this.setState({timeLeft: this.state.pause}),
      this.startCountdown()
    );
  }
  startCountdown() {
    this.setState({
      intervalID: setInterval(() => {
        this.decrementTimer();
        this.toggleMode();
      }, 1000)
    })
  }
  decrementTimer() {
    this.setState({timeLeft: this.state.timeLeft - 1});
  }
  toggleMode() {
    let timer = this.state.timeLeft;
    this.buzzer(timer);
    if (this.state.timeLeft < 0) {
      this.state.mode === 'Session' ? 
      this.setState({
        mode: 'Break',
        timeLeft: this.state.breakLength *60
      }) : 
      this.setState({
        mode: 'Session',
        timeLeft: this.state.sessionLength * 60
      })
    }
  }
  buzzer(timer) {
    console.log(timer);
    if (timer === 0) {
      console.log('beep');
      const myAudio = document.getElementById("beep");
      myAudio.play()
    }
  }
  render() {
    return (
      <div>
        Pomodoro Clock
        <div>
          <Lengths idLabel="break-label" title="Break Length" idDubleDecrement="break-duble-decrement" 
          setLength={this.setBreak} idDecrement="break-decrement" 
          idLength="break-length" length={this.state.breakLength} 
          idIncrement="break-increment" idDubleIncrement="break-duble-increment" />
          <Lengths idLabel="session-label" title="Session Length" idDubleDecrement="session-duble-decrement" 
          setLength={this.setSession} idDecrement="session-decrement" 
          idLength="session-length" length={this.state.sessionLength} 
          idIncrement="session-increment" idDubleIncrement="session-duble-increment" />
        </div>
        <div>
          <Display mode={this.state.mode} timeLeft={this.state.timeLeft} />
          <Controls refresh={this.refresh} startStop={this.startStop} />
        </div>
        <audio id="beep" preload="auto">
          <source src="http://static1.grsites.com/archive/sounds/bells/bells003.mp3" type="audio/mpeg" />
        </audio>
      </div>
    );
  }
}
ReactDOM.render(<Pomodoro />, document.getElementById("root"));
