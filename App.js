import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
// import { SplashScreen } from 'expo';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react'
import { store, persistor } from './redux/store/store';
import Constants from 'expo-constants';
// import { Notifications } from 'expo';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import NotificationsContainer from './components/util/NotificationsContainer';
import NavigationStack from './navigation/NavigationStack';
// import Api from './components/util/Api';
// import Loader from './components/util/Loader';
import { getUser } from './components/util/Api';


const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false,
      pushToken: store.getState().user.pushToken ?? '',
      user: store.getState().user ?? {}
    }
  }

  // Load any resources or data that we need prior to rendering the app
  async componentDidMount() {
    try {
      // SplashScreen.preventAutoHide();
      await this.registerForPushNotificationsAsync();
      await this.loadDataFromApi();
      // if (!this.state.user.userId) {
      //   await this.loadDataFromApi();
      // }
    } catch (e) {
      console.log(e);
    } finally {
      // this.setState({ isLoadingComplete: true });
      // SplashScreen.hide();
    }
  }

  loadDataFromApi = async () => {
    let res = await getUser(this.state.pushToken);

    this.setState({
      user: {
        deviceId: res.deviceId,
        userId: res.userId,
        groupId: res.groupId,
        createdDate: res.createdDate,
        university: res.university,
        pushToken: res.pushToken,
        lastSyncDate: res.syncDate
      }
    });
    this.setState({ isLoadingComplete: true });
  }

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      // console.log(token);
      this.setState({ pushToken: token });
    } else {
      // console.log('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return null;
      // return (
      //   <View>
      //     <Text>Click to reload</Text>
      //   </View>
      // );
    } else {
      return (
        <StoreProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PaperProvider>
              <NotificationsContainer />
              <View style={styles.container} theme={theme}>
                {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                <NavigationStack user={this.state.user} />
              </View>
            </PaperProvider>
          </PersistGate>
        </StoreProvider>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;