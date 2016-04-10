import React from "react"
import ReactDOM from "react-dom"

var MessageBox = React.createClass({
  handleMessageSubmit: function(message) {
    this.props.roomChannel.push("new_message", {message: message})
  },
  componentWillMount: function() {
    let that = this
    this.props.roomChannel.on("new_message", (message) => {
      that.setState({messages: that.state.messages.concat([message])});
    })
  },
  getInitialState: function() {
    return {
      messages: this.props.messages
    }
  },
  render: function() {
    return (
      <div className="messageBox">
        <h1>Messages</h1>
        <MessageList messages={this.state.messages} />
        <MessageForm onMessageSubmit={this.handleMessageSubmit} />
      </div>
    );
  }
});

var MessageList = React.createClass({
  render: function() {
    var messageNodes = this.props.messages.map(function(message) {
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
    return {body: ''};
  },
  handleBodyChange: function(e) {
    this.setState({body: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var body = this.state.body.trim();
    if (!body) {
      return;
    }
    this.props.onMessageSubmit({body: body});
    this.setState({body: ''});
  },
  render: function() {
    return (
      <form className="messageForm" onSubmit={this.handleSubmit}>
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

export default MessageBox
