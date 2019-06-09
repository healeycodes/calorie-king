import React from 'react';
import './UserBar.css';

class UserBar extends React.Component {
    constructor(props) {
      super(props);
      this.link = document.location.href;
      this.state = {
        enabled: true
      };
    }
  
    hide() {
      this.setState({ enabled: false });
      localStorage.setItem(this.link, "");
    }
  
    componentDidMount() {
      const hiddenBefore = localStorage.getItem(this.link);
      if (hiddenBefore !== null) {
        this.hide();
      }
    }
  
    render() {
      return this.state.enabled === true ? (
        <div className="card">
          <div className="card-body">
            <div className="columns">
              <div className="column col-10">
                <div>This is your private dashboard. Bookmark this link!</div>
              </div>
              <div className="column col-2 text-right">
                <i
                  className="icon icon-cross cal-king-pointer"
                  onClick={this.hide.bind(this)}
                ></i>
              </div>
            </div>
          </div>
        </div>
      ) : null;
    }
  }

  export default UserBar;