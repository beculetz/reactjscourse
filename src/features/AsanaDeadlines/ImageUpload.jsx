import React from "react";

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base64Data: null,
      type: null,
      name: null
    };
  }

  onChange = e => {
    //debugger;
    
    let file = e.target.files[0];
    this.setState({
      type: file.type,
      name: file.name
    });

    console.log('onchange image upload (file): ',file);

    if (file) {
      const reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  };

  _handleReaderLoaded = e => {
    let binaryString = e.target.result;
    this.setState({
      base64Data: btoa(binaryString)
    });
   };

  render() {
    const { base64Data, type, name } = this.state;
    return (
      <>
        {base64Data != null && <img className="d-block m-3" width="64" src={`data:${type};name:${name};base64,${base64Data}`} />}
        <input className="form-control"
          type="file"
          name={this.props.elName}
          id={this.props.elName}
          accept=".jpg, .jpeg, .png"
          {...this.props.register('task_img')}
          onChange={e => this.onChange(e) }
        />
        {this.props.errors.task_img && (
                <p className="fieldError">
                {this.props.errors.task_img.message}
                </p>
            )}
      </>
    );
  }
}

export default ImageUpload;
