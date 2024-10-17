import { PropsWithChildren, useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "../../contexts/BaseURLContext";
import {
  ICreateGroup,
  IFriend,
  IGetFriendRes,
} from "../../Interface/Interface";
import { TiTick } from "react-icons/ti";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";

type propsType = {
  userId: string;
  newGroup: boolean;
  setCreateGroup: (data: ICreateGroup) => void;
  setNewGroup: (bool: boolean) => void;
};

export default function AddGroupMembersModel(
  props: PropsWithChildren<propsType>
) {
  const [friendsData, setFriendsData] = useState<IFriend[] | undefined>(
    undefined
  );
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [usernameInput, setUsernameInput] = useState("");
  const [fetchFriends, setFetchFriends] = useState(true);
  const token = localStorage.getItem("token");
  const baseURL = useContext(Context);

  useEffect(() => {
    if (fetchFriends) {
      const url = `${baseURL.baseUrl}/user/get-friends/${props.userId}`;
      axios
        .get<IGetFriendRes>(url, {
          headers: { authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.message) setFriendsData(res.data.message);
        })
        .catch((err) => {
          console.log("error in fetching users. error = ", err);
        });
      setFetchFriends(false);
    }
  }, [baseURL.baseUrl, fetchFriends, props.userId, token]);
  return (
    <>
      {props.newGroup && (
        <div
          className="fixed top-0 left-0 hidden sm:block h-full w-full bg-black/15 z-[100]"
          onClick={() => {
            setSelectedFriends([]);
            props.setNewGroup(false);
          }}
        ></div>
      )}
      <div
        className={`fixed top-0 ${
          props.newGroup
            ? "left-0 sm:left-[50%] sm:translate-x-[-50%]"
            : "left-[150vw]"
        } transition-all ease-in-out duration-500 h-full w-full sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:[20%] sm:h-[70%] sm:top-[50%] sm:translate-y-[-50%] sm:px-5 sm:py-4 flex flex-col items-center justify-start gap-1 py-2 shadow-2xl bg-white z-[150] text-[0.9rem]`}
      >
        <div className="w-[100%] h-fit flex flex-col items-center justify-start gap-1 mb-2">
          <div className="flex items-start justify-center h-fit w-full mb-1">
            <FaArrowLeft
              className="rounded-full p-1 active:bg-black/15 "
              size={33}
              onClick={() => {
                setSelectedFriends([]);
                props.setNewGroup(false);
              }}
            />
            <span className="w-full py-1 pl-3 text-[1rem]">
              Add group member
            </span>
          </div>
          <input
            type="text"
            className="bg-gray-200 focus:outline-none px-5 py-[0.4rem] w-[100%] rounded-full"
            placeholder="search friend"
            onChange={(e) => {
              setUsernameInput(e.target.value);
            }}
            value={usernameInput}
          />
        </div>
        {friendsData &&
          friendsData.map((userData) => (
            <div
              id={userData._id}
              key={userData._id}
              className={`flex cursor-pointer h-fit w-full items-center gap-2 border-b-2 p-2 ${
                selectedFriends.includes(userData._id) ? "bg-black/15" : ""
              } `}
              onClick={() => {
                if (selectedFriends.includes(userData._id))
                  setSelectedFriends((prvData) =>
                    prvData.filter((userid) => userid != userData._id)
                  );
                else
                  setSelectedFriends((prvData) => [...prvData, userData._id]);
              }}
            >
              <div className="h-fit w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={`${baseURL.imageUrl}/${userData.profilePhotoAddress}`}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <p>{userData.username}</p>
                </div>
                {selectedFriends.includes(userData._id) && (
                  <TiTick className="bg-blue-600 text-white rounded-full p-[0.1rem] size-6 mr-3" />
                )}
              </div>
            </div>
          ))}
        <div className="absolute bottom-1 h-fit w-full flex items-center justify-center">
          {selectedFriends.length > 0 && (
            <button
              className="bg-blue-600 w-[5rem] rounded-full flex items-center justify-center"
              onClick={() => {
                setSelectedFriends([]);
                props.setNewGroup(false);
                props.setCreateGroup({
                  isCreate: true,
                  roomMembersId: selectedFriends,
                });
              }}
            >
              <FaArrowRightLong className="text-white size-8" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
