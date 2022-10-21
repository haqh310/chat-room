import React from "react";
import { Row, Col, Typography, Button } from "antd";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { addDocument, generateKeywords } from "../../firebase/service";
import { FacebookOutlined, GoogleSquareFilled } from "@ant-design/icons";

const { Title } = Typography;
const fbProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();

function Login() {
  const addNewUser = (data) => {
    const { user } = data;
    const additionalUserInfo = getAdditionalUserInfo(data);

    if (additionalUserInfo?.isNewUser) {
      const docData = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        providerId: additionalUserInfo.providerId,
        keywords: generateKeywords(user.displayName),
      };
      addDocument("users", docData);
    }
  };
  const handleFbLogin = async () => {
    const data = await signInWithPopup(auth, fbProvider);
    addNewUser(data);
  };

  const handleGoogleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    addNewUser(data);
  };

  return (
    <div>
      <Row justify="center" style={{ height: 800 }}>
        <Col span={8}>
          <Title style={{ textAlign: "center" }} level={3}>
            Fun Chat
          </Title>
          <Button
            style={{ width: "100%", marginBottom: 5 }}
            onClick={handleGoogleLogin}
          >
            <GoogleSquareFilled />
            Đăng nhập bằng Google
          </Button>
          <Button style={{ width: "100%" }} onClick={handleFbLogin}>
            <FacebookOutlined />
            Đăng nhập bằng Facebook
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
