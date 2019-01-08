import React, { Component } from 'react';
import '../styles/form.css';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

//Textfield & Form
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

export default class SignUp extends Component {
    render() {
        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item xs={4}>
                    </Grid>
                    <Grid item xs={4}>
                        <div className='main'>
                            <h1 id='mainTitle'>Sign Up</h1>
                            <FormDiv />
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                </Grid>
            </div>
        )
    }
}


class FormDiv extends Component {
    state = {
        fields: {}
    };

    onChange = updatedValue => {
        this.setState({
        fields: {
            ...this.state.fields,
            ...updatedValue
        }
        });
    };

    render() {
        return (
        <MuiThemeProvider>
            <div className="App">
                <Form onChange={fields => this.onChange(fields)} />
            {/* <p>
                {JSON.stringify(this.state.fields, null, 2)}
            </p> */}
            </div>
        </MuiThemeProvider>
        );
    }
}



class Form extends React.Component {
    state = {
        name: "",
        email: "",
        allergies: "",
        password: ""
    };

    change = e => {
      this.props.onChange({ [e.target.name]: e.target.value });
      this.setState({
        [e.target.name]: e.target.value
      });
    };

    onSubmit = e => {
      e.preventDefault();
      this.setState({
        name: "",
        email: "",
        allergies: "",
        password: ""
      });
      this.props.onChange({
        name: "",
        email: "",
        allergies: "",
        password: ""
      });
    };

    render() {
      return (
        <form>
            <br />
            <TextField
            name="name"
            hintText="Name"
            floatingLabelText="Name"
            value={this.state.name}
            onChange={e => this.change(e)}
            floatingLabelFixed
            />
            <TextField
            name="email"
            hintText="E-mail"
            floatingLabelText="E-mail"
            value={this.state.email}
            onChange={e => this.change(e)}
            floatingLabelFixed
            />
            <TextField
            name="allergies"
            hintText="Allergies"
            floatingLabelText="Allergies"
            value={this.state.allergies}
            onChange={e => this.change(e)}
            floatingLabelFixed
            />
            <TextField
            name="password"
            hintText="Password"
            floatingLabelText="Password"
            value={this.state.password}
            onChange={e => this.change(e)}
            floatingLabelFixed
            />
            <br />
            <br />
          {/*<RaisedButton label="Edit" onClick={e => this.onSubmit(e)} primary />*/}
          <Button variant="outlined" color="secondary" href="/dashboard">
            Sign up
          </Button>
        </form>
      );
    }
  }
