import { createMuiTheme } from '@material-ui/core'

const theme = createMuiTheme({
  palette: {
    primary: {
        light: '#6e8bca',
        main: '#3d5e99',
        dark: '#00356a',
        contrastText: '#ffffff',
      },
      secondary: {
        light: '#ffffff',
        main: '#eeeeee',
        dark: '#bcbcbc',
        contrastText: '#000000',
      },
      stepper: {
        iconColor: '#e85c5c',
      }
  },
  spacing: {
    unit: 10
  }
});

export default theme