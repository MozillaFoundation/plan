/** @jsx React.DOM */

var githubbers = {};

var GitHubPerson = React.createClass({
  getInitialState: function() {
    // We are given a github name
    if (githubbers[name]) {
      return githubbers[name];
    }
    return {
      username: '',
      name: '',
      avatar_url: ''
    };
  },

  componentDidMount: function() {
    var handle = this.props.handle.toLowerCase();
    $.ajax('/api/user', {
      data: {
        'username': handle
      },
      format: 'json',
      success: function(data) {
        data = JSON.parse(data);
        if (this.isMounted()) {
          console.log('setting state', data)
          this.setState({
            username: data.login,
            avatar_url: data.avatar_url,
            html_url: data.html_url,
            name: data.name
          });
        }
        githubbers[handle] = {
          username: data.login,
          avatar_url: data.avatar_url,
          name: data.name
        };
      }.bind(this),
      error: function(data, error) {
        console.log("GOT ERROR", error, data)
      }
    });
  },

  render: function() {
    var name = this.props.handle;
    return (
      <a href={this.state.html_url} title={this.state.name}>
        <img className="avatar" src={this.state.avatar_url}/>
      </a>);
  }
});

var MentionsList = React.createClass({
  render: function() {
    var createMention = function(item, index) {
      if (item.value.question == 'mention') {

        return (<li>{item.value.fromwhom } made a mention on issue <a href={item.value.ref_html_url}>{item.value.issue}</a>
                </li>);
      } else {
        return (<li>{item.value.fromwhom } asked 
                    for <b>{item.value.question}</b> on issue <a href={item.value.ref_html_url}>{item.value.issue}</a>
                </li>);
      }
    };
    var mentions = [];
    var items = this.props.items
    for (var key in items) {
        if (items.hasOwnProperty(key)) {
            mentions.push({key:key, value:items[key]})
        }
    }
    return <ul>{ mentions.map(createMention) }</ul>;
  }
});

var PeopleList = React.createClass({
  render: function() {
    var createPerson = function(item, index) {
      return ( <div>
                <h4><GitHubPerson handle={item.key}/>{item.key}</h4>
                <MentionsList items={item.value}/>
               </div>
             );
    };
    var people = [];
    var items = this.props.items
    for (var key in items) {
        if (items.hasOwnProperty(key)) {
            people.push({key:key, value:items[key]})
        }
    }
    return <ul>{ people.map(createPerson) }</ul>;
  }
});

var MentionsApp = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {people: []};
  },

  componentWillMount: function() {
    var firebaseRef = new Firebase("https://debt.firebaseio.com/asks");
    this.bindAsObject(firebaseRef, "people");
  },

  onChange: function(e) {
    this.setState({text: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.firebaseRefs["items"].push({
        text: this.state.text
      });
      this.setState({text: ""});
    }
  },

  render: function() {
    return (
      <div>
        <PeopleList items={ this.state.people } />
      </div>
    );
  }
});

try {
	React.render(<MentionsApp />, document.getElementById("people"));
} catch (e) {
	console.log(e);
}
