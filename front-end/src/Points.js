import React from 'react';
import './Points.css';

class Points extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        initial: true,
        highlight: false
      };
    }
  
    componentDidMount() {
      this.setTimer();
    }
  
    setTimer() {
      // clear any existing timer
      if (this._points != null) {
        clearTimeout(this._points);
        clearTimeout(this._addHighlight);
        clearTimeout(this._removeHighlight);
      }
  
      // hide after `delay` milliseconds
      this._points = setTimeout(
        function () {
          this.setState({ initial: false });
          this._points = null;
        }.bind(this),
        this.props.delay
      );
  
      // add highlight after 1/3rd
      this._addHighlight = setTimeout(
        function () {
          this.setState({ highlight: true });
          this._addHighlight = null;
        }.bind(this),
        this.props.delay / 4
      );
      // remove highlight after 2/3rd
      this._removeHighlight = setTimeout(
        function () {
          this.setState({ highlight: false });
          this._removeHighlight = null;
        }.bind(this),
        this.props.delay * 0.85
      );
    }
  
    componentWillUnmount() {
      clearTimeout(this._points);
      clearTimeout(this._addHighlight);
      clearTimeout(this._removeHighlight);
    }
  
    render() {
      const highlight = this.state.highlight === true ? " popper-highlight" : "";
      const text =
        this.state.initial === true
          ? this.props.msg
          : "Points: " + this.props.points;
      return (
        <div
          className={"popper slide-in-top" + highlight}
        >
          {text}
        </div>
      );
    }
  }

  export default Points;