/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Clipboard,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Axios from 'axios';
const baseurl = 'https://7a9b435a.ngrok.io'; // url/ip address of your server
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false, // flag to check if an upload is in progress
      uploadProgress: 0, // track the progress of upload
      image: '', // image selected by user, will have the uri to use to show in image component
      errmsg: '', // to show any error occured
      filename: '', // filename of image after uploaded to server
    };
  }
  handleChooseImage = () => {
    ImagePicker.showImagePicker(
      {
        title: 'Select Profile Picture',
        storageOptions: {
          path: 'images',
          cameraRoll: true,
          privateDirectory: true,
        },
      },
      (response) => {
        if (response.error || response.didCancel) {
          this.setState({errmsg: 'Could not choose image'});
        } else {
          ImageResizer.createResizedImage(
            response.uri,
            512, // width of the resized image
            512, // height of the resized image
            'JPEG', // type of image
            100, // quality parameter
          )
            .then((result) => {
              this.setState({image: result});
            })
            .catch((error) => {
              this.setState({errmsg: 'Could not choose image' + error.message});
            });
        }
      },
    );
  };

  handleUpload = async () => {
    this.setState({
      uploading: true,
      errmsg: '',
      filename: '',
      uploadProgress: 0,
    });
    const payload = new FormData();
    payload.append('profilepic', {
      uri: this.state.image.uri,
      type: 'image/JPEG',
      name: this.state.image.name,
    });
    await Axios.post(`${baseurl}/pictures/profile`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progress) => {
        const {loaded, total} = progress;
        const percentageProgress = Math.floor((loaded / total) * 100);
        this.setState({uploadProgress: percentageProgress});
      },
    })
      .then((result) => {
        if (result.status === 200 && result.data.success) {
          console.log(result.data);
          this.setState({
            uploading: false,
            uploadProgress: 0,
            filename: result.data.data.filename,
            errmsg: '',
          });
        } else {
          throw new Error(result.status + ': ' + result.statusText);
        }
      })
      .catch((error) => {
        console.log(error.message);
        this.setState({
          uploading: false,
          errmsg: error.message,
          uploadProgress: 0,
          filename: '',
        });
      });
  };
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor={'white'} />
        <View
          style={styles.headerBar}>
          <Text style={{fontSize: 22, fontWeight: '600'}}>
            Image Upload App
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <View style={{elevation: 5, padding: 10}}>
            <Image
              style={styles.image}
              source={
                this.state.image
                  ? {uri: this.state.image.uri}
                  : require('./assets/profilepic.jpg')
              }
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            disabled={this.state.uploading}
            onPress={this.handleChooseImage}>
            <Text> Choose Image </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            disabled={this.state.uploading || !this.state.image}
            onPress={this.handleUpload}>
            <Text> {this.state.uploading ? 'Uploading' : 'Upload Image'} </Text>
          </TouchableOpacity>
          <Text
            style={{
              display: this.state.uploading ? 'flex' : 'none',
              fontSize: 16,
            }}>
            Progress: {this.state.uploadProgress + '%'}
          </Text>
          <Text
            style={{
              display: this.state.filename ? 'flex' : 'none',
              fontSize: 16,
            }}
            onPress={() => {
              Clipboard.setString(this.state.filename);
            }}>
            Filename: {'\n' + this.state.filename}
          </Text>
        </View>
      </>
    );
  }
}

const styles = {
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
  },
  button: {
    elevation: 2,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    marginVertical: 5,
  },
  headerBar: {
    elevation: 4,
    paddingVertical: 15,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
};
export default App;
