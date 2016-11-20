import React from 'react'
import {
	Text,
	Image,
	View,
	TouchableWithoutFeedback,
	TouchableOpacity,
	StyleSheet,
} from 'react-native'

import {Map} from 'immutable'

import Markdown from 'react-native-simple-markdown'


export default class extends React.Component {
	constructor(props) {
		super(props);
		
	}
	shouldComponentUpdate(newProps) {
		return !Map(newProps).equals(Map(this.props));
	}
	render() {
		const {title, time, name, img, commentNumber=0, content, onImgPress, onDelPress} = this.props
		return (
			<View style={styles.container}>
				<View style={{marginHorizontal: 5}}>
				<View style={{flexDirection: 'column'}}>
					<View style={{flexDirection: 'row'}}>
						<TouchableWithoutFeedback onPress={onImgPress}>
							<Image source={{uri: img}} style={styles.img}/>
						</TouchableWithoutFeedback>
						<View style={{flexDirection: 'column', flex: 1}}>
							<Text selectable={true} style={styles.name}>{name}</Text>
							<Text selectable={true} style={styles.time}>{time}</Text>
						</View>
						<View style={{flexDirection: 'column'}}>
						{	onDelPress &&
							<TouchableOpacity
								onPress={onDelPress}
								activeOpacity={0.7}
							>
								<Text style={{textAlign: 'right', fontSize: 12, color: 'red'}}>删除</Text>
							</TouchableOpacity>
						}
							<Text style={[styles.commentNumber, {marginRight: 0}]}>{commentNumber}条评论</Text>
						</View>
					</View>
				</View>
				<View style={styles.contentContainer}>
					<Markdown style={mdstyle}>
						{content}
					</Markdown>
				</View>
				</View>
			</View>
		)
	}
}
const mdstyle = {
  heading1: {
    fontSize: 22,
  },
  strong: {
    fontSize: 18,
  },
  paragraph: {
    fontSize: 14,
  },
  view: {
    borderWidth: 1,
  },
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingBottom: 20,
		borderBottomWidth: 1.5,
		borderColor: 'rgba(125, 125, 125, .8)',
		marginHorizontal: 10
	},
	title: {
		fontSize: 15,
		textAlign: 'left'
	},
	img: {
		width: 32,
		height: 32,
		borderRadius: 16,
		marginRight: 10
	},
	name: {
		fontSize: 13,
		color: 'orange'
	},
	time: {
		fontSize: 12,
	},
	commentNumber: {
		textAlign: 'right',
		fontSize: 13,
		alignSelf: 'center'
	},
	contentContainer: {
		borderTopWidth: 0.5,
		borderColor: 'rgba(125, 125, 125, .5)',
		marginTop: 10,
		paddingTop: 8
	}
})