import React from "react"
import ReactDOM from "react-dom"
import MessageBox from "./MessageBox"

var RoomBox = React.createClass({
  getInitialState: function() {
    return {roomName: ""}
  },
  componentWillMount: function() {
    this.props.socket.connect()
  },
  handleNameChange: function(e) {
    this.setState({roomName: e.target.value})
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var roomName = this.state.roomName.trim();
    if (!roomName) { return; }
    let roomChannel = this.props.socket.channel(`rooms:${roomName}`)
    roomChannel.join()
      .receive("ok", resp  => {
        ReactDOM.render(
          <MessageBox roomChannel={roomChannel} messages={resp.messages} />,
          document.getElementById('content')
        );
        this.setState({roomName: ""});
      })
      .receive("error", msg => console.log("Failed to join room", msg))
  },
  render: function() {
    return (
      <form className="roomForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.roomName}
          onChange={this.handleNameChange}
        />
      </form>
    );
  }
})

export default RoomBox
