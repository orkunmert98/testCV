import React from "react";
import Navigation from "./_components/Navigation.page";
import { Footer } from "./_components/Footer.page";
import { verifyEmail } from "./_services/user.service";

const decipher = (salt) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);
  return (encoded) =>
    encoded
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
};
//To decipher, you need to create a decipher and use it:
const myDecipher = decipher('mySecretSalt');

class Verify extends React.Component {
  constructor(props) {
    super(props);

    // Decrypt
    let decryptedData = myDecipher(this.props.match.params.useremail);
 
    this.state = {
      email: decryptedData,
      otp: "",
      loading: false,
      error: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  // USING METHOD TO SUMBIT FORM DETAILS TO SERVER
  handleSubmit(e) {
    e.preventDefault();
    const { email, otp } = this.state;

    // stop here if form is invalid
    if (!(email && otp)) {
      return;
    }

    this.setState({ loading: true });
    verifyEmail(this.state).then(
      (response) => {
        // IF GETTING RESPONSE TRUE THEN SHOULD BE VERIFY AND REDIRCT
        if (response.success) {
          this.props.history.push("/");
        } else {
          this.setState({ loading: false });
        }
      },
      (error) => this.setState({ error, loading: false })
    );
  }

  render() {
    const { email, otp, loading, error } = this.state;
    return (
      <div className="warper ">
        {/* <!--header-content-here--> */}
        <Navigation props={this.props} />
        {/* <!--header-content-end--> */}

        {/* <!--site-container-start--> */}
        <div className="site_content">
          <div className="heading-banner text-center">
            <div className="container">
              <h1>Verify your account!</h1>
              <p>OTP sent to your email, Please check and enter here!</p>
            </div>
          </div>
          <div className="login-form">
            <div className="container">
              <div className="login-form-box">
                <form method="post" onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      name="email"
                      placeholder="Your Email"
                      className="form-control"
                      value={email}
                      onChange={this.handleChange}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      className="form-control"
                      value={otp}
                      onChange={this.handleChange}
                      required
                      autoFocus
                    />
                  </div>
                  <button className="btn btn-purpal w-100" disabled={loading}>
                    {loading ? "Submit....." : "Submit"}
                  </button>
                  <div className="account-new-text text-center">
                    <span>
                      Don't have an account?{" "}
                      <a
                        href="javascript:void(0)"
                        onClick={() => this.props.history.push("/sign-up")}
                      >
                        Signup
                      </a>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* <!--site-container-end--> */}

        {/* <!--footer-here--> */}
        <Footer props={this.props} />
        {/* <!--footer-end--> */}
      </div>
    );
  }
}

export default Verify;
