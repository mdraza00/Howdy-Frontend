import axios from "axios";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import {
  createOrGetChatRoomRes,
  getUsersRes,
  ImessageRes,
  ISelectedMessageData,
  User,
} from "../../Interface/Interface";
import Context from "../../contexts/BaseURLContext";
import { Button } from "@material-tailwind/react";
import rollingIcon from "/icons/RollingIcon.svg";

type propsType = {
  setSendMessage: (data: ImessageRes) => void;
  userId: string;
  setForwardMessages: (data: boolean) => void;
  selectedMessagesData: ISelectedMessageData[];
  setSelectedMessagesData: (data: ISelectedMessageData[]) => void;
};

export default function ForwardMessagesModel(
  props: PropsWithChildren<propsType>
) {
  const [usernameInput, setUsernameInput] = useState("");
  const [usersData, setUsersData] = useState<User[]>([]);
  const [selectedUsersData, setSelectedUsersData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const baseURL = useContext(Context);

  useEffect(() => {
    if (usernameInput.length > 0) {
      const url = `${baseURL.baseUrl}/chatroom/get-my-chatroom-members-by-name/${props.userId}/${usernameInput}`;
      axios
        .get<getUsersRes>(url, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUsersData(res.data.message);
        });
    } else {
      const url = `${baseURL.baseUrl}/chatroom/get-my-chatroom-members/${props.userId}`;
      axios
        .get<getUsersRes>(url, {
          headers: { authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUsersData(res.data.message);
        })
        .catch((err) => {
          console.log("error in fetching users. error = ", err);
        });
    }
    return () => {
      setUsersData([]);
    };
  }, [baseURL.baseUrl, props.userId, token, usernameInput]);
  return (
    <>
      <div
        className="fixed top-0 left-0 w-screen h-screen bg-black/15 z-[200]"
        onClick={() => props.setForwardMessages(false)}
      ></div>
      <div className="h-fit shadow-2xl border-2 border-black w-fit p-10 bg-white rounded-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[201]">
        <input
          type="text"
          className="bg-gray-200 focus:outline-none px-3 py-1 w-80 rounded-md"
          placeholder="search username"
          onChange={(e) => {
            setUsernameInput(e.target.value);
          }}
          value={usernameInput}
        />
        <div
          id="users-container"
          className={`h-96 w-80 overflow-auto scroll-bar mt-4 pr-1 flex flex-col`}
        >
          {usersData &&
            usersData.length > 0 &&
            usersData.map((userData) => (
              <div className="group flex items-center">
                <div className="h-full w-[10%] flex items-center justify-center border-b-2 group-hover:bg-black/10">
                  <input
                    id={`select-user-checkbox--${userData._id}`}
                    type="checkbox"
                    className=" size-4"
                    value={userData._id}
                    onChange={(e) => {
                      if (e.target.checked)
                        setSelectedUsersData((prvData) => [
                          ...prvData,
                          e.target.value,
                        ]);
                      else
                        setSelectedUsersData((prvData) =>
                          prvData.filter((ids) => ids !== e.target.value)
                        );
                    }}
                  />
                </div>
                <div
                  id={userData._id}
                  key={userData._id}
                  className={`flex items-center gap-2 border-b-2 p-2 cursor-pointer w-[90%] group-hover:bg-black/10 pl-5`}
                  onClick={() => {
                    const selectUserCheckBox = document.getElementById(
                      `select-user-checkbox--${userData._id}`
                    );
                    if (selectUserCheckBox) selectUserCheckBox.click();
                  }}
                >
                  <img
                    src={`${baseURL.baseUrl}/${userData.profilePhotoAddress}`}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <p>{userData.username}</p>
                </div>
              </div>
            ))}
        </div>
        <div className="mt-2 flex items-center justify-evenly">
          <Button
            onClick={() => {
              props.setForwardMessages(false);
            }}
            variant="outlined"
            className="w-[48%] h-10"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            cancel
          </Button>
          <Button
            onClick={() => {
              setIsLoading(true);

              selectedUsersData.forEach((userId) => {
                const recipientId = userId;
                const senderId = props.userId;
                const url = `${baseURL.baseUrl}/chatroom/createRoom`;
                // getting chatroom Id
                axios
                  .post<createOrGetChatRoomRes>(
                    url,
                    {
                      senderId,
                      recipientId,
                    },
                    { headers: { authorization: `Bearer ${token}` } }
                  )
                  .then((res) => {
                    const chatroomId = res.data.message;
                    const msgIds = props.selectedMessagesData.map(
                      (messageData) => messageData.messageId.split("--")[0]
                    );
                    msgIds.forEach((msgId) => {
                      axios
                        .post<ImessageRes>(
                          `${baseURL.baseUrl}/message/forward-message`,
                          {
                            chatroomId,
                            messageId: msgId,
                            senderId: props.userId,
                          },
                          { headers: { authorization: `Bearer ${token}` } }
                        )
                        .then((res) => {
                          setIsLoading(false);

                          props.setSendMessage({
                            status: true,
                            message: res.data.message,
                          });

                          props.setSelectedMessagesData([]);
                          props.setForwardMessages(false);
                        })
                        .catch((err) => {
                          console.log(err);
                          setIsLoading(false);
                        });
                    });
                  })
                  .catch((err) => {
                    setIsLoading(false);
                    console.log(
                      "an error has occured in creating chatroom. error = ",
                      err
                    );
                  });
              });
              setIsLoading(false);
              props.setForwardMessages(false);
              props.setSelectedMessagesData([]);
            }}
            className="w-[48%] flex items-center justify-center h-10 bg-blue-600 disabled:bg-gray-600"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {isLoading ? <img src={rollingIcon} className="w-10" /> : "Send"}
          </Button>
        </div>
      </div>
    </>
  );
}
