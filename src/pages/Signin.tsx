import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
} from "@ionic/react";
import "./Signin.css";
import { useState, useEffect } from "react";
// import {userSignIn} from '../actions/UserAction';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
// import {RootStore} from '../store';
import { userSignIn } from "../hooks/redux/actions/userAction";
import { RootStore } from "../hooks/redux/store";

declare global {
  interface Window {
    // ⚠️ notice that "Window" is capitalized here
    google: any;
  }
}

const Signin: React.FC = () => {
  /*
  function handleCallbackResponse(response: any) {
    const userObject: any = jwt_decode(response.credential);
    console.log("encoded JWT ID toekn", userObject);

    if (userObject && userObject?.email_verified) {
      window.location.href = "/home";
    }
  }
  useEffect(() => {
    const google = window?.google;
    google?.accounts.id.initialize({
      client_id:
        "580884249363-g8fr53jtk9me0u8lsu6sgvkh9mr8as0r.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "dark",
      size: "large",
      width: "100%",
    });
  }, []);

  const handleFailure = (result: any) => {
    console.log("Failed", result);
  };

  const handleLogin = (googleData: any) => {
    console.log(googleData);
  };
*/
  const user = useSelector((state: RootStore) => state.user);
  const [ref, setRef] = useState<any>("none");
  const { id } = useParams<any>();
  const [login, setLogin] = useState<any>({
    email: "",
    password: "",
    // billing: ref==="redirect" ? true : false
    billing: true,
    utk: id?.split("v?uveid=")[1]?.length > 0 ? id?.split("v?uveid=")[1] : "",
  });
  /*
  const Child = () => {
    if (id) {
      setRef(id);
      // setLogin({...login, billing:id==="redirect" ? true : false})
      console.log("ref", ref);
    }
  };

  useEffect(() => {
    alert("SignIN");
    Child();
  }, [id]);

  // check if signed in or not
  useEffect(() => {
    // window.location.href = "/signin";
    if (localStorage.getItem("session")) {
      window.location.href = "/home";
    } else {
    }
  }, []);

  */
  const dispatch = useDispatch();
  const SigninResponse = (res: any) => {
    console.log("response", res);
    if (res.status === 200) {
      // alert(res.user_type)
      if (res.user_type !== "admin") {
        setSigninMessage({
          ...signinMessage,
          status: "200",
          message:
            "Invalid Credentials, Wrong Email or Password. Please try again.",
        });
        return;
      }
      var temp_arr = res;
      temp_arr.session = "121232";
      console.log("new array", temp_arr);
      setSigninMessage({
        ...signinMessage,
        status: "200",
        message: "Signin successfully.",
      });
      localStorage.setItem("session", "live");
      localStorage.setItem("session_id", temp_arr.id);
      localStorage.setItem("email", temp_arr.email);
      localStorage.setItem("username", temp_arr.user_name);
      localStorage.setItem("user_dm", "url(/assets/girl.jpg)");

      if (ref === "redirect") {
        window.location.href = "/confirm_checkout";
      } else {
        window.location.href = "/home";
      }
    } else if (res.status === 500) {
      setSigninMessage({ ...signinMessage, status: "200", message: res.msg });
    }
  };

  const authentication = () => {
    console.log("updated ref", ref);
    dispatch(userSignIn(login, SigninResponse));
  };

  const [signinMessage, setSigninMessage] = useState<any>({
    status: "500",
    message: "",
  });
  return (
    <IonPage>
      <div
        className="auth-wrapper d-flex no-block justify-content-center align-items-center position-relative"
        style={{
          backgroundImage: `url(https://app.winnerx.shop/assets/img/shopping.jpg)`,
        }}
      >
        <div className="auth-box row" style={{ height: "auto" }}>
          <div className="signin-box col-lg-5 col-md-7">
            <div className="p-3">
              <h2 className="mt-3 text-center">Sign In</h2>

              <p className="text-center">
                Enter your email address and password to access admin panel.
              </p>
              <h6 style={{ fontSize: "13px", lineHeight: "1" }}>
                {signinMessage.message}
              </h6>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label className="text-dark">Username</label>
                    <input
                      className="form-control email forms_required"
                      id="uname"
                      value={login.email}
                      onChange={(e) => {
                        setLogin({ ...login, email: e.target.value });
                      }}
                      type="text"
                      placeholder="enter your username"
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label className="text-dark">Password</label>
                    <input
                      className="form-control password forms_required"
                      id="pwd"
                      value={login.password}
                      onChange={(e) => {
                        setLogin({ ...login, password: e.target.value });
                      }}
                      type="password"
                      placeholder="enter your password"
                    />
                  </div>
                </div>
                <div className="col-lg-12 text-center">
                  <button
                    onClick={() => {
                      authentication();
                    }}
                    type="submit"
                    className="btn btn-block btn-dark login_button"
                  >
                    Sign In
                  </button>
                </div>
                <div id="signInDiv" data-width="100%" data-height="200"></div>
                {/* <div className="col-lg-12 text-center mt-5">
                  Don't have an account?{" "}
                  <a href="./signup" className="text-danger">
                    Sign Up
                  </a>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default Signin;
