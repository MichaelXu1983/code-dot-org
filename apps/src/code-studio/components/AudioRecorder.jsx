import React from 'react';
import Button from "../../templates/Button";
import i18n from '@cdo/locale';

const styles = {
  buttonRow: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
    borderRadius: 4,
    fontSize: 'large',
    fontWeight: 'lighter',
    boxShadow: 'none',
  }
};

export default class AudioRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.recorder = null;
    this.slices = [];
    this.state = {
      audioName: 'mysound',
      recording: false,
      errorInitialize: false
    };
  }

  componentDidMount = () => {
    //Initialize the media recorder when the component loads
    //Check if the user has mediaDevices and request permission to use the microphone
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({audio: true})
        .then((stream) => {
          this.initializeMediaRecorder(stream);
        })
        .catch((err) => {
          this.recordError(err);
        });
    } else {
      this.recordError();
    }
  };

  initializeMediaRecorder = (stream) => {
    // Set newly initialized mediaRecorder to instance variable
    this.recorder = new MediaRecorder(stream);

    // Set method to save the data when it becomes available
    this.recorder.ondataavailable = (e) => {
      this.slices.push(e.data);
    };

    // Set method to create data blob after recording has stopped
    this.recorder.onstop = (e) => {
      let blob = new Blob(this.slices, {'type': 'audio/mpeg'});
      this.slices = [];
      console.log(blob);
    };
  };

  startRecord = () => {
    this.recorder.start();
  };

  stopRecord = () => {
    this.recorder.stop();
  };

  recordError = (err) => {
    console.log('Audio Initializing Error: ' + err);
    this.setState({errorInitialize: true});
  };

  onNameChange = (event) => {
    this.setState({audioName: event.target.value});
  };

  toggleRecord = () => {
    if (this.state.recording) {
      this.stopRecord();
    } else {
      this.startRecord();
    }
    this.setState({recording: !this.state.recording});
  };

  render() {
    return (
      <div style={styles.buttonRow}>
        {!this.state.errorInitialize &&
          <div>
            <input type="text" placeholder="mysound1.mp3" onChange={this.onNameChange} value={this.state.audioName}/>
            <span>
              <Button
                onClick={this.toggleRecord}
                id="start-stop-record"
                style={styles.button}
                color={Button.ButtonColor.blue}
                icon={this.state.recording ? "stop" : "circle"}
                text={this.state.recording ? i18n.stop() : i18n.record()}
                size="large"
              />
              <Button
                onClick={()=>{}}
                id="cancel-record"
                style={styles.button}
                color={Button.ButtonColor.gray}
                text={i18n.cancel()}
                size="large"
              />
            </span>
          </div>
        }
        {this.state.errorInitialize &&
          <div>{i18n.audioInitializeError()}</div>
        }
      </div>
    );
  }
}
