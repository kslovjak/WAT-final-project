import React, { Component } from 'react';
import axios from 'axios';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import style from './style';
import ReactDOM from 'react-dom';

class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.loadMessagesFromServer = this.loadMessagesFromServer.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.handleMessageDelete = this.handleMessageDelete.bind(this);
    this.handleMessageUpdate = this.handleMessageUpdate.bind(this);
  }
  loadMessagesFromServer() {
    axios.get(this.props.url)
      .then(res => {
        this.setState({ data: res.data });
      })
  }
  handleMessageSubmit(message) {
    let messages = this.state.data;
    message.id = Date.now();
    let newMessages = messages.concat([message]);
    this.setState({ data: newMessages });
    axios.post(this.props.url, message)
      .catch(err => {
        console.error(err);
        this.setState({ data: messages });
      });
  }
  handleMessageDelete(id) {
    axios.delete(`${this.props.url}/${id}`)
      .then(res => {
        console.log('Message deleted');
      })
      .catch(err => {
        console.error(err);
      });
  }
  handleMessageUpdate(id, message) {
    //sends the message id and new author/text to our api
    axios.put(`${this.props.url}/${id}`, message)
      .catch(err => {
        console.log(err);
      })
  }
  componentDidMount() {
    this.loadMessagesFromServer();
    setInterval(this.loadMessagesFromServer, this.props.pollInterval);
    ReactDOM.findDOMNode(this).scrollIntoView();
  }
  render() {
    return (
      <div style={style.messageBox}>
        <h2 style={style.title}>Messages:</h2>
        <MessageList
          onMessageDelete={this.handleMessageDelete}
          onMessageUpdate={this.handleMessageUpdate}
          data={this.state.data} />
        <MessageForm onMessageSubmit={this.handleMessageSubmit} />
      </div>
    )
  }
}

export default MessageBox;