# React-Native app to resize image and upload to server  

Add the following permissions in android manifest.xml  
android/app/src/main/AndroidManifest.xml  

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## Setting up  

clone this repository  
run `yarn install` or `npm install` into the cloned folder  
once the dependencies are installed, set the baseurl variable in App.js to your servers url/ip address  
in two separate terminals write

```bash
react-native run-android
react-native start
```

### Note: Make sure that flipper version is atleast 0.41.0  

Flipper version can be checked in android/gradle.properties file  
older flipper version throw network error when trying to upload files to server  

See how to set up a server that accepts image [here](https://github.com/shrynshJn/image-upload-server)  
