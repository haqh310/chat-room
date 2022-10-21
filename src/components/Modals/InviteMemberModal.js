import React, { useContext, useMemo, useState } from "react";
import { Avatar, Form, Modal, Select, Spin } from "antd";
import { debounce } from "lodash";
import {
  query,
  collection,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase/config";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";

function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props }) {
  const [fetching, setfetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setfetching(true);

      fetchOptions(value, props.curMembers).then((newOptions) => {
        setOptions(newOptions);
        setfetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions, props]);
  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {
        // [{label, value, photoURL}]
        options.map((opt) => (
          <Select.Option key={opt.value} value={opt.value} title={opt.label}>
            <Avatar size={"small"} src={opt.photoURL}>
              {opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
            </Avatar>
            {` ${opt.label}`}
          </Select.Option>
        ))
      }
    </Select>
  );
}

async function fetchUserList(search, curMembers) {
  const data = [];
  const q = query(
    collection(db, "users"),
    where("keywords", "array-contains", search),
    orderBy("displayName"),
    limit(20)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if (!curMembers.includes(doc.data().uid)) {
      data.push({
        label: doc.data().displayName,
        value: doc.data().uid,
        photoURL: doc.data().photoURL,
      });
    }
  });
  return data;
}

function InviteMemberModal() {
  const [form] = Form.useForm();
  const [value, setValue] = useState([]);

  const {
    isInviteMemeberVisible,
    setIsInviteMemeberVisible,
    selectRoomId,
    selectedRoom,
  } = useContext(AppContext);

  const handleSubmit = async () => {
    // Add new room
    const roomRef = doc(db, "rooms", selectRoomId);
    await updateDoc(roomRef, {
      members: [...selectedRoom.members, ...value.map((val) => val.value)],
    });

    // reset form value
    form.resetFields();

    setIsInviteMemeberVisible(false);
  };
  const handleCancel = () => {
    // reset form value
    form.resetFields();

    setIsInviteMemeberVisible(false);
  };
  return (
    <div>
      <Modal
        title="Tên phòng"
        open={isInviteMemeberVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form form={form} layout={"vertical"}>
          <DebounceSelect
            mode="multiple"
            name="search-user"
            label="Tên các thành viên"
            value={value}
            placeholder="Nhập tên thành viên"
            fetchOptions={fetchUserList}
            onChange={(newValue) => setValue(newValue)}
            style={{ width: "100%" }}
            curMembers={selectedRoom.members}
          ></DebounceSelect>
        </Form>
      </Modal>
    </div>
  );
}

export default InviteMemberModal;
