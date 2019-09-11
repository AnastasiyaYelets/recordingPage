import React, {PureComponent} from 'react'
import io from 'socket.io-client'

const BASE_URL = 'http://localhost:80' //TODO: to env
const CHUNKS_TIME = 10000
const MIME_TYPE = 'audio/webmcodecs=opus'
const socket = io(BASE_URL)
import Mic from './Mic'

class Recording extends PureComponent {
    queueSend = []
    queueChunks = []
    lastChunks = 0

    constructor(props) {
        super(props)

        this.state = {
            record: false,
            finish: '',

        }
    }

    componentDidMount() {
        socket.on('recording', this._recording)
        socket.on('finish', this._finish)


        this.indexPing = setInterval(() => {
            socket.emit('_ping', true)
        }, 1000)

        this._sendServerProcess()
        this._concatChunks()
    }

    componentWillUnmount() {
        socket.off('recording')
        clearInterval(this.indexPing)
        clearInterval(this.indexSend)
        clearInterval(this.indexChunks)
    }

    _sendServerProcess(item) {
        if (!item) {
            item = this.queueSend.shift()
            if (!item) {
                this.indexSend = setTimeout(() => {
                    this._sendServerProcess()
                }, 100)
                return
            }
        }


        const that = this
        const { id, blob } = item
        var xhr = new XMLHttpRequest()

        xhr.addEventListener("load", () => {
            that._sendServerProcess()
        }, false)
        xhr.addEventListener("error", () => {
            that._sendServerProcess(item)
        }, false)
        xhr.addEventListener("abort", () => {
            that._sendServerProcess(item)
        }, false)

        var fd = new FormData()
        fd.append("audio_data", blob, `${ id }.webm`)
        xhr.open("POST", `${ BASE_URL }/upload`, true)
        xhr.send(fd)

    }
    _finish = url => {
        this.setState({
            finish: url
        })
    }
    _concatChunks() {
        this.indexChunks = setInterval(() => {

            if (this.queueChunks.length === this.lastChunks) return

            const blob = new Blob(this.queueChunks.slice(this.lastChunks, -1), { 'type': MIME_TYPE })
            let id = new Date().toISOString()
            this.queueSend.push({
                blob,
                id,
            })
            this.lastChunks = this.queueChunks.length
        }, CHUNKS_TIME)
    }

    _recording = msg => {
        this.setState({
            record: msg
        })
    }

    startRecording = () => {
        socket.emit('recording', true)
        this.setState({
            record: true
        })
    }

    stopRecording = () => {
        this.setState({
            record: false
        })
        socket.emit('recording', false)
    }

    onData = recordedBlob => {
        this.queueChunks.push(recordedBlob)
    }

    onStop = recordedBlob => {
        socket.emit('sendSample', recordedBlob.blobURL)
        this.setState({
            finish: recordedBlob.blobURL
        })
        this.queueSend.push({
            id: 'finish',
            blob: recordedBlob.blob
        })

    }

    render() {
        const { finish, record } = this.state
        return (
            <div className="container">
                <div className="row">
                    <div className=" col-sm-12 col-md-12 col-lg-12 text-center" style={ { padding: '15px' } }>
                        <h3>recording</h3>
                        <div>
                          <Mic
                            record={record }
                            onStop={ this.onStop }
                            onData={ this.onData }
                          />

                          <br />
                          <div className="btn-group" role="group" aria-label="Basic example">
                              { !this.state.record ? (
                                  <button type="button" className="btn btn-info"
                                          onClick={ () => this.startRecording() }>
                                      Start
                                  </button>
                              ) : (
                                  <button type="button" className="btn btn-info"
                                          onClick={ () => this.stopRecording() }>
                                      Stop
                                  </button>
                              ) }
                              <br />
                              <a id="myButton" href={ BASE_URL + finish } download={ 'finish.webm'}  target="_blank">Download</a>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Recording
