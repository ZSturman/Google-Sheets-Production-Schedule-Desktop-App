import { useData } from "../context/DataProvider";

const RefreshButton = () => {
  const { refreshData, loading } = useData();

  return (
    <button onClick={refreshData} disabled={loading}>
      {loading ? "Refreshing..." : "Refresh Data"}
    </button>
  );
};

export default RefreshButton;