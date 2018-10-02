import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import 'tachyons';


const particleOptions = {
  particles: {
    number: {
      value : 50,
      density : {
        enable: true,
        value_area: 800
      }
    },
    opacity: {
      value: 0.5,
      random: false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  }
}

const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
}
class App extends Component {
  constructor() {
    super();

    this.state = initialState;

  }

  // componentDidMount() {
  //   fetch('http://localhost:4000')
  //     .then(response => response.json())
  //     .then(console.log)
  // }


  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      email: data.email,
      name: data.name,
      entries: data.entries,
      joined: data.joined
    }
    })
  }



  calculateFaceLocation = (data) => {
       const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
       const inputimage = document.getElementById('inputimage');
       const width = Number(inputimage.width);
       const height = Number(inputimage.height);
       return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)

       }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});

  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});

      fetch('http://localhost:4000/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:4000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log)

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));


  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route ==='home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route})

  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particleOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box}  imageUrl={imageUrl}/>
            </div>

          : (
            route ===('signin')
            ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>

            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>

            )        
        }

      </div>
    );
  }
}

export default App;
