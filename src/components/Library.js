import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import albumData from './../data/albums';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class Library extends Component {
	constructor(props) {
		super(props);
		this.state = { albums: albumData };
	}
	render() {
    return (
      <section className="library">
        <Row>
          {this.state.albums.map( (album, index) =>
              <Col sm={12} md={6} key={index}>
              <Link to={`/album/${album.slug}`} key={index} >
                <img className="libraryImg" src={album.albumCover} alt={album.title} />
                <div className="libraryOverlay">
                  <div className="libraryText">        
                    <h3 className="libraryDescriptions">{album.title}</h3>
                    <h4 className="libraryDescriptions">{album.artist}</h4>
                    <p>{album.songs.length} songs</p>
                  </div>
                </div>
              </Link>
              </Col>
            )
          }
        </Row>
      </section>
    );
  }
}

export default Library;

