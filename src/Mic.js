import React, {PureComponent} from 'react'
import {ReactMic} from 'react-mic'
const MIME_TYPE = 'audio/webmcodecs=opus'

class Mic extends PureComponent {

    constructor(props) {
      super(props)
      this.onStop = this.props.onStop.bind(this)
      this.onData = this.props.onData.bind(this)
    }

    render() {
        const { record } = this.props
        return (

            <div>
                <ReactMic
                    record={ record }
                    className="sound-wave"
                    onStop={ this.onStop }
                    onData={ this.onData }
                    strokeColor="#000000"
                    backgroundColor="#FF4081"
                    mimeType={ MIME_TYPE }
                />
            </div>
        )
    }

}

export default Mic
