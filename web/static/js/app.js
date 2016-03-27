// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
import {Socket} from "phoenix"

var user = "user_" + Date.now()
window.userToken = user;

let socket = new Socket("/socket", {params: {token: window.userToken}})

// socket.connect()
socket.connect({user: user})


let lobbyChannel = socket.channel("rooms:lobby", {})

lobbyChannel.join()
  .receive("ok", resp => { console.log("Joined lobby", resp) })
  .receive("error", resp => { console.log("Unable to join lobby", resp) })

import React from "react"
import ReactDOM from "react-dom"

var RoomBox = React.createClass({
  getInitialState: function() {
    return {user: window.userToken, text: ""}
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value})
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var text = this.state.text.trim();
    if (!text) { return; }
    lobbyChannel.push("join_room", {body: text})
    this.setState({text: ''});
  },
  render: function() {
    return (
      <form className="messageForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.text}
          onChange={this.handleTextChange}
        />
      </form>
    );
  }
})

var MessageBox = React.createClass({
  handleMessageSubmit: function(message) {
    // this.state.channel.push("new_message", {message: message})
    console.log(message)
    $.post("/api/messages", {message: message})
  },
  getInitialState: function() {
    return {data: [], channel: {}};
  },
  componentDidMount: function() {
    // lobbyChannel.leave()
    // console.log(`${payload.body}`)
    var roomChannel = socket.channel(`rooms:${this.props.room}`, {})
    this.setState({channel: roomChannel})
    roomChannel.join()
    .receive("ok", resp => {
      this.setState({data: resp.messages}),
      this.state.channel.on("new_message", payload => {
        this.setState({data: payload.messages})
      })
    })
    .receive("error", resp => {
      console.log("Unable to join room yo", resp)
    })
  },
  render: function() {
    return (
      <div className="messageBox">
        <h1>Messages</h1>
        <MessageList data={this.state.data} />
        <MessageForm onMessageSubmit={this.handleMessageSubmit} />
      </div>
    );
  }
});

var MessageList = React.createClass({
  render: function() {
    var messageNodes = this.props.data.map(function(message) {
      return (
        <Message user={message.user}>
          {message.body}
        </Message>
      );
    });
    return (
      <div className="messageList">
        {messageNodes}
      </div>
    );
  }
});

var MessageForm = React.createClass({
  getInitialState: function() {
    return {user: '', body: ''};
  },
  handleUserChange: function(e) {
    this.setState({user: e.target.value});
  },
  handleBodyChange: function(e) {
    this.setState({body: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var user = this.state.user.trim();
    var body = this.state.body.trim();
    if (!body || !user) {
      return;
    }
    this.props.onMessageSubmit({user: user, body: body});
    this.setState({user: '', body: ''});
  },
  render: function() {
    return (
      <form className="messageForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.user}
          onChange={this.handleUserChange}
        />
        <input
          type="body"
          placeholder="Say something...."
          value={this.state.body}
          onChange={this.handleBodyChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Message = React.createClass({
  render: function() {
    return (
      <div className="message">
        <h2 className="messageUser">
          {this.props.user}
        </h2>
        {this.props.children.toString()}
      </div>
    );
  }
});

ReactDOM.render(
  <RoomBox/>,
  document.getElementById("room-select")
)

lobbyChannel.on("join_room", payload => {
  ReactDOM.render(
    <MessageBox lobbyChannel={lobbyChannel} room={payload.body} />,
    document.getElementById('content')
  );
})

