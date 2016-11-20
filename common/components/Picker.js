import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View } from 'react-native';

class Picker extends Component {

  constructor(props) {
    super(props);
    this.state = {modalVisible: false};
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style={{width: 120, alignItems: 'center', jusifyContent: 'center', backgroundColor: 'rgba(0,0,0,.6)'}}>
        <Modal
        	style={{marginTop: 22, backgroundColor: 'rgba(0,0,0,.6)'}}
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View>
          <View>
            <Text>Hello World!</Text>

            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}>
              <Text>Hide Modal</Text>
            </TouchableHighlight>

          </View>
         </View>
        </Modal>

        <TouchableHighlight onPress={() => {
          this.setModalVisible(true)
        }}>
          <Text>Show Modal</Text>
        </TouchableHighlight>

      </View>
    );
  }
}

export default Picker