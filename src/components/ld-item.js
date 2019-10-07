import React, { Component } from "react"
import styled from "styled-components"
import Img from "gatsby-image"

const Item = styled.div`
  margin: 16px;
  filter: grayscale(100%)};
  transition: all 0.5s ease;
  display: flex;
  align-items:center;
  opacity: ${props => (props.isVisible ? "1" : "0")};
  transform: translate(${props =>
    props.translateData ? props.translateData.left : "0px"}, ${props =>
  props.translateData ? props.translateData.top : "0px"}) scale(${props =>
  props.scaleData ? props.scaleData : "1"} );

  &:hover {
    filter: none;
  }
`

class LdItem extends Component {
  constructor(props) {
    super(props)

    this.fadeOut = this.fadeOut.bind(this)
    this.onClick = this.onClick.bind(this)
    this.zoomIn = this.zoomIn.bind(this)

    this.imageItem = React.createRef()

    this.state = {
      isVisible: true,
      translateData: null,
      scaleData: null,
    }
  }

  onClick() {
    this.props.onClickItem(this.props.imageId)
  }

  fadeIn() {
    this.setState({
      isVisible: true,
    })
  }

  fadeOut() {
    this.setState({
      isVisible: false,
    })
  }

  zoomOut() {
    this.setState({
      translateData: null,
      scaleData: null,
    })
  }

  zoomIn() {
    const node = this.imageItem.current.imageRef.current
    const nodeRect = node.getBoundingClientRect()

    const centeredTop = (window.innerHeight - nodeRect.height) / 2
    const centeredLeft = (window.innerWidth - nodeRect.width) / 2

    const scale = Math.min(
      window.innerWidth / nodeRect.width,
      window.innerHeight / nodeRect.height
    )

    const translateData = {
      top: `${Math.round(centeredTop - nodeRect.top).toString()}px`,
      left: `${Math.round(centeredLeft - nodeRect.left).toString()}px`,
    }

    this.setState({
      translateData,
    })

    setTimeout(() => {
      this.setState({
        translateData,
        scaleData: scale,
      })

      setTimeout(() => {
        this.props.showHdItem(this.props.index)
      }, 500)
    }, 600)
  }

  render() {
    return (
      <Item
        isVisible={this.state.isVisible}
        translateData={this.state.translateData}
        scaleData={this.state.scaleData}
        onClick={this.onClick}
      >
        <Img ref={this.imageItem} resolutions={this.props.image} />
      </Item>
    )
  }
}

export default LdItem
