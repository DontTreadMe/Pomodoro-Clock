class Controls extends React.Component {
  render() {
    return (
      <div id="controlsClock">
        <button id="start_stop" className="btn"  
          onClick={this.props.startStop}>
          <i className="fa fa-play fa-2x" />
          <i className="fa fa-play fa fa-pause fa-2x" />
        </button>
        <button id="reset" className="btn" onClick={this.props.refresh}>
          <i className="fa fa-refresh fa-2x" />
        </button>
      </div>
    );
  }
}
const Display = (props) => {
  const min = Math.floor(props.timeLeft /60) < 10 ? 
  '0' + Math.floor(props.timeLeft /60) : 
  Math.floor(props.timeLeft /60);
  const sec = (props.timeLeft - min * 60) < 10 ? 
  '0' + (props.timeLeft - min * 60) : 
  props.timeLeft - min * 60;
  return(
    <div id="display" style={props.alarmColor}>
      <div id="timer-label">{props.mode}</div>
      <div id="time-left">{`${min}:${sec}`}</div>
    </div>
  );
}
const Lengths = (props) => {
  return (
    <div className="sessionBreak">
      <div id={props.idLabel}>{props.title}</div>
      <div>    
        <div id={props.idLength}>{props.length}</div>
        <button id={props.idIncrement} className="btn" 
          onClick={props.setLength} value={1}>
          <i className="fa fa-angle-up fa-3x" />
        </button>
        <button id={props.idDecrement} className="btn" 
          onClick={props.setLength} value={-1}>
          <i className="fa fa-angle-down fa-3x" />
        </button>    
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
      paused: 1500,
      alarmColor: {color: 'white'}
    }
    this.setBreak = this.setBreak.bind(this);
    this.setSession = this.setSession.bind(this);
    this.refresh = this.refresh.bind(this);
    this.startStop = this.startStop.bind(this);
    this.decrementTimer = this.decrementTimer.bind(this);
    this.toggleMode = this.toggleMode.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.warning = this.warning.bind(this);
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
        paused: currentValue * 60
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
      paused: 1500,
      alarmColor: {color: 'white'}
    });
    const myAudio = document.getElementById("beep");
    myAudio.pause();
    myAudio.currentTime = 0;
  }
  startStop() {
    this.state.intervalID ? 
    (
      clearInterval(this.state.intervalID),
      this.setState({intervalID: '', paused: this.state.timeLeft})
    ) : (
      this.setState({timeLeft: this.state.paused}),
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
    this.warning(timer);
    if (timer < 0) {
      this.state.mode === 'Session' ? 
      this.setState({
        mode: 'Break',
        timeLeft: this.state.breakLength *60,
        alarmColor: {color: 'white'}
      }) : 
      this.setState({
        mode: 'Session',
        timeLeft: this.state.sessionLength * 60,
        alarmColor: {color: 'white'}
      })
    }
  }
  buzzer(timer) {    
    if (timer === 0) {
      const myAudio = document.getElementById("beep");
      myAudio.play()
    }
  }
  warning(timer) {
    let warn = timer < 61 ? 
      this.setState({alarmColor: {color: 'tomato'}}) : 
      this.setState({alarmColor: {color: 'white'}});
  }
  render() {
    return (
      <div id="conteiner">        
        <div id="clock">
          <div id="clock-title">Pomodoro Clock</div>
          <div>
            <Display mode={this.state.mode} timeLeft={this.state.timeLeft} 
              alarmColor={this.state.alarmColor} />
            <Controls refresh={this.refresh} startStop={this.startStop} />
          </div>
          <div id="lengths">
            <Lengths idLabel="session-label" title="Session Length" 
              setLength={this.setSession} idDecrement="session-decrement" 
              idLength="session-length" length={this.state.sessionLength} 
              idIncrement="session-increment" />
            <Lengths idLabel="break-label" title="Break Length" 
              setLength={this.setBreak} idDecrement="break-decrement" 
              idLength="break-length" length={this.state.breakLength} 
              idIncrement="break-increment" />
          </div>
        </div>
        <audio id="beep" preload="auto">
          <source 
            src="https://d1490khl9dq1ow.cloudfront.net/sfx/mp3preview/jg-032316-sfx-video-game-beeps-4.mp3" 
          type="audio/mpeg" />
        </audio>
      </div>
    );
  }
}
ReactDOM.render(<Pomodoro />, document.getElementById("root"));
