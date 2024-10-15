import { Button } from "@material-tailwind/react";
import axios from "axios";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import Context from "../../contexts/BaseURLContext";
import { Friend_Request_Status } from "../../enums/Friend_Request_Status";
import {
  IFriendRequestsData,
  IGetFriendRequestsRes,
  IGetUsersRes,
  ISendFriendRequest,
} from "../../Interface/Interface";

type propType = {
  userId: string;
  friendRequestModel: boolean;
  setFriendRequestModel: (bool: boolean) => void;
};

enum ACTIVE_TAB {
  FRIEND_REQUEST = "Friend_Request",
  ADD_NEW_FRIENDS = "Add_new_friends",
}
export default function FriendRequestModel(props: PropsWithChildren<propType>) {
  const [usersData, setUsersData] = useState<
    | {
        _id: string;
        username: string;
        profilePhotoAddress: string;
        isFriendRequest: boolean;
      }[]
    | null
  >(null);

  const [sendRequest, setSendRequest] = useState<ISendFriendRequest>({
    isSend: false,
    data: null,
  });

  const [friendRequestData, setFriendRequestData] = useState<
    IFriendRequestsData[]
  >([]);

  const [activeTab, setActiveTab] = useState<ACTIVE_TAB>(
    ACTIVE_TAB.FRIEND_REQUEST
  );

  const [updateFriendRequest, setUpdateFriendRequest] = useState<{
    isUpdate: boolean;
    data: {
      messageId: string;
      requestStatus: Friend_Request_Status;
    } | null;
  }>({ isUpdate: false, data: null });

  const [searchUserNameInput, setSearchUserNameInput] = useState("");

  const [getFriendRequest, setGetFriendRequest] = useState(true);
  const urlContext = useContext(Context);
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get<IGetUsersRes>(
        `${urlContext.baseUrl}/user/getUsers/${props.userId}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setUsersData(res.data.message);
      })
      .catch((err) => {
        console.log("error occurred in finding users. error => ", err);
      });

    if (searchUserNameInput) {
      axios
        .post<IGetUsersRes>(
          `${urlContext.baseUrl}/user/getUsers`,
          { userNametoFind: searchUserNameInput, senderId: props.userId },
          {
            headers: { authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setUsersData(res.data.message);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(searchUserNameInput);
    }

    if (getFriendRequest) {
      axios
        .get<IGetFriendRequestsRes>(
          `${urlContext.baseUrl}/friend-request/${props.userId}`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          if (res.data.message) {
            const requests = res.data.message.map((request) => {
              return {
                username: request.request_by.username,
                profilePhotoAddress:
                  request.request_by.profilePhoto.fileAddress,
                friendRequestId: request._id,
                senderId: request.request_by._id,
              };
            });
            setGetFriendRequest(false);
            setFriendRequestData(requests);
          } else {
            setGetFriendRequest(false);
            setFriendRequestData([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (updateFriendRequest.isUpdate && updateFriendRequest.data) {
      axios
        .patch(
          `${urlContext.baseUrl}/friend-request`,
          updateFriendRequest.data,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setFriendRequestData((prvReqs) => {
            return prvReqs.length > 0
              ? prvReqs.filter(
                  (req) =>
                    req.friendRequestId !== updateFriendRequest.data?.messageId
                )
              : [];
          });
          setUpdateFriendRequest({ isUpdate: false, data: null });
          console.log(res.data);
        })
        .catch((err) => {
          console.log(
            "an error has been occurred in updating friend request. error => ",
            err
          );
        });
    }
    if (sendRequest.isSend && sendRequest.data) {
      axios
        .post(`${urlContext.baseUrl}/friend-request`, sendRequest.data, {
          headers: { authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res.data);
          setSendRequest({ isSend: false, data: null });
        })
        .catch((err) => {
          console.log("err in sending friend request. error => ", err);
        });
    }
  }, [
    getFriendRequest,
    props.userId,
    searchUserNameInput,
    sendRequest.data,
    sendRequest.isSend,
    token,
    updateFriendRequest.data,
    updateFriendRequest.isUpdate,
    urlContext.baseUrl,
  ]);

  return (
    <>
      {props.friendRequestModel && (
        <div
          className="fixed top-0 left-0 h-full w-full bg-black/15 z-[300]"
          onClick={() => {
            props.setFriendRequestModel(false);
            setActiveTab(ACTIVE_TAB.FRIEND_REQUEST);
          }}
        ></div>
      )}
      <div
        className={`fixed top-0 ${
          props.friendRequestModel
            ? "left-0 sm:left-[50%] sm:translate-x-[-50%]"
            : "left-[150vw]"
        } transition-all ease-in-out duration-500 h-full w-full sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:[20%] sm:h-[75%] sm:top-[50%] sm:translate-y-[-50%] sm:px-5 sm:py-6 flex flex-col items-center justify-center gap-1 py-2 shadow-2xl bg-white z-[300] text-[0.9rem]`}
      >
        <ImCross
          className="fixed top-2 right-2 size-8 p-2 bg-blue-600 rounded-md"
          color="white"
          onClick={() => {
            props.setFriendRequestModel(false);
            setActiveTab(ACTIVE_TAB.FRIEND_REQUEST);
          }}
        />
        <div className="w-full h-fit flex items-center justify-evenly mt-7">
          <div
            className={`w-full h-full cursor-pointer p-2 text-center ${
              activeTab === ACTIVE_TAB.FRIEND_REQUEST ? "bg-blue-gray-100" : ""
            }`}
            onClick={() => setActiveTab(ACTIVE_TAB.FRIEND_REQUEST)}
          >
            Friend Requests
          </div>
          <div
            className={`w-full h-full cursor-pointer p-2 text-center ${
              activeTab === ACTIVE_TAB.ADD_NEW_FRIENDS ? "bg-blue-gray-100" : ""
            }`}
            onClick={() => setActiveTab(ACTIVE_TAB.ADD_NEW_FRIENDS)}
          >
            Add new friend
          </div>
        </div>
        <div
          className={`w-[97%] h-full overflow-auto scroll-bar flex flex-col`}
        >
          {activeTab === ACTIVE_TAB.FRIEND_REQUEST && (
            <div className="w-full h-full mt-4 overflow-auto">
              <h2 className="text-center text-lg mb-3">Friend requests</h2>
              <div className="w-full h-[89.3%] overflow-auto scroll-bar">
                {friendRequestData &&
                  friendRequestData.map((friendRequest) => {
                    return (
                      <div
                        id={friendRequest.friendRequestId}
                        key={friendRequest.friendRequestId}
                        className={`flex h-fit w-full items-center justify-between border-b-2 p-2 hover:bg-black/10 transition-all ease-in-out`}
                      >
                        <div className="flex items-center gap-[1rem]">
                          <img
                            src={`${urlContext.imageUrl}/${friendRequest.profilePhotoAddress}`}
                            className="w-12 h-12 object-cover rounded-full"
                          />
                          <p>{friendRequest.username}</p>
                        </div>
                        <div className="flex items-center gap-[0.3rem]">
                          <Button
                            size="sm"
                            color="green"
                            className="rounded-[5px]"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            onClick={() => {
                              setUpdateFriendRequest({
                                isUpdate: true,
                                data: {
                                  messageId: friendRequest.friendRequestId,
                                  requestStatus: Friend_Request_Status.ACCEPTED,
                                },
                              });
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            color="red"
                            className="rounded-[5px]"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            onClick={() => {
                              setUpdateFriendRequest({
                                isUpdate: true,
                                data: {
                                  messageId: friendRequest.friendRequestId,
                                  requestStatus: Friend_Request_Status.REJECTED,
                                },
                              });
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          {activeTab === ACTIVE_TAB.ADD_NEW_FRIENDS && (
            <div className="w-full h-full mt-4 overflow-auto">
              <h2 className="text-center text-lg mb-1">Add new friends</h2>
              <div className="w-full h-[89.3%] overflow-auto scroll-bar">
                <input
                  type="text"
                  className="bg-gray-200 focus:outline-none px-5 py-2 w-[100%] rounded-full mb-2"
                  placeholder="search username"
                  onChange={(e) => {
                    setSearchUserNameInput(e.target.value);
                  }}
                  value={searchUserNameInput}
                />
                {usersData &&
                  usersData.map((user) => {
                    return (
                      <div
                        // id={""}
                        key={user._id}
                        className={`flex h-fit w-full items-center justify-between gap-2 border-b-2 p-2 hover:bg-black/10 transition-all ease-in-out`}
                      >
                        <div className="flex items-center gap-[1rem]">
                          <img
                            src={`${urlContext.imageUrl}/${user.profilePhotoAddress}`}
                            className="w-12 h-12 object-cover rounded-full"
                          />
                          <p>{user.username}</p>
                        </div>
                        <div className="flex items-center gap-[0.3rem]">
                          <Button
                            size="sm"
                            color="blue"
                            className="rounded-[5px]"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            onClick={() => {
                              setSendRequest({
                                isSend: true,
                                data: {
                                  senderId: props.userId,
                                  requestedUserId: user._id,
                                },
                              });
                            }}
                            disabled={user.isFriendRequest}
                          >
                            {user.isFriendRequest ? "Sent" : "Send Request"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
