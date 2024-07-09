import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
// ⚠️⚠️⚠️ don't forget this ⚠️⚠️⚠️⚠️
import AdminMenu from "./AdminMenu";

const UserListcopy = () => {
  const { data: users = [], refetch, isLoading, error } = useGetUsersQuery(); // Initialize users with an empty array

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const [updateUser] = useUpdateUserMutation();

  const [filterType, setFilterType] = useState("all"); // Added state for filter type

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const filteredUsers = users.length > 0 ? users.filter((user) => { // Apply filter only if users is not empty
    switch (filterType) {
      case "admin":
        return user.isAdmin;
      case "manager":
        return user.isManager;
      case "staff":
        return user.isStaff;
      case "member":
        return !user.isAdmin && !user.isManager && !user.isStaff;
      default:
        return true; // Show all users if filterType is "all"
    }
  }) : []; // Return an empty array if users is empty

  return (

    <div className="p-12">
      <AdminMenu />

      <h1 className="text-2xl font-semibold mb-4"
        style={{ "margin-left": "50%" }}>Users</h1>
      <div className="flex mb-4"> {/* Added filter buttons */}
        <button style={{ "width": "60%" }}
        // className={`mr-2 px-4 py-2 rounded-lg ${filterType === "all" ? "bg-blue-500 text-white" : ""
        //   }`}
        // onClick={() => setFilterType("all")}
        >

        </button>
        <button
          className={`mr-2 px-4 py-2 rounded-lg ${filterType === "all" ? "bg-blue-500 text-white" : ""
            }`}
          onClick={() => setFilterType("all")}
        >
          All
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded-lg ${filterType === "admin" ? "bg-blue-500 text-white" : ""
            }`}
          onClick={() => setFilterType("admin")}
        >
          Admin
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded-lg ${filterType === "manager" ? "bg-blue-500 text-white" : ""
            }`}
          onClick={() => setFilterType("manager")}
        >
          Manager
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${filterType === "staff" ? "bg-blue-500 text-white" : ""
            }`}
          onClick={() => setFilterType("staff")}
        >
          Staff
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${filterType === "member" ? "bg-blue-500 text-white" : ""
            }`}
          onClick={() => setFilterType("member")}
        >
          Member
        </button>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : users.length === 0 ? (
        <Message variant="info">No users found.</Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          {/* <AdminMenu /> */}
          <table className="w-full md:w-4/5 mx-auto">
            <thead>
              <tr>

                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Admin</th>
                <th className="px-4 py-2 text-left">Manager</th>
                <th className="px-4 py-2 text-left">Staff</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>

                  <td className="px-4 py-2">
                    {editableUserId === user._id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editableUserName}
                          onChange={(e) => setEditableUserName(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        />
                        <button
                          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                          onClick={() => updateHandler(user._id)}
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {user.username}
                        {/* <button
                          onClick={() =>
                            toggleEdit(user._id, user.username, user.email)
                          }
                          className="ml-[1rem]"
                        >
                          <FaEdit />
                        </button> */}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editableUserId === user._id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editableUserEmail}
                          onChange={(e) => setEditableUserEmail(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        />
                        <button
                          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                          onClick={() => updateHandler(user._id)}
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                        {/* <button
                          onClick={() =>
                            toggleEdit(user._id, user.name, user.email)
                          }
                          className="ml-[1rem]"
                        >
                          <FaEdit />
                        </button> */}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {user.isManager ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {user.isStaff ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  {/* <td className="px-4 py-2">
                    {!user.isAdmin && (
                      <div className="flex">
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserListcopy;