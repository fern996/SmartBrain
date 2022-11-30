import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'
import ParticlesBg from 'particles-bg';
import Clarifai from 'clarifai'
import './App.css';

const app = new Clarifai.App({
 apiKey: '7f21b13fcb3841d8bd75133ff6812219'
});

class App extends Component{
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route:'signin',
      isSignedIn: false,
      user: {
        id: '123',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState( {user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  // componentDidMount(){
  //   fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     .then(console.log)
  // }

  calculateFaceLocation = (data) => {
    const claraifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: claraifaiFace.left_col * width,
      topRow: claraifaiFace.top_row * height,
      rightCol: width - (claraifaiFace.rightcol * width),
      bottomRow: height - (claraifaiFace.bottom_row * height)
    }
  }



  displayFaceBox = (box) => {
    this.setState({box:box});
  }

  onInputChange = (event) =>{
    this.setState({input:event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input
      )

    .then(response =>this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }



 //  onButtonSubmit = () => {
 //    this.setState({imageUrl: this.state.input});
 //    app.models
 //      .predict(
 //    // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
 //    // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
 //    // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
 //    // If that isn't working, then that means you will have to wait until their servers are back up. Another solution
 //    // is to use a different version of their model that works like the ones found here: https://github.com/Clarifai/clarifai-javascript/blob/master/src/index.js
 //    // so you would change from:
 //    // .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
 //    // to:
 //    // .predict('53e1df302c079b3db8a0a36033ed2d15', this.state.input)
 //        Clarifai.FACE_DETECT_MODEL,
 //        this.state.input)
 //      .then(response => {
 //        console.log('hi', response)
 //        if (response) {
 //          fetch('http://localhost:3000/image', {
 //            method: 'put',
 //            headers: {'Content-Type': 'application/json'},
 //            body: JSON.stringify({
 //              id: this.state.user.id
 //            })
 //          })
 //            .then(response => response.json())
 //            .then(count => {
 //              this.setState(Object.assign(this.state.user, { entries: count}))
 //            })

 //        }
 //        this.displayFaceBox(this.calculateFaceLocation(response))
 //      })
 //      .catch(err => console.log(err));
 // }
  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route})
  }

  render(){
    const { isSignedIn, imageUrl, route, box} = this.state
    return(
    <div className="App">
    <>
        <ParticlesBg type="cobweb" bg={true} color="#FFFFFF" />
    </>
      <Navigation isSignedIn = {isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' ?
            <div>
              <Logo />
              <Rank/>
              <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition 
              box={box}
              imageUrl={imageUrl}
              />
            </div>
            : (
              route === 'signin'
              ? <SignIn onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              )
        }
    </div>
    );
  }
}

export default App;
