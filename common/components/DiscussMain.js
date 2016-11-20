import React from 'react'
import {
	Text,
	Image,
	View,
	StyleSheet,
} from 'react-native'

import {Map} from 'immutable'

export default class extends React.Component {
	constructor(props) {
		super(props);
		
	}
	shouldComponentUpdate(newProps) {
		return !Map(newProps).equals(Map(this.props));
	}
	render() {
		const {title, time, name, img, commentNumber=0, content} = this.props
		return (
			<View style={styles.container}>
				<View style={{marginHorizontal: 5}}>
				<View style={{flexDirection: 'column'}}>
					<View style={{flexDirection: 'row'}}>
						<Image source={{uri: img}} style={styles.img}/>
						<View style={{flexDirection: 'column', flex: 1}}>
							<Text selectable={true} style={styles.name}>{name}</Text>
							<Text selectable={true} style={styles.time}>{time}</Text>
						</View>
						<Text style={styles.commentNumber}>评论数：{commentNumber}</Text>
					</View>
				</View>
				<View style={styles.contentContainer}>
					<Text selectable={true}>{content}</Text>
				</View>
				</View>
			</View>
		)
	}
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