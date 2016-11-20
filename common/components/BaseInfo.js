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
		const {img, name, department, classNo, id} = this.props
		return (
			<View style={styles.container}>
				<View style={{flexDirection: 'column'}}>
					<View style={{flexDirection: 'row'}}>
						<Image source={{uri: img}} style={styles.img}/>
						<View style={{flexDirection: 'column'}}>
							<Text selectable={true} style={styles.name}>姓名：{name}</Text>
							<Text selectable={true} style={styles.name}>学号：{id}</Text>
						</View>
						<View style={{flexDirection: 'column', flex: 1, alignItems: 'flex-end'}}>
							<Text selectable={true} style={styles.name}>{department}</Text>
							<Text selectable={true} style={styles.name}>班级：{classNo}</Text>
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