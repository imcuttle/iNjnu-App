import React from 'react'
import {
	Text,
	Image,
	View,
	StyleSheet,
	TouchableOpacity,
	TouchableHighlight
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
		const {title, time, name, img, lev, content, onDelPress} = this.props
		return (
			<View style={styles.container}>
				<View style={{flexDirection: 'column'}}>
					<View style={{flexDirection: 'row'}}>
						<Image source={{uri: img}} style={styles.img}/>
						<View style={{flexDirection: 'column', flex: 1}}>
							<View style={{flexDirection: 'row', flex: 1}}>
								<Text selectable={true} style={[styles.name, {flex: 1}]}>{name}</Text>
								{
									onDelPress && 
									<TouchableOpacity
										onPress={onDelPress}
										activeOpacity={0.7}
									>
										<Text style={{color: 'red', textAlign: 'right', fontSize: 12}} >删除</Text>
									</TouchableOpacity>
								}
							</View>
							<Text selectable={true} style={styles.time}>{time}</Text>
							<View style={styles.contentContainer}>
								<Text selectable={true}>{content}</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 10,
		paddingBottom: 10,
		marginHorizontal: 16,
		borderColor: 'rgba(125, 125, 125, .5)',
		borderBottomWidth: .5
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
		color: 'blue'
	},
	time: {
		fontSize: 12,
	},
	commentNumber: {
		textAlign: 'right',
		fontSize: 13,
		alignSelf: 'flex-start'
	},
	contentContainer: {
		marginTop: 8,
	}
})