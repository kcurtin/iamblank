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

let socket = new Socket("/socket", {params: {token: window.userToken}})

socket.connect()

let lobbyChannel = socket.channel("rooms:lobby", {})

lobbyChannel.join()
  .receive("ok", resp => { console.log("Joined lobby", resp) })
  .receive("error", resp => { console.log("Unable to join lobby", resp) })

import React from "react"
import ReactDOM from "react-dom"

var IAmBlank = React.createClass({
  getInitialState: function() {
    var assignUserToken = function() {
      return "testing-1"
    }
    return {iAm: assignUserToken(), text: ""}
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
      <form className="commentForm" onSubmit={this.handleSubmit}>
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

var CommentBox = React.createClass({
  handleCommentSubmit: function(comment) {
    this.state.channel.push("new_comment", {comment: comment})
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
      this.setState({data: resp.comments}),
      this.state.channel.on("new_comment", payload => {
        this.setState({data: payload.comments})
      })
    })
    .receive("error", resp => {
      console.log("Unable to join room yo", resp)
    })
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author}>
          {comment.body}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: '', body: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleBodyChange: function(e) {
    this.setState({body: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var body = this.state.body.trim();
    if (!body || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, body: body});
    this.setState({author: '', body: ''});
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          type="text"
          placeholder="Say something...."
          value={this.state.body}
          onChange={this.handleBodyChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {this.props.children.toString()}
      </div>
    );
  }
});

ReactDOM.render(
  <IAmBlank/>,
  document.getElementById("i-am-blank")
)

lobbyChannel.on("join_room", payload => {
  ReactDOM.render(
    <CommentBox lobbyChannel={lobbyChannel} room={payload.body} />,
    document.getElementById('content')
  );
})

