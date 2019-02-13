import React, { Component } from "react";
import {
  Grid,
  Checkbox,
  Input,
  Radio,
  Form,
  TextArea,
  Button,
  TabPane
} from "semantic-ui-react";
import { CsvAutoFill } from "csvautofilljs";
import { toast } from "react-toastify";

class FormSample extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      haveSocialMedia: false,
      likeToShopping: false,
      likeToReading: false,
      likeToTraveling: false,
      profilePictureLink: "",
      description: "",
      email: "",
      phoneNumber: "",
      fileName: null,
      file: null,
      error: "",
      title: ""
    };

    this.handleChangeFile = this.handleChangeFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
  }

  updateInputValue(e: any, field: string) {
    let state = {};
    if (field === "firstName") {
      state = {
        firstName: e.target.value
      };
    } else if (field === "lastName") {
      state = {
        lastName: e.target.value
      };
    } else if (field === "email") {
      state = {
        email: e.target.value
      };
    } else if (field === "phoneNumber") {
      state = {
        phoneNumber: e.target.value
      };
    } else if (field === "description") {
      state = {
        description: e.target.value
      };
    } else if (field === "profilePictureLink") {
      state = {
        profilePictureLink: e.target.value
      };
    } else if (field === "title") {
      state = {
        title: e.target.value
      };
    } else if (field === "haveSocialMedia") {
      state = {
        haveSocialMedia: !this.state.haveSocialMedia
      };
    } else if (field === "likeToReading") {
      state = {
        likeToReading: !this.state.likeToReading
      };
    } else if (field === "likeToShopping") {
      state = {
        likeToShopping: !this.state.likeToShopping
      };
    } else if (field === "likeToTraveling") {
      state = {
        likeToTraveling: !this.state.likeToTraveling
      };
    }

    this.setState(state);
  }

  handleChangeFile(e: any) {
    const file = e.target.files[0];
    let state = {};
    if (file) {
      state = {
        fileName: file.name,
        file
      };
    } else {
      state = {
        fileName: null,
        file: null
      };
    }
    this.setState(state);
    e.target.value = null;
  }

  handleUpload(e: any) {
    e.preventDefault();

    let result = CsvAutoFill.uploadFile({ file: this.state.file }).then(
      result => {
        console.log(result);
        if (result.statusCode === 1 && Array.isArray(result.data)) {
          let state = {};
          let x = result.data.forEach(val => {
            let key = val.key;
            let value;
            let el = document.getElementsByName("csv-" + key) as any;
            let type = el[0].getAttribute("type");
            let disabled = el[0].disabled;
            if (type === "checkbox" || type === "radio") {
              if (val.value.toString().toLowerCase() === "yes") {
                value = true;
              } else {
                value = false;
              }
            } else if (type === "number") {
              if (
                Number(val.value) !== NaN &&
                !val.value.match(/[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)/)
              ) {
                value = Number(val.value);
              } else {
                value = "";
              }
            } else {
              value = val.value;
            }
            if (disabled === false) {
              state = { ...state, [key]: value };
            }
          });

          this.setState({ ...state, error: "", fileName: "", file: null });
          toast.success("CSV Uploaded!");
        } else if (result.statusCode === 0 && !Array.isArray(result.data)) {
          this.setState({
            error: result.data.message,
            title: "",
            firstName: "",
            lastName: "",
            haveSocialMedia: false,
            likeToShopping: false,
            likeToReading: false,
            likeToTraveling: false,
            profilePictureLink: "",
            description: "",
            email: "",
            phoneNumber: "",
            fileName: "",
            file: null
          });
          toast.error("Failed to Upload!");
        }
      }
    );
  }

  render() {
    const likeToShopping = { checked: this.state.likeToShopping };
    const likeToReading = { checked: this.state.likeToReading };
    const likeToTraveling = { checked: this.state.likeToTraveling };
    let renderForm = (
      <TabPane>
        <Grid verticalAlign="top">
          <Grid.Row>
            <Grid.Column>
              <Grid>
                <Grid.Row verticalAlign={"middle"}>
                  <Grid.Column width={4}>
                    <label>Generate Template</label>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Button
                      onClick={() => {
                        CsvAutoFill.generateFile();
                        toast.success("CSV Downloaded!");
                      }}
                    >
                      Download
                    </Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Grid>
                <Grid.Row verticalAlign={"middle"}>
                  <Grid.Column width={4}>
                    <label>Upload CSV</label>
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <div className="choose-file-wrapper">
                      <label className="choose-file">
                        <Input
                          className="input-file"
                          type="file"
                          onChange={this.handleChangeFile}
                        />
                        <Input
                          className={
                            this.state.error !== ""
                              ? "error no-event"
                              : "no-event"
                          }
                          value={this.state.fileName ? this.state.fileName : ""}
                        />
                        <Button
                          className="no-event"
                          onClick={this.handleUpload}
                        >
                          Choose File
                        </Button>
                      </label>
                      <Button onClick={this.handleUpload}>Upload</Button>
                    </div>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="pt-0 pb-0">
                  <Grid.Column width={4} />
                  <Grid.Column width={4} className="color-danger">
                    {this.state.error}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Grid>
                <Grid.Row verticalAlign={"middle"}>
                  <Grid.Column width={4}>
                    <label htmlFor="csv-title" hidden>
                      Mr./Mrs./Ms.
                    </label>
                    <label>Title</label>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <select
                      value={this.state.title}
                      name="csv-title"
                      id="title"
                      onChange={e => this.updateInputValue(e, "title")}
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                    </select>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Grid>
                <Grid.Row verticalAlign={"middle"}>
                  <Grid.Column width={4}>
                    <label htmlFor="csv-firstName" hidden>
                      Your "first" name.
                    </label>
                    <label>First Name</label>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Input
                      fluid
                      name="csv-firstName"
                      placeholder="John"
                      value={this.state.firstName}
                      onChange={e => this.updateInputValue(e, "firstName")}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Grid>
                <Grid.Row verticalAlign={"middle"}>
                  <Grid.Column width={4}>
                    <label htmlFor="csv-lastName" hidden>
                      Your "last" name.
                    </label>
                    <label>Last Name</label>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Input
                      fluid
                      name="csv-lastName"
                      placeholder="Doe"
                      value={this.state.lastName}
                      onChange={e => this.updateInputValue(e, "lastName")}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Grid>
                <Grid.Row verticalAlign={"middle"}>
                  <Grid.Column width={4}>
                    <label htmlFor="csv-haveSocialMedia" hidden>
                      Yes or no
                    </label>
                    <label>Do you have social media?</label>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Radio
                      label="Yes"
                      name="csv-haveSocialMedia"
                      checked={this.state.haveSocialMedia}
                      disabled={true}
                      onChange={e =>
                        this.updateInputValue(e, "haveSocialMedia")
                      }
                    />{" "}
                    <Radio
                      label="No"
                      name="csv-haveSocialMedia"
                      checked={this.state.haveSocialMedia === false}
                      onChange={e =>
                        this.updateInputValue(e, "haveSocialMedia")
                      }
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Grid>
                <Grid.Row verticalAlign={"middle"}>
                  <Grid.Column width={4}>
                    <label htmlFor="csv-likeToShopping" hidden>
                      Yes or no
                    </label>
                    <label htmlFor="csv-likeToTraveling" hidden>
                      Yes or no
                    </label>
                    <label htmlFor="csv-likeToReading" hidden>
                      Yes or no
                    </label>
                    <label>Hobby</label>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Checkbox
                      name="csv-likeToShopping"
                      label="Shopping"
                      {...likeToShopping}
                      onChange={e => this.updateInputValue(e, "likeToShopping")}
                    />{" "}
                    <Checkbox
                      name="csv-likeToTraveling"
                      label="Travelling"
                      {...likeToTraveling}
                      onChange={e =>
                        this.updateInputValue(e, "likeToTraveling")
                      }
                    />{" "}
                    <Checkbox
                      name="csv-likeToReading"
                      label="Reading"
                      onChange={e => this.updateInputValue(e, "likeToReading")}
                      {...likeToReading}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Grid>
                <Grid.Row verticalAlign={"middle"}>
                  <Grid.Column width={4}>
                    <label htmlFor="csv-profilePictureLink" hidden>
                      Your profile picture link (e.g http:\\xyz.com)
                    </label>
                    <label>Profile Picture Link</label>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Input
                      fluid
                      name="csv-profilePictureLink"
                      placeholder="http://xyz.com"
                      value={this.state.profilePictureLink}
                      onChange={e =>
                        this.updateInputValue(e, "profilePictureLink")
                      }
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Grid>
                <Grid.Row verticalAlign={"top"}>
                  <Grid.Column width={4}>
                    <label htmlFor="csv-description" hidden>
                      Describe about yourself
                    </label>
                    <label>Description</label>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Form>
                      <TextArea
                        name="csv-description"
                        placeholder="Tell us more"
                        value={this.state.description}
                        onChange={e => this.updateInputValue(e, "description")}
                      />
                    </Form>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Grid>
                <Grid.Row verticalAlign={"top"}>
                  <Grid.Column width={4}>
                    <label htmlFor="csv-email" hidden>
                      Your email address
                    </label>
                    <label>Email</label>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Input
                      fluid
                      name="csv-email"
                      placeholder="jane.doe@xyz.com"
                      type="email"
                      value={this.state.email}
                      onChange={e => this.updateInputValue(e, "email")}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Grid>
                <Grid.Row verticalAlign={"top"}>
                  <Grid.Column width={4}>
                    <label htmlFor="csv-phoneNumber" hidden />
                    <label>Phone Number</label>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Input
                      fluid
                      name="csv-phoneNumber"
                      placeholder="8123456789"
                      value={this.state.phoneNumber}
                      onChange={e => this.updateInputValue(e, "phoneNumber")}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </TabPane>
    );

    return renderForm;
  }
}

export default FormSample;
