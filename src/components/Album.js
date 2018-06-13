import React, {Component} from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      isPlaying: false,
      songVolume: '1'
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
    this.formatTime = this.formatTime.bind(this);
  }

  buttonController(song, index) {
    const pauseButton = <span className="ion-pause"></span>;
    const playButton = <span className="ion-play"></span>;
    const isSameSong = this.state.currentSong === song;
    

    if (this.state.isPlaying === false && this.state.hovered === song)  {
      return playButton;
    } else if (this.state.isPlaying === true && this.state.hovered === song && isSameSong) {
      return pauseButton;
    } else {
      return (index +1);
    }
  } 

  componentDidMount() {
    this.eventListeners = {
       timeupdate: e => {
         this.setState({ currentTime: this.audioElement.currentTime });
       },
       durationchange: e => {
         this.setState({ duration: this.audioElement.duration });
       },
       volumeupdate: e => {
         this.setState({ songVolume: this.audioElement.songVolume });
        }
     };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
   }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
   }

  formatTime(timeSeconds) {
    const minutes = Math.floor(timeSeconds / 60);
    const seconds = Math.floor(timeSeconds - minutes * 60);
    if (isNaN(timeSeconds)) {
      return "-:--";
    } else {
      return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }
  }

  handleNextClick(song) {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const albumEnd = this.state.album.songs.length - 1;
    const newIndex = Math.min(albumEnd, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
    } 

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
    } 

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) {this.setSong(song);
      }
      this.play();
    }
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
   }

  handleVolumeChange(e) {
    const newVolume = e.target.value;
    this.audioElement.songVolume = newVolume;
    this.setState({ songVolume: newVolume });
    this.audioElement.volume = newVolume;
  }

  mouseHoverOn(song) {
    this.setState({hovered: song});
  }

  mouseHoverOff(song) {
    this.setState({hovered: null});
  }    

  play() {
    this.audioElement.play();
    this.setState({isPlaying: true});
  }

  pause() {
    this.audioElement.pause();
    this.setState({isPlaying: false});
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({currentSong: song});
  }

  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <Grid>
          <Row>
            <Col xs={12} md={6} className="song-list-container">
              <table id="song-list" className="col-md-12">
                <colgroup>
                  <col id="song-number-column"/>
                  <col id="song-title-column"/>
                  <col id="song-duration-column"/> 
                </colgroup>
                <tbody>
                  {this.state.album.songs.map ((song, index) => 
                      <tr className="song" key={index} onClick={() => this.handleSongClick(song)} onMouseEnter={() => this.mouseHoverOn(song)} onMouseLeave={() => this.mouseHoverOff(song)}>
                        <td>{this.buttonController(song, index)} </td>
                        <td>{song.title}</td>
                        <td>{this.formatTime(song.duration)}</td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
            </Col>
            <Col xs={10} md={4}>
              <PlayerBar
                 isPlaying={this.state.isPlaying}
                 currentSong={this.state.currentSong}
                 currentTime={this.audioElement.currentTime}
                 songVolume={this.state.songVolume}
                 duration={this.audioElement.duration}
                 formatTime={(t) => this.formatTime(t)}
                 handleSongClick={() => this.handleSongClick(this.state.currentSong)}
                 handlePrevClick={() => this.handlePrevClick()}
                 handleNextClick={() => this.handleNextClick()}
                 handleTimeChange={(e) => this.handleTimeChange(e)}
                 handleVolumeChange={(e) => this.handleVolumeChange(e)}
               />
              </Col>
            </Row>
          </Grid>
      </section>
    );
  }
}

export default Album;