import { Alert, Avatar, Button, Form, Input, Tooltip } from "antd";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { UserAddOutlined } from "@ant-design/icons";
import Message from "./Message";
import { AppContext } from "../../Context/AppProvider";
import useFirestore from "../../hooks/useFirestore";
import { addDocument } from "../../firebase/service";
import { AuthContext } from "../../Context/AuthProvider";

const WrapperStyled = styled.div`
  height: 100vh;
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &_info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &_title {
      margin: 0;
      font-weight: bold;
    }

    &_description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

function ChatWindow() {
  const [inputValue, setInputValue] = useState("");
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);

  const { rooms, members, selectRoomId, setIsInviteMemeberVisible } =
    useContext(AppContext);

  const {
    user: { displayName, photoURL, uid },
  } = useContext(AuthContext);

  const selectRoom = useMemo(() => {
    return rooms.find((room) => room.id === selectRoomId);
  }, [rooms, selectRoomId]);

  const messageCondition = useMemo(() => {
    return {
      fieldName: "roomId",
      operator: "==",
      compareValue: selectRoom?.id,
    };
  }, [selectRoom?.id]);
  const messages = useFirestore("message", messageCondition);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = () => {
    addDocument("message", {
      text: inputValue,
      uid,
      photoURL,
      displayName,
      roomId: selectRoomId,
    });

    form.resetFields(["message"]);

    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messageListRef]);
  return (
    <WrapperStyled>
      {selectRoomId ? (
        <>
          <HeaderStyled>
            <div className="header_info">
              <p className="header_title">{selectRoom?.name}</p>
              <span className="header_description">
                {selectRoom?.description}
              </span>
            </div>
            <ButtonGroupStyled>
              <Button
                icon={<UserAddOutlined />}
                type="text"
                onClick={() => setIsInviteMemeberVisible(true)}
              >
                Mời
              </Button>
              <Avatar.Group size={"small"} maxCount={2}>
                {members.map((member) => (
                  <Tooltip title={member?.displayName} key={member?.uid}>
                    <Avatar src={member?.photoURL}>
                      {member?.photoURLuser
                        ? ""
                        : member.displayName.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </ButtonGroupStyled>
          </HeaderStyled>
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages.map((mes) => (
                <Message
                  key={mes.id}
                  text={mes.text}
                  photoURL={mes.photoURL}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                />
              ))}
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item name="message">
                <Input
                  ref={inputRef}
                  placeholder="Nhập tin nhắn..."
                  bordered={false}
                  autoComplete="off"
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                />
              </Form.Item>
              <Button type="primary" onClick={handleOnSubmit}>
                Gửi
              </Button>
            </FormStyled>
          </ContentStyled>
        </>
      ) : (
        <Alert
          message={"Hãy chọn phòng"}
          type="info"
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
}

export default ChatWindow;
