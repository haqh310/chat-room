import React, { useContext, useMemo, useState } from "react";
import useFirestore from "../hooks/useFirestore";
import { AuthContext } from "../Context/AuthProvider";

export const AppContext = React.createContext();

function AppProvider({ children }) {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMemeberVisible, setIsInviteMemeberVisible] = useState(false);
  const [selectRoomId, setSelectRoomId] = useState(null);

  const {
    user: { uid },
  } = useContext(AuthContext);
  /* Room
   * {
   *   name: ten phong,
   *   description: mo ta,
   *   members: [uid1, uid2, ...]
   * }
   */
  const roomCondition = useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: uid,
    };
  }, [uid]);
  const rooms = useFirestore("rooms", roomCondition);

  const selectedRoom = React.useMemo(
    () => rooms.find((room) => room.id === selectRoomId) || {},
    [rooms, selectRoomId]
  );

  const userCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: selectedRoom.members,
    };
  }, [selectedRoom.members]);
  const members = useFirestore("users", userCondition);

  const clearState = () => {
    setSelectRoomId("");
    setIsAddRoomVisible(false);
    setIsInviteMemeberVisible(false);
  };
  return (
    <AppContext.Provider
      value={{
        rooms,
        members,
        selectedRoom,
        isAddRoomVisible,
        setIsAddRoomVisible,
        selectRoomId,
        setSelectRoomId,
        isInviteMemeberVisible,
        setIsInviteMemeberVisible,
        clearState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
