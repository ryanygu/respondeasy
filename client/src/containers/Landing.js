import React, { Component } from "react";
import { Button, Grid } from '@material-ui/core';
import '../styles/home.css';

const flowers = require('../images/flowerGif.gif');

class Landing extends Component {
  render() {
    return (
      <div className={'homeBackground'}>
        <Grid container spacing={24}>
          <Grid className={'title'} item xs={12}>
            <img src={flowers} alt=""/>
            <h1>Let's plan the special day.</h1>
            <h3>Respondez, the intuitive invitation application.</h3>
            <Button variant="outlined" color="secondary" href="/register">
              Sign up
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Landing;
