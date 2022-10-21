import { Avatar, Button, Typography } from "antd";
import React, { useContext } from "react";
import styled from "styled-components";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { AuthContext } from "../../Context/AuthProvider";

const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgb(82, 38, 83);

  .username {
    color: white;
    margin-left: 5px;
  }
`;

function UserInfo() {
  const {
    user: { displayName, photoURL },
  } = useContext(AuthContext);

  const handleLogout = () => {
    signOut(auth);
  };
  return (
    <WrapperStyled>
      <div>
        <Avatar src={photoURL}>{photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}</Avatar>
        <Typography.Text className="username">{displayName}</Typography.Text>
      </div>
      <Button ghost onClick={handleLogout}>
        Đăng xuất
      </Button>
    </WrapperStyled>
  );
}

export default UserInfo;
