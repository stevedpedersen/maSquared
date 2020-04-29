import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

class CampusMap extends Component {
  
  // SFSU: @37.7232119,-122.4800182,17.56z
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 37.7232119,
        longitude: -122.4800182,
        latitudeDelta: 0.0022,
        longitudeDelta: 0.0121,
      },
      campus: 'sfsu'
    };
  }
  
  onRegionChange(region) {
    this.setState({ region });
  }
  

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapStyle}
          region={this.state.region}
          // onRegionChange={this.onRegionChange}
        >
          {markers.map((campuses, i) => {
            return (
              <View>
                {campuses[this.state.campus].map(marker => {
                  return (
                    <Marker
                      key={marker.title}
                      coordinate={marker.latlng}
                      title={marker.title}
                      description={marker.description}
                      onPress={this.props.onMarkerChange}>
                      {this.props.location == marker.key ? 
                        (<View style={{backgroundColor: "#74b783", padding: 10}}></View>) :
                        undefined
                      }
                    </Marker>
                  );
                })}
              </View>
            );
          })}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').height / 4),
  },
});

export default CampusMap;



const markers = [
  { 
    sfsu: [
      {
        key: 'lib',
        title: 'J. Paul Leonard Library (LIB)',
        latlng: {
          latitude: 37.721416,
          longitude: -122.478162
        }
      },
      {
        key: 'shs',
        title: 'Student Health Center (SHS)',
        latlng: {
          latitude: 37.723277,
          longitude: -122.479774
        }
      },
      {
        key: 'hh',
        title: 'Hensill Hall (HH)',
        latlng: {
          latitude: 37.723572,
          longitude: -122.475712
        }
      },
      {
        key: 'hss',
        title: 'Health and Social Sciences (HSS)',
        latlng: {
          latitude: 37.721993,
          longitude: -122.476055
        }
      },
      {
        key: 'hum',
        title: 'Humanities (HUM)',
        latlng: {
          latitude: 37.722240,
          longitude: -122.481514
        }
      },
      {
        key: 'parking',
        title: 'Parking Garage',
        latlng: {
          latitude: 37.724594, 
          longitude: -122.480891
        }
      },
      {
        key: 'quad',
        title: 'Quad',
        latlng: {
          latitude: 37.722352, 
          longitude: -122.477386
        }
      },
      {
        key: 'sci',
        title: 'Science (SCI)',
        latlng: {
          latitude: 37.722923, 
          longitude: -122.476347
        }
      },
      {
        key: 'ssb',
        title: 'Student Services (SSB)',
        latlng: {
          latitude: 37.723530, 
          longitude: -122.480546 
        }
      },
      {
        key: 'th',
        title: 'Thornton Hall (TH)',
        latlng: {
          latitude: 37.723636, 
          longitude: -122.476966 
        }
      },
    ],
  }
];