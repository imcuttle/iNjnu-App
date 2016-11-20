import React, {Component} from 'react'
import {
	Text,
	TouchableHighlight,
	View,
	StyleSheet,
	Dimensions,
	Image,
	TouchableWithoutFeedback
} from 'react-native'
import {Map} from 'immutable'
import moment from 'moment'

export default class extends Component {
	constructor(props) {
		super(props);
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !Map(nextProps).equals(Map(this.props))
	}

	render() {
		const {
			classNo, commentNumber, create_time, department, discussNumber, setPreview, grade, id, img, name, sign,
		} = this.props
		return (
			<View style={{flexDirection: 'column', alignItems: 'center',
				alignSelf: 'center', padding: 20, 
				borderWidth: .5, borderColor: '#ddd', borderRadius: 8,
				width: Dimensions.get('window').width*.8,
				backgroundColor: 'rgba(225, 234, 246, .8)'
			}}>
				<TouchableWithoutFeedback onPress={()=>setPreview(img)}>
					<Image style={{width: 56, height: 56, borderRadius: 30}} source={{uri: img}}/>
				</TouchableWithoutFeedback>
				<Text selectable={true} style={styles.name}>{name}</Text>
				<View style={{flexDirection: 'row', marginTop: 10, }}>
					<Text selectable={true} style={styles.left}>学号: {id}</Text>
					<Text selectable={true} style={styles.right}>班级: {classNo}</Text>
				</View>
				<View style={{flexDirection: 'row'}}>
					<Text selectable={true} style={styles.left}>年级: {grade}</Text>
					<Text selectable={true} style={styles.right}>{department}</Text>
				</View>
				<Text style={{marginTop: 20, color: '#000'}}>个人介绍</Text>
				<View style={{flexDirection: 'row', marginTop: 8}}>
					<Text selectable={true} style={styles.sign}>{sign || '暂无个人介绍'}</Text>
				</View>
				<View style={{flexDirection: 'row', marginTop: 20}}>
					<Text>{moment(create_time).format('YYYY年MM月DD日')}，第一次遇见iNjnu。</Text>
				</View>
				<View style={{flexDirection: 'row', marginTop: 20, }}>
					<Text selectable={true} style={styles.left}>评论了 {discussNumber} 条</Text>
					<Text selectable={true} style={styles.right}>发布了 <Text style={{color: '#3CB371'}}>{commentNumber}</Text> 贴</Text>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	sign: {
		color: 'orange',
		fontSize: 16.5, 
	},
	name: {
		marginTop: 10,
		color: "#3e9ce9",
		fontSize: 20
	},
	left: {
		textAlign: 'left',
		
		flex: 1
	},
	center: {
		textAlign: 'center',
	},
	right: {
		
		textAlign: 'right',
		flex: 1
	}
})