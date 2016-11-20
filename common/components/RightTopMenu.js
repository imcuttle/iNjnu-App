import React from 'react'
import {
	Text,
	View,
	ListView,
	Dimensions,
	TouchableHighlight
} from 'react-native'

export default class extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {items} = this.props;
		return (
			<View style={[{
        		position: 'absolute', zIndex: 3,backgroundColor: 'white', top: 45, flex: 1,
        		right: 0, 
        		borderColor: '#bbb', borderWidth: .5, borderTopWidth: 0, borderRightWidth: 0
        	}]}>
        		{items.map((x, i)=>{
        			var sty = {}
        			if(i===0)
        				sty={borderTopWidth: 0}
        			return (
        				<TouchableHighlight style={[style, sty]}
        					key={i}
        					onPress={x.onPress}
        					underlayColor="rgba(238,242,247,0.8)"
        				>
        					<View><Text style={tstyle}>{x.label}</Text></View>
    					</TouchableHighlight>
    				)	
        		})}
        	</View>
		)
	}
}

let style = {padding: 20, paddingVertical: 5, 
	borderTopWidth: .5, borderColor: '#ccc', alignItems: 'center'},
	tstyle = {
		fontSize: 17,
		color: '#0076ff'
	}