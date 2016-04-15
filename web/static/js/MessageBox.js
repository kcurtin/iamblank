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
      <div className="message-box">
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
        <Message color={message.color}>
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
  getDefaultProps: function() {
    return {
      color: window.userColor
    };
  },
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
      <form className="" onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="col-lg-12">
            <div className="input-group input-group-lg">
              <input
                type="text"
                className="form-control input-lg"
                placeholder="Say anything...."
                value={this.state.body}
                onChange={this.handleBodyChange}
              />
              <span className="input-group-btn">
                <button className={"btn btn-default btn-lg " + this.props.color} type="submit" value="Post">
                  Send
                </button>
              </span>
            </div>
          </div>
        </div>
      </form>
    );
  }
});

var Message = React.createClass({
  render: function() {
    return (
      <div className={"message " + this.props.color}>
        <p>
          {this.props.children.toString()}
        </p>
      </div>
    );
  }
});

export default MessageBox
