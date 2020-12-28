import React from 'react';
import Fade from 'react-reveal/Fade';
import "./content.css"

class FadeExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ show: !this.state.show });
  }
  render() {
    return (
      <div className="contentb">
        <Fade right big cascade when={this.state.show}>
          <div>
            <h4>use the virtual joystick</h4>
            <h4>to move around</h4>
            <h4>an get the hidden CV</h4>
          </div>
        </Fade>
        <button
          className="buttonClass"  
          type="button"
          onClick={this.handleClick}
        >
          { this.state.show ? 'Hide' : 'Show' } Instructions
        </button>
      </div>
    );
  }
}

export default FadeExample;
