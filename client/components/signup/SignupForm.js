import React from 'react';
import timezones from '../../data/timezones';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import validateInput from '../../../server/shared/validations/singup';
import TextFieldGroup from '../common/TextFieldGroup';
import { withRouter } from 'react-router-dom';

class SignupForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: 'a',
      email: 'a',
      password: 'a',
      passwordConfirmation: 'a',
      timezone: 'a',
      errors: {},
      isLoading: false,
      invalid: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.checkUserExists = this.checkUserExists.bind(this);
  }

  onChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  checkUserExists(event) {
    const {name, value} = event.target;
    if (value !== '') {
      this.props.doesUserExist(value).then(res => {
        let errors = this.state.errors;
        let invalid = false;
        if (res.data.user) {
          errors[name] = `That ${name} has already been used`;
          invalid = true;
        } else {
          errors[name] = '';
        }
        this.setState({errors, invalid});
      });
    }
  }

  isValid() {
    const { errors, isValid } = validateInput(this.state);

    if (!isValid) {
      this.setState({ errors });
    }

    return isValid;
  }

  onSubmit(event) {
    event.preventDefault();

    if (this.isValid()) {
      this.setState({errors: {}, isLoading: true});
      this.props.userSignupRequest(this.state).then(() => {
        this.props.addFlashMessage({
          type: 'success',
          text: 'You signed up successfully. Welcome!',
        });
        this.props.history.push('/');
      }, error => {
        this.setState({errors: error.response.data, isLoading:false})
      });
    }
  }

  render() {
    const options = Object.keys(timezones).map((key) => {
      return <option key={timezones[key]} value={timezones[key]}>{key}</option>
    });
    const {errors, validated} = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <h1>Join our community!</h1>

        <TextFieldGroup label='Username' value={this.state.username}
          name='username' onChange={this.onChange} checkUserExists={this.checkUserExists} error={errors.username} />

        <TextFieldGroup label='Email' value={this.state.email}
          name='email' type='text' onChange={this.onChange} checkUserExists={this.checkUserExists} error={errors.email} />

        <TextFieldGroup label='Password' value={this.state.password}
          name='password' type='password' onChange={this.onChange} error={errors.password} />

        <TextFieldGroup label='Password Confirmation' value={this.state.passwordConfirmation}
          name='passwordConfirmation' type='password' onChange={this.onChange} error={errors.passwordConfirmation} />

        <div className='form-group'>
          <label className='control-label'>Timezone</label>
          <select
            value={this.state.timezone}
            onChange={this.onChange}
            name='timezone'
            className={classnames('form-control', {'is-invalid': errors.timezone})}
          >
            <option value='' disabled>Choose Your Timezone</option>
            {options}
          </select>
          {errors.timezone && <div className='invalid-feedback'>{errors.timezone}</div>}
        </div>

        <div className='form-group'>
          <button className='btn btn-primary btn-lg' disabled={this.state.isLoading || this.state.invalid}>
            Sign up
          </button>
        </div>
      </form>
    );
  }
}

SignupForm.propTypes = {
  userSignupRequest: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  doesUserExist: PropTypes.func.isRequired,
}

export default withRouter(SignupForm);