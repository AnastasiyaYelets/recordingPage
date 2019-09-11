import React, {Component} from 'react'
import io from 'socket.io-client'

const BASE_URL = 'http://localhost:80' //TODO: to env

const socket = io('http://localhost')

class Remote extends Component {
    state = {
        isRecording: false,
        sampleLink: '',
        chunks: [],
        isOpen: false,
        finish: ''
    }
    indexPing

    componentDidMount() {
        socket.on('recording', this._recording)
        socket.on('_pong', this._pong)
        socket.on('sendSample', this._sendSample)
        socket.on('chunk', this._chunk)
        socket.on('finish', this._finish)
    }

    _recording = msg => {
        this.setState({ isRecording: msg })
    }

    _pong = () => {
        this.setState({ isOpen: true })
        clearTimeout(this.indexPing)
        this.indexPing = setTimeout(() => {
            this.setState({ isOpen: false })
        }, 2000)
    }

    _sendSample = msg => {
        this.setState({ sampleLink: msg })
    }

    _chunk = url => {
      console.log('trrrrr')
        this.setState({
            chunks: [...this.state.chunks, url]
        })

    }
    _finish = url => {
        this.setState({
            finish: url
        })
    }

    startRecordingRemotely = () => {
        socket.emit('recording', true)
    }

    stopRecordingRemotely = () => {
        socket.emit('recording', false)
    }

    componentWillUnmount() {
        socket.off('recording')
        socket.off('connect')
        socket.off('sendSample')
    }

    render() {
        const { isRecording, isOpen } = this.state
        return (
            <div className="container">
                <div className="row">
                    <div className=" col-sm-12 col-md-12 col-lg-12" style={ { padding: '15px' } }>
                        <p>Open Status: { `${ isOpen }` }</p>
                        <p>Recording Status: { `${ isRecording }` }</p>
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-info" disabled={!isOpen}
                                    onClick={ () => this.startRecordingRemotely() }>
                                Start Recording Remotely
                            </button>
                            <button type="button" className="btn btn-info" disabled={!isOpen}
                                    onClick={ () => this.stopRecordingRemotely() }>
                                Stop Recording Remotely
                            </button>
                        </div>
                        {!isRecording && <p>
                            Sample Link: { this.state.finish && (
                            <a href={ BASE_URL + this.state.finish } download={ 'finish.webm' }  target="_blank">
                                Скачать запись
                            </a>
                        ) }
                        </p>
                        }
                        {isRecording && <p>
                            Sample Link: { this.state.chunks[0] && (
                            <a href={ BASE_URL + this.state.chunks[0] } download={ 'finish.webm' }  target="_blank">
                                Скачать фрагмент
                            </a>
                        ) }
                        </p>
                      }
                    </div>
                </div>
            </div>
        )
    }
}

export default Remote
