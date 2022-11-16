import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import './Signup.css';
import React, {useState} from 'react';
// import {userSignUp, usersUpdate} from '../actions/UserAction';
// import {RootStore} from '../store';
import {useDispatch, useSelector} from 'react-redux';
import { userSignUp, usersUpdate } from '../hooks/redux/actions/userAction';
import { RootStore } from '../hooks/redux/store';


const Signup: React.FC = () => {

    const user = useSelector((state: RootStore) => state.user)

  const [signupMessage, setSignupMessage] = useState<any>({ 
    status: "500",
    message: ""
  });
  const [signup, setSignup] = useState<any>({ 
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    address: "",
    password: "",
    confirmPassword: "",
    org_name: "",
    user_type: "customer",
    user_type_main: "customer"
  });

  const dispatch = useDispatch();

  const SignupResponse = (res:any) => {
    console.log(res);

    if(res.status == 200)
    {
      setSignupMessage({...signupMessage, status: "200", message: "Signup successfully."});
      console.log("response from signup", res)
      dispatch(usersUpdate(res.id, res.utk, verificationMode));
    }
    else
    {
      setSignupMessage({...signupMessage, status: "500", message: res.msg});
    }
  }

  const signupUser = () => {
    if(signup.password === signup.confirmPassword)
    {
      const resultSignup = dispatch(userSignUp(signup, SignupResponse));
    }
    else
    {
      setSignupMessage({...signupMessage, status: "500", message: "Password did not match"});
    }
    
  }

  const verificationMode = () => {
    setTimeout(() => {
      window.location.href = "/signin";
    }, 500);
  }


  return (
    <>
      
      <div className="auth-wrapper d-flex no-block justify-content-center align-items-center position-relative"
             style={{backgroundImage: `url(assets/img/shopping.jpg)` }}>
            <div className="auth-box row">

                <div className="signup-box col-lg-8 col-md-8">
                    <div className="p-3">
                        <div className="text-center">
                            <img className="comp_logo" src="assets/img/workone-ico.png" alt="wrapkit" />
                        </div>
                        <h2 className="mt-3 text-center">Sign Up</h2>
                        <p className="text-center">Fill up information to sign in.</p>
                          <h6 style={{marginBottom: "10px"}}>{signupMessage.message}</h6>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="text-dark">First Name</label>
                                        <input className="form-control email forms_required" value = {signup.first_name} onChange={ (e) => { setSignup({ ...signup, first_name: e.target.value }) } } id="fname" type="text"
                                            placeholder="enter your first name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-dark">Last Name</label>
                                        <input className="form-control email forms_required" value = {signup.last_name} onChange={ (e) => { setSignup({ ...signup, last_name: e.target.value }) } } id="lname" type="text"
                                            placeholder="enter your last name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-dark">Email</label>
                                        <input className="form-control email forms_required" value = {signup.email} onChange={ (e) => { setSignup({ ...signup, email: e.target.value }) } } id="email" type="email"
                                            placeholder="enter your email" />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-dark">Username</label>
                                        <input className="form-control email forms_required" value = {signup.username} onChange={ (e) => { setSignup({ ...signup, username: e.target.value }) } } id="uname" type="text"
                                            placeholder="enter your username" />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-dark">Complete Address</label>
                                        <input className="form-control email forms_required" value = {signup.address} onChange={ (e) => { setSignup({ ...signup, address: e.target.value }) } } id="address" type="text"
                                            placeholder="enter your complete address" />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-dark">Password</label>
                                        <input className="form-control email forms_required" value = {signup.password} onChange={ (e) => { setSignup({ ...signup, password: e.target.value }) } } id="password" type="password"
                                            placeholder="enter your password" />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-dark">Confirm Password</label>
                                        <input className="form-control email forms_required" value = {signup.confirmPassword} onChange={ (e) => { setSignup({ ...signup, confirmPassword: e.target.value }) } } id="c-password" type="text"
                                            placeholder="Re-enter your password" />
                                    </div>
                                </div>
                                <div className="col-lg-12 text-center">
                                    <button type="submit" onClick={() => {signupUser();}} className="btn btn-block btn-dark login_button">Sign Up</button>
                                </div>
                                <div className="col-lg-12 text-center mt-5">
                                    Already having an account? <a href="./signin" className="text-danger">Sign In</a>
                                </div>
                            </div>
                        
                    </div>
                </div>
            </div>
        </div>

    </>
  );
};

export default Signup;
