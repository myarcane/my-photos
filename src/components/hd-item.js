import React, { Component } from "react"
import styled from "styled-components"
import Img from "gatsby-image"

const Item = styled.div`
  width: ${props => props.window.width}px;
  height: ${props => props.window.height}px;
  display: flex;
  justify-content: center;
  align-items: center;
`

class HdItem extends Component {
  constructor(props) {
    super(props)

    this.updateWindowSize = this.updateWindowSize.bind(this)

    this.state = {
      width: 0,
      height: 0,
    }
  }

  updateWindowSize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  componentDidMount() {
    this.updateWindowSize()
    window.addEventListener("resize", this.updateWindowSize)
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowSize)
  }

  render() {
    return (
      <Item window={this.state}>
        <Img
          style={{ height: "100%", width: "100%" }}
          fluid={this.props.image}
          imgStyle={{ objectFit: "contain" }}
        />
      </Item>
    )
  }
}

export default HdItem
