import { Row, Col } from 'antd'
import React from 'react'
import ChatWindow from './ChatWindow'
import SideBar from './Sidebar'

function ChatRoom() {
  return (
        <Row>
            <Col span={5}>
                <SideBar/>
            </Col>
            <Col span={19}>
                <ChatWindow/>
            </Col>
        </Row>
  )
}

export default ChatRoom