import React, { useContext } from "react";
import { Form, Modal, Input } from "antd";
import { AppContext } from "../../Context/AppProvider";
import { addDocument } from "../../firebase/service";
import { AuthContext } from "../../Context/AuthProvider";

function AddRoomModal() {
  const [form] = Form.useForm();
  const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
  const {
    user: { uid },
  } = useContext(AuthContext);

  const handleSubmit = () => {
    // Add new room
    addDocument("rooms", { ...form.getFieldValue(), members: [uid] });

    // reset form value
    form.resetFields();

    setIsAddRoomVisible(false);
  };
  const handleCancel = () => {
    // reset form value
    form.resetFields();

    setIsAddRoomVisible(false);
  };
  return (
    <div>
      <Modal
        title="Tên phòng"
        open={isAddRoomVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <Form form={form} layout={"vertical"}>
          <Form.Item label="Tên phòng" name={"name"}>
            <Input placeholder="Nhập tên phòng"></Input>
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Nhập mô tả"></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddRoomModal;
