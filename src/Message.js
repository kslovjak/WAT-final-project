//importing dependecies
import React, { Component } from 'react';
import style from './style';
import marked from 'marked';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state= {
      toBeUpdated: false,
      author: '',
      text: ''
    };
    //binding functions to this class
    this.deleteMessage = this.deleteMessage.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleMessageUpdate = this.handleMessageUpdate.bind(this);
  }
  updateMessage(e) {
    e.preventDefault();
    //brings up the update field when we click on the update link.
    this.setState({ toBeUpdated: !this.state.toBeUpdated });
  }
  handleMessageUpdate(e) {
    e.preventDefault();
    let id = this.props.uniqueID;
    //if author or text changed, set it. if not, leave null and PUT request will ignore it.
    let author = (this.state.author) ? this.state.author : null;
    let text = (this.state.text) ? this.state.text : null;
    let message = { author: author, text: text};
    this.props.onMessageUpdate(id, message);
    this.setState({
      toBeUpdated: !this.state.toBeUpdated,
      author: '',
      text: ''
    })
  }
  deleteMessage(e) {
    e.preventDefault();
    let id = this.props.uniqueID;
    this.props.onMessageDelete(id);
    console.log('deleted');
  }
  handleTextChange(e) {
    this.setState({ text: e.target.value });
  }
  handleAuthorChange(e) {
    this.setState({ author: e.target.value });
  }
  rawMarkup() {
    let rawMarkup = marked(this.props.children.toString());
    return { __html: rawMarkup };
  }
  render() {
    return (
      <div style={ style.message }>
        <h3>{this.props.author}</h3>
        <span dangerouslySetInnerHTML={ this.rawMarkup() } />
        <a style={ style.updateLink } href='#' onClick={ this.updateMessage }>update</a>
        <a style={ style.deleteLink } href='#' onClick={ this.deleteMessage }>delete</a>
        { (this.state.toBeUpdated)
          ? (<form onSubmit={ this.handleMessageUpdate }>
              <input
                type='text'
                placeholder='Update name...'
                style={ style.messageFormAuthor }
                value={ this.state.author }
                onChange= { this.handleAuthorChange } />
              <input
                type='text'
                placeholder='Update your message...'
                style= { style.messageFormText }
                value={ this.state.text }
                onChange={ this.handleTextChange } />
              <input
                type='submit'
                style={ style.messageFormPost }
                value='Update' />
            </form>)
          : null}
      </div>
    )
  }
}

export default Message;