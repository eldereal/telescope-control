import React, { Component } from 'react';
import { Slider, Flex, WingBlank, WhiteSpace, SegmentedControl, Toast  } from 'antd-mobile';

const speeds = [-16, -8, -4, -2, -1, -0.5, -0.2, -0.1, 0,
0.1, 0.2, 0.5, 1, 2, 4, 8, 16
];
const trackSpeeds = [-1, 0, 1];

class App extends Component {

    state = {
        ra: speeds.indexOf(0),
        raTrack: 0,
        dec: speeds.indexOf(0)
    };

    setRA = (value) => {
        this.setState({
            ra: value
        });
    }

    setRATrack = e => {
        this.setState({
            raTrack: e.nativeEvent.selectedSegmentIndex
        });
    }

    setDec = (value) => {
        this.setState({
            dec: value
        });
    }

    getRASpeed(state) {
        return trackSpeeds[state.raTrack] + speeds[state.ra];
    }

    getDecSpeed(state) {
        return speeds[state.dec];
    }

    componentDidUpdate(prevProps, prevState) {
        const updates = {};
        let anyChange = false;
        const prevRASpeed = this.getRASpeed(prevState);
        const currentRASpeed = this.getRASpeed(this.state);
        if (prevRASpeed !== currentRASpeed) {
            updates.ra = currentRASpeed;
            anyChange = true;
        }
        const prevDecSpeed = this.getDecSpeed(prevState);
        const currentDecSpeed = this.getDecSpeed(this.state);
        if (prevDecSpeed !== currentDecSpeed) {
            updates.dec = currentDecSpeed;
            anyChange = true;
        }
        if (anyChange) {
            console.log('update', updates);
            this.update(updates);
        }
    }

    async update(data) {
        try {
            const r = await fetch('/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!/2\d\d/.test(r.status)) {
                Toast.fail("Failed to update controller");
            }
        } catch (e) {
            Toast.fail(e.message);
        }        
    }

    render() {
        return (
            <div>
                <WhiteSpace size="lg" />
                <WingBlank size="lg">
                    <Flex>
                    <Flex.Item><p className="sub-title">R.A.: {speeds[this.state.ra]}</p></Flex.Item>
                    <Flex.Item><SegmentedControl 
                    values={['North', 'None', 'South']} 
                    selectedIndex={this.state.raTrack}
                    onChange={this.setRATrack}
                    /></Flex.Item>
                    </Flex>                    
                    
                    <Slider style={{marginTop: 10}} min={0} max={speeds.length - 1} value={this.state.ra} onChange={this.setRA} />
                </WingBlank>
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <WingBlank size="lg">
                    <Flex>
                    <Flex.Item><p className="sub-title">Dec: {speeds[this.state.dec]}</p></Flex.Item>
                    </Flex>    
                    <Slider style={{marginTop: 10}} min={0}max={speeds.length - 1} value={this.state.dec} onChange={this.setDec}/>
                </WingBlank>
            </div>
        );
    }
}

export default App;
