class Controls extends React.Component {
  render() {
    return (
      <div id="controlsClock">
        <button id="start_stop" className="fa fa-play" onClick={this.props.startTimer} />
        <button id="pause" className="fa fa-pause" />
        <button id="reset" className="fa fa-refresh" onClick={this.props.refresh} />
      </div>
    );
  }
}
const Display = (props) => {
  return(
    <div>
      <div id="timer-label">{props.mode}</div>
      <div id="time-left">{props.leftTime}</div>
    </div>
  );
}
class Session extends React.Component {
  render() {
    return (
      <div>
        <div id="session-label">Session Length</div>
        <div>
          <button id="session-duble-decrement" className="btn fa fa-angle-double-down" 
            onClick={this.props.setSession} value={-10} />
          <button id="session-decrement" className="btn fa fa-angle-down" 
            onClick={this.props.setSession} value={-1} />
          <span id="session-length">{this.props.sessionLength}</span>
          <button id="session-increment" className="btn fa fa-angle-up" 
            onClick={this.props.setSession} value={1} />
          <button id="session-duble-increment" className="btn fa fa-angle-double-up" 
            onClick={this.props.setSession} value={10} />
        </div>
      </div>
    );
  }
}
class Break extends React.Component {
  render() {
    return (
      <div>
        <div id="break-label">Break Length</div>
        <div>
          <button id="break-duble-decrement" className="btn fa fa-angle-double-down" 
            onClick={this.props.setBreak} value={-10} />
          <button id="break-decrement" className="btn fa fa-angle-down" 
            onClick={this.props.setBreak} value={-1} />
          <span id="break-length">{this.props.breakLength}</span>
          <button id="break-increment" className="btn fa fa-angle-up" 
            onClick={this.props.setBreak} value={1} />
          <button id="break-duble-increment" className="btn fa fa-angle-double-up" 
            onClick={this.props.setBreak} value={10} />
        </div>
      </div>
    );
  }
}
class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      mode: 'Session',
      leftTime: 25
    }
    this.setBreak = this.setBreak.bind(this);
    this.setSession = this.setSession.bind(this);
    this.refresh = this.refresh.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }
  setBreak(e) {
    this.setState({breakLength: this.state.breakLength + Number(e.target.value)});
  }
  setSession(e) {
    this.setState({sessionLength: this.state.sessionLength + Number(e.target.value)});
  }
  refresh() {
    this.setState({breakLength: 5, sessionLength: 25, mode: 'Session'});
  }
  startTimer() {
    this.setState({leftTime: this.state.sessionLength});
    setInterval(() => {
      this.setState({leftTime: this.state.leftTime - 1});
    }, 1000);
  }
  
  render() {
    return (
      <div>
        Pomodoro Clock
        <audio id="beep" />
        <div>
          <Break breakLength={this.state.breakLength} setBreak={this.setBreak} />
          <Session sessionLength={this.state.sessionLength} setSession={this.setSession} />
        </div>
        <div>
          <Display mode={this.state.mode} leftTime={this.state.leftTime} />
          <Controls refresh={this.refresh} startTimer={this.startTimer} />
        </div>
      </div>
    );
  }
}
ReactDOM.render(<Pomodoro />, document.getElementById("root"));
