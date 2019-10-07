import React, { Component } from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import GlobalStyles from "../styles/GlobalStyle"
import FeedItem from "../components/ld-item"
import HDItem from "../components/hd-item"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"

const Wrapper = styled.div`
  position: relative;
`
const Feed = styled.div`
  align-items: "center";
  visibility: ${props => (props.showHdItem ? "hidden" : "visible")};
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 40px;
  margin-top: 40px;
  position: absolute;
`

const Gallery = styled.div`
  overflow: hidden;
  position: fixed;
  transform: translate(calc(-1 * ${props => props.currentIndex} * 100vw), 0px);
  display: ${props => (props.showHdItem ? "inline-flex" : "none")};
`

export default class FlickrFeed extends Component {
  constructor(props) {
    super(props)

    const { images } = this.props.data

    this.onClickItem = this.onClickItem.bind(this)
    this.showHdItem = this.showHdItem.bind(this)
    this.onScroll = this.onScroll.bind(this)

    const feedItems = []
    const hdItems = []

    images.edges.forEach((image, index) => {
      feedItems.push(
        <FeedItem
          key={image.node.id}
          imageId={image.node.id}
          image={image.node.childImageSharp.resolutions}
          onClickItem={this.onClickItem}
          showHdItem={this.showHdItem}
          ref={React.createRef()}
          index={index}
        ></FeedItem>
      )

      hdItems.push(
        <HDItem
          key={image.node.id}
          image={image.node.childImageSharp.fluid}
          ref={React.createRef()}
          index={index}
        ></HDItem>
      )
    })

    this.state = {
      feedItems,
      hdItems,
      currentIndex: 0,
      showHdItem: false,
      startHdMode: false,
    }
  }

  onClickItem(imageId) {
    this.setState({
      startHdMode: true,
    })

    disableBodyScroll(document.body)
    this.state.feedItems.forEach(feedItem => {
      if (imageId !== feedItem.props.imageId) {
        feedItem.ref.current.fadeOut()
      } else {
        feedItem.ref.current.zoomIn()
      }
    })
  }

  showHdItem(index) {
    this.setState({
      currentIndex: index,
      showHdItem: true,
    })
  }

  onScroll() {
    if (this.state.showHdItem) {
      this.setState({
        showHdItem: false,
        startHdMode: false,
      })

      this.state.feedItems.forEach(feedItem => {
        if (feedItem.props.index === this.state.currentIndex) {
          feedItem.ref.current.fadeIn()
          feedItem.ref.current.zoomOut()
        } else {
          setTimeout(() => {
            feedItem.ref.current.fadeIn()
          }, 500)
        }
      })

      setTimeout(() => {
        enableBodyScroll(document.body)
      }, 500)
    }
  }

  componentWillMount() {
    window.addEventListener("wheel", this.onScroll)
  }

  componentWillUnmount() {
    window.removeEventListener("wheel", this.onScroll)
  }

  render() {
    return (
      <Wrapper showHdItem={this.state.showHdItem}>
        <GlobalStyles></GlobalStyles>
        <Feed showHdItem={this.state.showHdItem}>{this.state.feedItems}</Feed>
        <Gallery
          showHdItem={this.state.showHdItem}
          currentIndex={this.state.currentIndex}
        >
          {this.state.hdItems}
        </Gallery>
      </Wrapper>
    )
  }
}

export const query = graphql`
  query MyFlickrFeed {
    images: allFile(
      filter: { fields: { FlikrImage: { eq: "true" } } }
      sort: { fields: [fields___taken], order: DESC }
    ) {
      edges {
        node {
          childImageSharp {
            resolutions(width: 180) {
              ...GatsbyImageSharpResolutions
            }
            fluid(maxWidth: 1500) {
              ...GatsbyImageSharpFluid
            }
          }
          id
          fields {
            title
            taken
          }
        }
      }
    }
  }
`
