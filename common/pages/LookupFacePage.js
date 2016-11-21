import React from 'react'
import {
	Text,
	View,
	ListView,
	ScrollView,
	Dimensions,
	Clipboard,
	TextInput,
	TouchableHighlight,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Image,
	StyleSheet
} from 'react-native'


import {Map} from 'immutable'
import NavigationBar from 'react-native-navbar';
import LoadingView from '../components/LoadingView'
import BaseInfo from '../components/BaseInfo'
import Grid from '../components/LookupGrid'
import RightTopMenu from '../components/RightTopMenu'



import utils from '../utils'

export default class extends React.Component {
	constructor(props) {
		super(props);

	}
	state = {
		
	}
	componentWillUnmount() {
		
	}
	componentDidMount() {
		
		
	}
	
	renderRow(rowData, textStyle={}, selectable=true) {
		return (
			<View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
				<Text selectable={selectable} style={[{textAlign: 'left', width: Dimensions.get('window').width*.65}, textStyle]}>{rowData.subject}</Text>
				<Text selectable={selectable} style={[{textAlign: 'center', }, textStyle]}>{rowData.fullGrade}</Text>
				<Text selectable={selectable} style={[{textAlign: 'center', }, textStyle]}>{rowData.grade}</Text>
				<Text selectable={selectable} style={[{textAlign: 'center'}, 
					rowData.score<=60?{color: 'red'}:{},
					rowData.score>60&&rowData.score<=80?{color: 'orange'}:{},
					rowData.score>=90?{color: 'green'}:{},
					textStyle
				]}>{rowData.score}</Text>
			</View>
		)
	}
	render() {
		const {navigator, setProps, setPreview, images, url, fetching=false} = this.props
		
		bgcolor = !fetching?'rgb(14, 167, 221)':'rgb(125, 125, 125)'
		return (
			<View style={{flex: 1, backgroundColor: '#F8F8FF'}}>
				
		        <NavigationBar
		          title={{title: '撞脸秀', tintColor: 'red', style: {fontSize: 20}}}
		          statusBar={{hidden: false}}
		          style={{height: 45, flex: null}}
		          leftButton={{
		            title: '返回',
		            handler: () => {
		              navigator.pop()
		            }
		          }}
		        />
		        <View style={{flex: 1}}>
		        	
	        		<View style={{flexDirection: 'column',  marginTop: 15,}}>
	        			<TouchableHighlight
	        			 	activeOpacity={0.7}
							underlayColor={!fetching?"rgba(14, 167, 221, .7)":bgcolor}
							style={{
								marginHorizontal: 14,
			        			alignItems: 'center',
			        			backgroundColor: 'rgba(255, 255, 255, 0.9)',
			        			borderWidth: .5, borderColor: 'rgba(125,125,125, .8)',
			        			justifyContent:'center', height: 36, justifyContent:'flex-end',
			        			borderRadius: 8, backgroundColor: bgcolor
			        		}}
	        			 	onPress={!fetching?()=>{
	        			 		utils.imagePick().then(x=>{
	        			 			if(x) {
	        			 				if(x.size>1024*1024*5) {
	        			 					utils.toast('图片太大了')
	        			 					return
	        			 				}
	        			 				setProps({fetching: true})
			        			 		utils.fetchFaceBase64(x.uri, x.type, x.size)
			        			 		.then(x=>{
			        			 			if(x) {
			        			 				setProps({fetching: false, images: x})
			        			 				var rs = navigator.getCurrentRoutes()
			        			 				var i = rs.findIndex(r=>r.active==='lookupFace')
			        			 				if(i>=0) {
			        			 					navigator.replaceAtIndex({
			        			 						active: 'lookupFace'
			        			 					}, i)
			        			 				} else {
			        			 					navigator.push({
			        			 						active: 'lookupFace'
			        			 					})
			        			 				}
			        			 			} else 
			        			 				setProps({fetching: false})
			        			 		})
	        			 			}
	        			 		})
	        			 		
	        			 	}:null}
	        			 	>
			        		<View style={{flex: 1, padding: 7, justifyContent:'center'}}>
			        			<Text style={{fontSize: 16, color: '#fff', textAlign: 'center', flex: 1}}>选择图片</Text>
			        		</View>
		        		</TouchableHighlight>

		        		<View style={[styles.inputContainer, {marginHorizontal: 14,}]}>
							<TextInput style={styles.textInput}
								ref="input"
								autoCorrect={false} multiline={false}
								placeholder="网络图片也可以哦"
								keyboardType={"email-address"}
								onChangeText={(text)=>{setProps({url: text})}}
								value={url}
								maxLength={100}
								editable={!fetching}
								underlineColorAndroid="transparent"
							/>
							
							<TouchableHighlight
								onPress={!fetching?()=>{
									if(!url || url.trim().length==0) {
										return
									}
									setProps({fetching: true})
		        			 		utils.fetchFaceUrl(url)
		        			 		.then(x=>{
		        			 			if(x) {
		        			 				setProps({fetching: false, images: x})
		        			 				
		        			 				var rs = navigator.getCurrentRoutes()
		        			 				var i = rs.findIndex(x=>x.active==='lookupFace')
		        			 				if(i>=0) {
		        			 					navigator.replaceAtIndex({
		        			 						active: 'lookupFace'
		        			 					}, i)
		        			 				} else {
		        			 					navigator.push({
		        			 						active: 'lookupFace'
		        			 					})
		        			 				}
		        			 			} else 
		        			 				setProps({fetching: false})
		        			 		})
		        			 	}:null}
								style={{height: 36, paddingLeft: 13, paddingRight: 13,
									borderTopRightRadius: 8, borderBottomRightRadius: 8,
									justifyContent:'center', 
									borderWidth: 0, padding: 6, backgroundColor: bgcolor}}
								underlayColor={!fetching?"rgba(14, 167, 221, .7)":bgcolor}
							>
								<Text style={{fontSize: 16, color: 'white',textAlign: 'center'}}>撞一下!</Text>
							</TouchableHighlight>
						</View>
	        			{fetching && <View style={{marginTop: 10, position: 'absolute', zIndex: 1, left: 0, right: 0, alignItems: 'center'}}>
	        				<LoadingView />
	        				<Text style={{textAlign: 'center', color: '#3e9ce9', bottom: 8}}>努力搜索中</Text>
	        			</View>}

	        			<ScrollView>
	        			{
	        				images && images[0]
	        				&&
					        <View style={{alignItems: 'center', marginTop: 20}}>
					          <TouchableHighlight
					          	underlayColor="rgba(238,242,247,0.8)"
						        onPress={(e)=>{setPreview(images[0].src)}}
						        >
					          	<Image source={{uri: images[0].src}} style={styles.ximg}/>
					          </TouchableHighlight>
					          <Text style={styles.text}>{images[0].text}</Text>
					        </View>
	        			}
	        			{
	        				images && images.length>1 &&

	        				<ListView 
	        					contentContainerStyle={styles.list}
	        					enableEmptySections={true}
	        					keyboardDismissMode="on-drag"
	        					
	        					dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => !Map(r1).equals(Map(r2))}).cloneWithRows(images.slice(1, images.length))}
	        					renderRow={(rowData)=>{
	        						
	        						return  <View style={styles.item}>
							          <TouchableHighlight
							          	underlayColor="rgba(238,242,247,0.8)"
								        onPress={(e)=>{setPreview(rowData.src)}}
								        >
							          	<Image source={{uri: rowData.src}} style={styles.ximg}/>
							          </TouchableHighlight>
							          <Text style={styles.text}>{rowData.text}</Text>
							        </View>
							  	}}>
	        				</ListView>
	        				
	        			}
	        			</ScrollView>
		        	</View>
	        			
		        </View>
	        </View>
		)
	}

	f() {
	/*images.map(image=> {
		return  <TouchableWithoutFeedback 
			style={styles.item}
			onPress={()=>setPreview(image.src)} >
			<View style={{alignItems: 'flex-start'}}>
				<Image style={[styles.img, {marginTop: 20}]} resizeMode="cover" source={{uri: image.src}}/>
				<Text>{image.text}</Text>
			</View>
		</TouchableWithoutFeedback>
	})*/

	}
	

	shouldComponentUpdate(nextProps, nextState) {
		return !Map(this.props).equals(Map(nextProps))
	}
}
const styles = StyleSheet.create({
	img: {
      width: 40,
      height: 40,
      borderRadius: 4,
      justifyContent: 'center',
      alignSelf: 'center'
    },
	ximg: {
		alignSelf: 'center', borderRadius: 20, borderWidth: .8, borderColor: '#888', width: 120, height: 140, },
  inputContainer: {
  	marginTop: 10,
  	height: 36,
  	flex: 1,
  	alignItems: 'center',
  	borderColor: 'rgba(125, 125, 125, .8)',
  	borderWidth: .5,
  	flexDirection: 'row',
  	borderRadius: 8,
  	backgroundColor: 'white',
  },
  item: {
      // shadowColor: '#CCC',
      // shadowOffset: {width: 2, height: 2},
      // shadowRadius: 2,
      justifyContent: 'center',
      alignItems: 'center',
      // borderWidth: 1,
      // borderRadius: 5,
      // borderColor: '#CCC',
      //backgroundColor: 'rgba(255,255,255,0.8)',
      margin: 10,
      width: 140,
      padding: 5,
      height: 160
    },
  list: {
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
  textInput: {
  	padding: 4,
  	paddingLeft: 10,
  	flex: 1,
  	borderTopLeftRadius: 8,
  	borderBottomLeftRadius: 8,
  	borderWidth: 0,
  	borderRightWidth: 0,
  	// marginBottom: 10
  }
})


