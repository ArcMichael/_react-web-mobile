class PreLoadImage {
  constructor(props) {
    this.props = props;
  }

  render(_origin) {
    this.tag = new Image();
    this.tag.src = _origin;
    return new Promise((resolve, reject) => {
      this.tag.onerror = (err) => reject(err);
      this.tag.onload = () => resolve(_origin);
    });
  }
}

export default PreLoadImage;
