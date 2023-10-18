import React from 'react'

class DefaultImg extends React.Component {
  constructor(props) {
    super(props)
    this.srcUrl = this.srcUrl.bind(this)
  }

  componentWillMount() { }

  componentDidMount() {

  }
  srcUrl() {
    const { defaultimg } = this.props
    if (this.refs.Img.src !== defaultimg) {
      this.refs.Img.src = defaultimg
    }
  }

  render() {
    let { imgUrl, defaultimg, title } = this.props
    title = title || ''
    if (!imgUrl) {
      imgUrl = defaultimg
    }
    return (
      <img src={imgUrl} rel='nofollow' ref='Img' alt={title} title={title} onError={this.srcUrl} />
    )
  }
}

export default DefaultImg
