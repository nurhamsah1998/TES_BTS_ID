/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useState } from "react";
import AXIOS from "./axios";

interface CHECKLIST {
  checklistCompletionStatus?: boolean;
  id?: number;
  items?: {
    id?: any;
    name?: any;
    itemCompletionStatus?: boolean;
  }[];
  name?: string;
}

function Home() {
  const [checklistName, setChecklistName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CHECKLIST[]>([]);
  const fetchData = async () => {
    try {
      const res = await AXIOS.get("/checklist");
      setData(res?.data?.data);
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.errorMessage || "ERROR GET DATA");
    }
  };
  const reset = () => {
    setChecklistName("");
    fetchData();
  };
  const handleSaveChecklist = async () => {
    setIsLoading(true);
    try {
      await AXIOS.post("/checklist", { name: checklistName });
      reset();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.errorMessage || "error");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteParent = async (i: CHECKLIST) => {
    try {
      await AXIOS.delete(`/checklist/${i.id}`);
      reset();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.errorMessage || "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", gap: "20px" }}>
        <p>Hello, {localStorage.getItem("USER")}</p>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          Log out
        </button>
      </div>
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 100px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ display: "grid" }}>
            <label>TODO</label>
            <div>
              <input
                value={checklistName}
                onChange={(i) => setChecklistName(i.target.value)}
              />
              <button disabled={isLoading} onClick={handleSaveChecklist}>
                create
              </button>
            </div>
          </div>
          <div style={{ display: "grid", marginTop: "20px" }}>
            <label>LIST TODO</label>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {data?.map((item) => {
                return (
                  <div
                    key={item.id}
                    style={{
                      display: "grid",
                      backgroundColor: "pink",
                      padding: "20px",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "30px" }}>{item?.name}</span>
                      <button
                        onClick={() => handleDeleteParent(item)}
                        style={{
                          background: "red",
                          color: "#fff",
                          marginLeft: "10px",
                        }}
                      >
                        Delete parent
                      </button>
                    </div>
                    <Item key={item?.id} item={item} reset={reset} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Item = memo(({ item, reset }: { item: any; reset: any }) => {
  const [toggleAddItem, setToggleAddItem] = useState(false);

  const [checkItem, setCheckItem] = useState("");
  const handleSaveItem = async (i: CHECKLIST) => {
    try {
      await AXIOS.post(`/checklist/${i?.id}/item`, { itemName: checkItem });
      reset();
      setToggleAddItem(false);
      setCheckItem("");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.errorMessage || "error");
    }
  };
  const handleCheck = async (i: any) => {
    try {
      await AXIOS.put(`/checklist/${item?.id}/item/${i?.id}`);
      reset();
      setToggleAddItem(false);
      setCheckItem("");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.errorMessage || "error");
    }
  };
  const handleDeleteChild = async (i: CHECKLIST) => {
    try {
      await AXIOS.delete(`/checklist/${item?.id}/item/${i.id}`);
      reset();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.errorMessage || "error");
    }
  };

  return (
    <div>
      {item?.items ? (
        <div>
          {item?.items?.map((child: any) => {
            return (
              <ItemChild
                child={child}
                handleCheck={handleCheck}
                handleDeleteChild={handleDeleteChild}
                item={item}
                reset={reset}
                key={child?.id}
              />
            );
          })}
        </div>
      ) : (
        <span>empty item</span>
      )}
      <div>
        {!toggleAddItem ? (
          <button onClick={() => setToggleAddItem(true)}>add item</button>
        ) : (
          <div>
            <input
              value={checkItem}
              onChange={(i) => setCheckItem(i.target.value)}
            />
            <button onClick={() => handleSaveItem(item)}>save</button>
          </div>
        )}
      </div>
    </div>
  );
});
const ItemChild = memo(
  ({
    child,
    handleCheck,
    handleDeleteChild,
    item,
    reset,
  }: {
    child: any;
    item: any;
    reset: any;
    handleCheck: any;
    handleDeleteChild: any;
  }) => {
    const [toggleRename, setToggleRename] = useState({
      togle: false,
      value: "",
    });
    const handleUpdateChild = async (i: CHECKLIST) => {
      try {
        await AXIOS.put(`/checklist/${item?.id}/item/rename/${i.id}`, {
          itemName: toggleRename?.value || "",
        });
        reset();
        setToggleRename({ value: "", togle: false });
      } catch (error: any) {
        console.error(error);
        alert(error?.response?.data?.errorMessage || "error");
      }
    };
    return (
      <div style={{ marginLeft: "20px" }} key={child?.id}>
        {toggleRename.togle ? (
          <div>
            <input
              value={toggleRename?.value}
              onChange={(i) =>
                setToggleRename((prev) => ({
                  ...prev,
                  value: i?.target?.value,
                }))
              }
              type="text"
            />
            <button
              onClick={() => handleUpdateChild(child)}
              style={{
                background: "green",
                color: "#fff",
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <div>
            <input
              type="checkbox"
              onChange={() => handleCheck(child)}
              defaultChecked={child?.itemCompletionStatus}
            />
            <span>{child?.name || "-"}</span>
            <button
              onClick={() =>
                setToggleRename({ togle: true, value: child?.name })
              }
              style={{
                background: "green",
                color: "#fff",
                marginLeft: "10px",
              }}
            >
              Rename child
            </button>
            <button
              onClick={() => handleDeleteChild(child)}
              style={{
                background: "red",
                color: "#fff",
                marginLeft: "5px",
              }}
            >
              Delete child
            </button>
          </div>
        )}
      </div>
    );
  }
);
export default Home;
